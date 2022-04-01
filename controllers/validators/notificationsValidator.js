const Joi = require('@hapi/joi');
const { APP_DATA } = require('../../constants/sentry');

const options = { allowUnknown: true, stripUnknown: true };

exports.sentrySchema = Joi.object().keys({
    app: Joi.string().valid(...Object.keys(APP_DATA)).required(),
    env: Joi.string().valid('staging', 'production')
}).options(options);


exports.botRcSchema = Joi.object().keys({
    account: Joi.string().required(),
    rc: Joi.number().min(0).max(100).required()
}).options(options);

exports.cronMessageSchema = Joi.object().keys({
    cron_service_key: Joi.string().valid(process.env.CRON_SERVICE_KEY),
    message: Joi.string()
}).options(options);
