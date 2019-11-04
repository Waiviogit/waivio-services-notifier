const Telegraf = require('telegraf');
const { TELEGRAM_BOT_TOKEN } = require('../config');

const app = new Telegraf(process.env.BOT_TOKEN || TELEGRAM_BOT_TOKEN);

module.exports = { app };
