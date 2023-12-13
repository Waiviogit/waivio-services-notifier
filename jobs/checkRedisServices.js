const { CronJob } = require('cron');
const axios = require('axios');
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
    const {engineSuccess, engineWarning} = await checkEngineNode({head_block});
    if (engineSuccess) success_messages.push(engineSuccess);
    if (engineWarning) warn_messages.push(engineWarning);
    return { success_messages, warn_messages };
};


const checkEngineNode = async ({head_block}) => {
    const host = 'https://engine.waivio.com';
    let engineWarning = `Warning can't reach \`Engine node\` ${host}`;

    try {

        const result = await axios.get(host, {
            timeout: 5000
        });

        const currentHiveBlock = _.get(result, 'data.lastBlockRefHiveBlockNumber')
        if(!currentHiveBlock) {
            return {engineWarning};
        }
        const diff = head_block - currentHiveBlock
        if(diff > 100) {
            return {engineWarning: `Warning on \`Engine node\`. Delay for ${diff} block(s).`}
        }

        return {
            engineSuccess: `Success on \`Engine node\`. Delay for ${diff} block(s).`
        }


    } catch (error) {
      return {engineWarning};
    }
}

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
