const { app } = require('./index');
const { clients } = require('../services');
const extra = require('telegraf/extra');
const markup = extra.markdown();

exports.shareMessageBySubscribers = async (message = '') => {
    const { clients: subClients, error } = await clients.getAllSubscribers();
    if(error)return{ error };
    for(const client of subClients) {
        await app.telegram.sendMessage(client.client_id, message);
    }
};

exports.shareBySpecificSubscribers = async (type, message, id) => {
    const { clients: subClients, error } = await clients.getSpecificSubscribers(type);
    if(error)return{ error };
    for(const client of subClients) {
        await app.telegram.sendMessage(client.client_id, message, {
            parse_mode: 'MarkdownV2',
            reply_markup: { inline_keyboard: [ [ { text: 'Go to sentry', url: `https://sentry.io/organizations/waivio/issues/?project=${id}` } ] ] }
        });
    }
};
