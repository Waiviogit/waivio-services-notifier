const Joi = require('@hapi/joi');
const { APP_DATA } = require('../../constants/sentry');

exports.sentrySchema = Joi.object().keys({
    app: Joi.string().valid(...Object.keys(APP_DATA)).required()
}).options({ allowUnknown: true, stripUnknown: true });