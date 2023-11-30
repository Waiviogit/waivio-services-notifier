const db = require('../notifierdb_connect');
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    userId: { type: String, required: true },
    guildId: { type: String, required: true, index: true },
    channelId: { type: String, required: true, index: true },
    username: { type: String, required: true },
    avatar: { type: String, required: true },
    createdTimestamp: { type: Number, required: true }
});

MessageSchema.index({ createdTimestamp: -1 });


module.exports = db.model('discord_messages', MessageSchema);
