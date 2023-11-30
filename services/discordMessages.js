const { discordMessage } = require('./../database').models;

const create = async (message) => {
    try {
        const { createdTimestamp, content, guildId, channelId } = message;
        const { id, avatar, username } = message.author;

        const result = await discordMessage.create({
            content,
            userId: id,
            username,
            avatar,
            createdTimestamp,
            guildId,
            channelId
        });

        return { result };
    } catch (error) {
        return { error };
    }
};


const find = async ({ filter, projection, options }) => {
    try {
        const result = await discordMessage.find(filter, projection, options);
        return { result };

    } catch (error) {
        return { error };
    }
};


module.exports = {
    create,
    find
};
