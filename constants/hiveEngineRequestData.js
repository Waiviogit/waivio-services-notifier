exports.HIVE_ENGINE_REQUEST_DATA = {
    blockchain_url: 'https://herpc.dtools.dev/blockchain',
    blockchain_params: {
        id: 'ssc-mainnet-hive',
        jsonrpc: '2.0',
        method: 'getLatestBlockInfo'
    }
};

exports.HIVE_ENGINE_REDIS_KEYS = [ 'engine_last_block', 'last_engine_block_for_arbitrage' ];

exports.HIVE_ENGINE_NODES = [
    'https://herpc.dtools.dev',
    'https://engine.rishipanthee.com',
    'https://api2.hive-engine.com/rpc',
    'https://api.primersion.com',
    'https://herpc.kanibot.com',
];

