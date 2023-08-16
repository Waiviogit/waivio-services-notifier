const { CronJob } = require('cron');
const { redisGetter, connector: { dbClients } } = require('../redis');
const { importRsmqClient } = require('../redis/rsmq');
const { getHeadBlockNum } = require('../utilities/steem');
const { shareMessageBySubscribers } = require('../telegram/broadcasts');
const _ = require('lodash');
const { getLastHiveEngineBlock } = require('../utilities/helpers/getLastHiveEngineBlockHelper');
const { HIVE_ENGINE_REDIS_KEYS } = require('../constants/hiveEngineRequestData');
const BUFFER_BLOCK_COUNT = 100;
const MAX_IMP_QUEUE_LENGTH = 200;

const check = async () => {
    const success_messages = [];
    const warn_messages = [];
    const head_block = await getHeadBlockNum();
    const head_block_hive_engine = await getLastHiveEngineBlock();
    for(const redisClient of dbClients) {
        for(const key of _.get(redisClient, 'connection_options.last_block_keys')) {
            const actualBlock = await redisGetter.getByKey(key, redisClient);
            if (HIVE_ENGINE_REDIS_KEYS.includes(key)) {
                (+actualBlock + BUFFER_BLOCK_COUNT) < head_block_hive_engine ? warn_messages.push(
                    createWarningMessage(
                        redisClient.connection_options.server_name,
                        redisClient.connection_options.db_num,
                        key,
                        actualBlock,
                        head_block_hive_engine
                    )) : success_messages.push(
                    createSuccessMessage(
                        redisClient.connection_options.server_name,
                        redisClient.connection_options.db_num,
                        key,
                        actualBlock,
                        head_block_hive_engine
                    ));
            } else if(+actualBlock + BUFFER_BLOCK_COUNT < head_block) {
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
    const { successMsg, warnMsg } = await checkImportService('import_wobjects', importRsmqClient, MAX_IMP_QUEUE_LENGTH);
    if (successMsg) success_messages.push(successMsg);
    if (warnMsg) warn_messages.push(warnMsg);
    return { success_messages, warn_messages };
};

const checkImportService = async (qname, client, queueLength) => {
    try{
        const attributes = await client.getQueueAttributesAsync({ qname });
        if (attributes.msgs > queueLength) {
            return { warnMsg: `Warning on \`${qname}\` queue, max allowed length \`${queueLength}\`.\n Now queue size \`${attributes.msgs}\`.` };
        }
        return { successMsg: `Success on \`${qname}\` queue, max allowed length \`${queueLength}\`.\n Now queue size \`${attributes.msgs}\`.` };
    } catch (e) {
        return { warnMsg: e.message };
    }
};

const createWarningMessage = (server_name, db_num, key, actual_block = 0, expected_block = 0) => {
    return `Warning on \`${server_name}\` server, on DB number ${db_num} with key: \`${key}\`.\n Delay for ${expected_block - actual_block} block(s).`;
};
const createSuccessMessage = (server_name, db_num, key, actual_block = 0, expected_block = 0) => {
    return `Success on \`${server_name}\` server, on DB number ${db_num} with key: \`${key}\`.\n Delay for ${expected_block - actual_block} block(s).`;
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
}, null, true, null, null, false);

job.start();

module.exports = { check };
