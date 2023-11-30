const mongoose = require('mongoose');
const config = require('../config');

const URI = process.env.MONGO_URI_NOTIFIER ? process.env.MONGO_URI_NOTIFIER : `mongodb://${config.db.host}:${config.db.port}/${config.db.database}`;

const connection = mongoose.createConnection(URI);

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
    console.log('db connected');
});

connection.on('close', () => console.log('closed db'));

module.exports = connection;
