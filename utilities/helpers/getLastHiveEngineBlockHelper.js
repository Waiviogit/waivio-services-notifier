const { blockchain } = require('../hiveEngine');


exports.getLastHiveEngineBlock = async () => {
    const result = await blockchain.getLatestBlockInfo();
    return result?.blockNumber
};
