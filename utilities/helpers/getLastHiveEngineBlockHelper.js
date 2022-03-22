const axios = require('axios');
const { HIVE_ENGINE_REQUEST_DATA } = require('../../constants/hiveEngineRequestData');

exports.getLastHiveEngineBlock = async () => {
    try {
        const response = await axios.post(HIVE_ENGINE_REQUEST_DATA.blockchain_url,
            HIVE_ENGINE_REQUEST_DATA.blockchain_params);

        return response.data.result.blockNumber;
    } catch (error) {
        console.error(error);
    }
};
