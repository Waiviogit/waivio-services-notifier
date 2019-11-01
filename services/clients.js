const { clientModel } = require('./../database').models;

exports.getOne = async ({ client_id }) => {
    try {
        const client = await clientModel.findOne({ client_id });
        return { client };
    } catch (error) {
        return { error };
    }
};
