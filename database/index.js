const notifierdb = require('./notifierdb_connect');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('debug', process.env.NODE_ENV === 'development');

module.exports = {
    Mongoose: notifierdb,
    models: {
        client: require('./schemas/clientSchema')
    }
};
