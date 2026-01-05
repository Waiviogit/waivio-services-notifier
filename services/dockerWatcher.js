const Docker = require('dockerode');
const os = require('os');
const config = require('../config/config.json');
const { shareMessageBySubscribers } = require('../telegram/broadcasts');

class DockerWatcher {
    constructor() {
        const dockerOptions = this.getDockerOptions();
        this.docker = new Docker(dockerOptions);
        this.watchedContainers = config.docker?.watchedContainers || [];
        this.containerStates = new Map();
        this.eventStream = null;
    }

    getDockerOptions() {
        const dockerConfig = config.docker || {};
        
        if (dockerConfig.socketPath) {
            return { socketPath: dockerConfig.socketPath };
        }
        
        if (os.platform() === 'win32') {
            return { socketPath: '\\\\.\\pipe\\docker_engine' };
        }
        
        return { socketPath: '/var/run/docker.sock' };
    }

    async initialize() {
        try {
            await this.docker.ping();
            console.log('Docker connection established');
            
            await this.updateContainerStates();
            this.startWatching();
        } catch (error) {
            console.error('Failed to connect to Docker:', error.message);
            console.error('Make sure Docker socket is mounted. For containers, mount: -v /var/run/docker.sock:/var/run/docker.sock');
            console.error('Or configure custom socket path in config.json: docker.socketPath');
            throw error;
        }
    }

    async updateContainerStates() {
        try {
            const containers = await this.docker.listContainers({ all: true });
            
            for (const containerInfo of containers) {
                const containerNames = containerInfo.Names.map(name => name.replace(/^\//, ''));
                
                for (const watchedName of this.watchedContainers) {
                    if (containerNames.some(name => name.includes(watchedName))) {
                        const container = this.docker.getContainer(containerInfo.Id);
                        const containerData = await container.inspect();
                        
                        this.containerStates.set(watchedName, {
                            id: containerInfo.Id,
                            name: containerNames[0],
                            status: containerInfo.Status,
                            state: containerData.State.Status,
                            startedAt: containerData.State.StartedAt,
                            restartCount: containerData.RestartCount || 0
                        });
                        break;
                    }
                }
            }
        } catch (error) {
            console.error('Error updating container states:', error.message);
        }
    }

    async getContainerState(containerName) {
        await this.updateContainerStates();
        return this.containerStates.get(containerName) || null;
    }

    async getAllContainerStates() {
        await this.updateContainerStates();
        const states = {};
        for (const [name, state] of this.containerStates.entries()) {
            states[name] = state;
        }
        return states;
    }

    escapeMarkdownV2(text) {
        if (!text) return '';
        return String(text).replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
    }

    formatContainerState(state) {
        if (!state) return 'Container not found';
        
        return `*Container:* ${this.escapeMarkdownV2(state.name)}
*Status:* ${this.escapeMarkdownV2(state.status)}
*State:* ${this.escapeMarkdownV2(state.state)}
*Restart Count:* ${this.escapeMarkdownV2(state.restartCount)}
*Started At:* ${this.escapeMarkdownV2(state.startedAt || 'N/A')}`;
    }

    async handleContainerEvent(event) {
        if (!event || !event.Actor || !event.Actor.Attributes) return;

        const containerName = event.Actor.Attributes.name;
        if (!containerName) return;

        const isWatched = this.watchedContainers.some(watched => containerName.includes(watched));
        if (!isWatched) return;

        const eventType = event.Action;
        
        if (eventType === 'start' || eventType === 'restart') {
            const previousState = this.containerStates.get(containerName);
            await this.updateContainerStates();
            const currentState = this.containerStates.get(containerName);

            if (eventType === 'restart' || (previousState && previousState.state !== 'running' && currentState && currentState.state === 'running')) {
                const message = `🔄 *Container Restarted*
${this.formatContainerState(currentState)}`;
                
                try {
                    await shareMessageBySubscribers(message);
                } catch (error) {
                    console.error('Error sending restart notification:', error.message);
                }
            } else if (eventType === 'start') {
                const message = `▶️ *Container Started*
${this.formatContainerState(currentState)}`;
                
                try {
                    await shareMessageBySubscribers(message);
                } catch (error) {
                    console.error('Error sending start notification:', error.message);
                }
            }
        } else if (eventType === 'die') {
            await this.updateContainerStates();
            const currentState = this.containerStates.get(containerName);
            
            const message = `⚠️ *Container Stopped*
${this.formatContainerState(currentState)}`;
            
            try {
                await shareMessageBySubscribers(message);
            } catch (error) {
                console.error('Error sending stop notification:', error.message);
            }
        }
    }

    startWatching() {
        if (this.eventStream) {
            this.eventStream.destroy();
        }

        this.eventStream = this.docker.getEvents((err, stream) => {
            if (err) {
                console.error('Error getting Docker events:', err.message);
                setTimeout(() => this.startWatching(), 5000);
                return;
            }

            stream.on('data', (chunk) => {
                try {
                    const event = JSON.parse(chunk.toString());
                    this.handleContainerEvent(event);
                } catch (error) {
                    console.error('Error parsing Docker event:', error.message);
                }
            });

            stream.on('error', (error) => {
                console.error('Docker event stream error:', error.message);
                setTimeout(() => this.startWatching(), 5000);
            });

            stream.on('end', () => {
                console.log('Docker event stream ended, reconnecting...');
                setTimeout(() => this.startWatching(), 5000);
            });
        });

        console.log(`Docker watcher started, monitoring ${this.watchedContainers.length} container(s): ${this.watchedContainers.join(', ')}`);
    }

    stopWatching() {
        if (this.eventStream) {
            this.eventStream.destroy();
            this.eventStream = null;
        }
    }
}

const dockerWatcher = new DockerWatcher();

module.exports = {
    initialize: () => dockerWatcher.initialize(),
    getContainerState: (containerName) => dockerWatcher.getContainerState(containerName),
    getAllContainerStates: () => dockerWatcher.getAllContainerStates(),
    stop: () => dockerWatcher.stopWatching()
};

