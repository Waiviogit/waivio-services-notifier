const broadcasts = require('../../telegram/broadcasts');
const { APP_DATA } = require('../../constants/sentry');
const { SENTRY_SUBSCRIBE } = require('../../constants/notificationsType');

exports.sendSentryError = async (params) => {
    const message = `There is some problems with service *${params.app}* on *${params.env ? params.env : 'staging'}* environment to see exceptions tap on button`;
    await broadcasts.shareBySpecificSubscribers(SENTRY_SUBSCRIBE, message, APP_DATA[ params.app ]);
};
