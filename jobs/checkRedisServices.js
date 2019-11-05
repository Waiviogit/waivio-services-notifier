const { CronJob } = require('cron');
const { redisGetter, connector: { dbClients } } = require('../redis');
const { getHeadBlockNum } = require('../utilities/steem');
const { shareMessageBySubscribers } = require('../telegram/broadcasts');
const _ = require('lodash');
const BUFFER_BLOCK_COUNT = 100;

const check = async () => {
    const success_messages = [];
    const warn_messages = [];
    const head_block = await getHeadBlockNum();
    for(const redisClient of dbClients) {
        for(const key of _.get(redisClient, 'connection_options.last_block_keys')) {
            const actualBlock = await redisGetter.getByKey(key, redisClient);
            if(+actualBlock + BUFFER_BLOCK_COUNT < head_block) {
                warn_messages.push(
                    createWarningMessage(redisClient.connection_options.server_name, redisClient.connection_options.db_num, key, actualBlock, head_block)
                );
            } else {
                success_messages.push(
                    createSuccessMessage(redisClient.connection_options.server_name, redisClient.connection_options.db_num, key, actualBlock, head_block)
                );
            }
        }
    }
    return { success_messages, warn_messages };
};

const createWarningMessage = (server_name, db_num, key, actual_block = 0, expected_block = 0) => {
    return `Warning on ${server_name} server, on DB number ${db_num} with key: ${key}.\n Delay for ${expected_block - actual_block} block(s).`;
};
const createSuccessMessage = (server_name, db_num, key, actual_block = 0, expected_block = 0) => {
    return `Success on ${server_name} server, on DB number ${db_num} with key: ${key}.\n Delay for ${expected_block - actual_block} block(s).`;
};

const job = new CronJob('0 */30 * * * *', async () => {
    // check services every N minutes
    const { success_messages, warn_messages } = await check();
    for(const message of warn_messages) {
        const res = await shareMessageBySubscribers(message);
        if(_.get(res, 'error')) console.error(res.error);
    }
    // for(const message of success_messages) {
    //     const res = await shareMessageBySubscribers(message);
    //     if(_.get(res, 'error')) console.error(res.error);
    // }
}, null, true, null, null, true);

job.start();

module.exports = { check };