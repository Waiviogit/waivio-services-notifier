const { discordMessages } = require('../services');
const { GUILD_ID } = require('../constants/discord');

const oneDayInMilliseconds = 1000 * 60 * 60 * 24;


const getEngineAnnouncements = async () => {
    const oneDayAgoTimestamp = Date.now() - oneDayInMilliseconds;

    // avatar = https://cdn.discordapp.com/avatars/ + id/ + avatar.png
    const { result, error } = await discordMessages.find({
        filter: {
            createdTimestamp: { $gte: oneDayAgoTimestamp },
            guildId: GUILD_ID.HIVE_ENGINE

        },
        options: {
            sort: { createdTimestamp: 1 }//
        }
    });

    if(error) return { error: { status: 500, messages: 'db error' } };


    return { result };
};

module.exports = {
    getEngineAnnouncements
};
