const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { discordMessages } = require('../services');
const { GUILD_ID, CHANNEL_ID } = require('../constants/discord');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [ Partials.Channel ]
});

const hiveEngineServerHandler = async (message) => {
    // read messages only from official announcements channel
    if(message.channel.id !== CHANNEL_ID.ENGINE_ANNOUNCEMENTS) return;
    // read messages only for @everyone
    if (!message.mentions.everyone) return;

    await discordMessages.create(message);
};

const guildHandlers = {
    [ GUILD_ID.HIVE_ENGINE ]: hiveEngineServerHandler,
    default: () => {}
};


client.on('messageCreate', (message) => {

    const guildHandler = guildHandlers[ message.guild.id ] || guildHandlers.default;
    guildHandler(message);
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});
// Log in to Discord
client.login(process.env.DICORD_ENGINE_BOT);
