const { clientModel } = require('./../database').models;

exports.getOne = async ({ client_id }) => {
    try {
        const client = await clientModel.findOne({ client_id });
        return { client };
    } catch (error) {
        return { error };
    }
};

exports.Create = async ({ client_id, type, subscribedNotifies }) => {
    try {
        const client = await clientModel.create({ client_id, type, subscribedNotifies });
        return { client };
    } catch (error) {
        return { error };
    }
};

exports.updateSubscribedNotifies = async ({ client_id, subscribedNotifies }) => {
    try {
        const result = await clientModel.updateOne(
            { client_id },
            { subscribedNotifies },
            { upsert: true, setDefaultsOnInsert: true }
        );
        return { result };
    } catch (error) {
        return { error };
    }
};

exports.getAllSubscribers = async () => {
    try {
        const clients = await clientModel.find({ subscribedNotifies: { $exists: true, $ne: [] } }).lean();
        return { clients };
    } catch (error) {
        return { error };
    }
};
