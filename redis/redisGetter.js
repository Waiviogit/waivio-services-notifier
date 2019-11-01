const { dbClients } = require('./connector');

exports.getByKey = async function (key, client = dbClients[ 0 ]) {
    return await client.getAsync(key);
};
