exports.HIVE_ENGINE_REQUEST_DATA = {
    blockchain_url: 'https://api.hive-engine.com/rpc/blockchain',
    blockchain_params: {
        id: 'ssc-mainnet',
        jsonrpc: '2.0',
        method: 'getLatestBlockInfo'
    }
};

exports.HIVE_ENGINE_REDIS_KEY = 'engine_last_block';