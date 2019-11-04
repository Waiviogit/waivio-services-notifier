const { app } = require('./index');
const { clients } = require('../services');

exports.shareMessageBySubscribers = async (message = '') => {
    const { clients: subClients, error } = await clients.getAllSubscribers();
    if(error)return{ error };
    for(const client of subClients) {
        await app.telegram.sendMessage(client.client_id, message);
    }
};
