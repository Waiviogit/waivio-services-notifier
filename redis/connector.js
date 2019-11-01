const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../config');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const dbClients = [];
for (const server of config.redis.servers) {
    const dbClient = redis.createClient(server.port, '127.0.0.1', { retry_delay: 3000 });
    dbClient.select(config.redis.lastBlockDbNum);
    dbClient.on('error', (err) => {
        console.error(`Error on redis server ${server.name} which connect to port: ${server.port}`);
        console.error(err);
    });
    dbClients.push(dbClient);
}

module.exports = { dbClients };
