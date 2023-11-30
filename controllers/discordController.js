const discord = require('../discord');


const getEngineAnnouncements = async (req, res, next) => {
    const { result, error } = await discord.messages.getEngineAnnouncements();
    if(error) return next(error);

    res.status(200).json({ result });
};

module.exports = {
    getEngineAnnouncements
};
