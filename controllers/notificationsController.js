const sentryHelper = require('../utilities/helpers/sentryHelper');
const validators = require('./validators');

const notifications = async (req, res, next) => {
    const { params, validationError } = validators.validate(
        req.query, validators.notifications.sentrySchema
    );
    if (validationError) return next({ status: 422, message: validationError.message });
    await sentryHelper.sendSentryError(params);
    res.status(200).json({ result: 'OK' });
};

module.exports = { notifications };
