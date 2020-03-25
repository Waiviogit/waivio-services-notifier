const config = require('../../config');
const RedisSMQ = require('rsmq');
const importRsmqClient = new RedisSMQ(
    { ns: 'rsmq', host: '127.0.0.1', port: config.redis.importServer.port, options: { db: config.redis.importServer.db_num } });

module.exports = { importRsmqClient };
