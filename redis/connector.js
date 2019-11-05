const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../config');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const dbClients = [];
for (const server of config.redis.servers) {
    for(const db of server.databases) {
        const dbClient = redis.createClient(server.port, '127.0.0.1', { retry_delay: 3000 });
        dbClient.select(db.db_num);
        // dbClient.lastBlockKeys = db.keys;
        dbClient.connection_options = { server_name: server.name, db_num: db.db_num, last_block_keys: db.keys };
        dbClient.on('error', (err) => {
            console.error(`Error on redis server ${server.name} which connect to port: ${server.port} on DB: ${db.db_num}`);
            console.error(err);
        });
        dbClients.push(dbClient);
    }
}

console.log(`${dbClients.length} Redis databases successful connected!`);


module.exports = { dbClients };
