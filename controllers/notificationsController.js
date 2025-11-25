const sentryHelper = require('../utilities/helpers/sentryHelper');
const validators = require('./validators');
const { shareMessageBySubscribers, shareMessageBySubscribersNoParseMode } = require('../telegram/broadcasts');

exports.notifications = async (req, res, next) => {
    const { params, validationError } = validators.validate(
        req.query, validators.notifications.sentrySchema
    );
    if (validationError) return next({ status: 422, message: validationError.message });
    await sentryHelper.sendSentryError(params);
    res.status(200).json({ result: 'OK' });
};

exports.botRC = async (req, res, next) => {
    const { params, validationError } = validators.validate(
        req.body, validators.notifications.botRcSchema
    );
    if (validationError) return next({ status: 422, message: validationError.message });
    const message = `${params.account} bot reached critical rc ${params.rc} %`;
    await shareMessageBySubscribers(message);
    res.status(200).json({ result: 'OK' });
};

exports.cronMessage = async (req, res, next) => {
    const { params, validationError } = validators.validate(req.body, validators.notifications.cronMessageSchema);
    if (validationError) return next({ status: 422, message: validationError.message });
    if (process.env.CRON_SERVICE_KEY !== params.cron_service_key) return next({ status: 401, message: 'Not authorised' });

    await shareMessageBySubscribersNoParseMode(params.message);
    res.status(200).json({ result: 'OK' });
};
