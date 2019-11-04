const cron = require('cron');
const { redisGetter, connector: { dbClients } } = require('../redis');
const { getHeadBlockNum } = require('../utilities/steem');
const BUFFER_BLOCK_COUNT = 100;

const check = async () => {
    const success_messages = [];
    const warn_messages = [];
    const head_block = await getHeadBlockNum();
    for(const redisClient of dbClients) {
        for(const key of redisClient.lastBlockKeys) {
            const actualBlock = await redisGetter.getByKey(key, redisClient);
            if(actualBlock + BUFFER_BLOCK_COUNT < head_block) {
                warn_messages.push(
                    createWarningMessage(redisClient.info.server_name, redisClient.info.db_num, key, actualBlock, head_block)
                );
            } else {
                success_messages.push(
                    createSuccessMessage(redisClient.info.server_name, redisClient.info.db_num, key, actualBlock, head_block)
                );
            }
        }
    }
    return { success_messages, warn_messages };
};

const createWarningMessage = (server_name, db_num, key, actual_block = 0, expected_block = 0) => {
    return `Warning on ${server_name} server, on DB number ${db_num} with key: ${key}!\n Delay for ${expected_block - actual_block} blocks`;
};
const createSuccessMessage = (server_name, db_num, key, actual_block = 0, expected_block = 0) => {
    return `Success on ${server_name} server, on DB number ${db_num} with key: ${key}!\n Delay for ${expected_block - actual_block} blocks`;
};

