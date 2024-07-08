exports.HIVE_ENGINE_REQUEST_DATA = {
    blockchain_url: 'https://herpc.dtools.dev/blockchain',
    blockchain_params: {
        id: 'ssc-mainnet-hive',
        jsonrpc: '2.0',
        method: 'getLatestBlockInfo'
    }
};

exports.HIVE_ENGINE_REDIS_KEYS = [ 'engine_last_block', 'last_engine_block_for_arbitrage', 'campaign_v2_engine_block' ];

exports.HIVE_ENGINE_NODES = [
    'https://herpc.kanibot.com',
    'https://engine.deathwing.me',
    'https://he.sourov.dev',
];

