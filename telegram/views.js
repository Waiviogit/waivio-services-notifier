exports.HELP_MESSAGE = [ 'help - show this page',
    'start - start bot',
    'nodes - show active nodes list',
    'status - current status of Waivio services',
    'subscribe - choose which notifications you want to subscribe to',
    'unsubscribe - choose which notifications you want to unsubscribe',
    'apilinks - list of Waivio docs'
].join('\n');
exports.START_MESSAGE = 'Welcome to waivio notify bot!\nUse /help to show info.';
exports.SUB_NOTIFICATIONS_MESSAGE = 'Now you\'ll be notified when one of services has fall down';
exports.UNSUB_MESSAGE = 'You have successfully unsubscribed';
exports.SENTRY_NOTIFICATIONS_MESSAGE = 'Now you\'ll be notified when one of services has will get an exception';
exports.APILINKS_MESSAGE = 'WAIVIO Docs links:';
exports.SUBSCRIBE_MESSAGE = 'Choose which notifications you want to subscribe to: ';
exports.LIST_APILINKS = [
    { name: 'waivio-api', link: 'https://waiviodev.com/api/docs' },
    { name: 'investarena-api', link: 'https://investarena.waiviodev.com/investarena-api/docs/' },
    { name: 'objects-bot-api', link: 'https://waiviodev.com/objects-bot/docs/' },
    { name: 'waivio-admin-api', link: 'https://waiviodev.com/admin-api/docs/' },
    { name: 'quick-forecast-api', link: 'https://www.investarena.com/quick-forecasts/docs/' },
    { name: 'campaigns-api', link: 'https://waiviodev.com/campaigns-api/api-docs/' },
    { name: 'auth-service', link: 'https://waiviodev.com/auth-service/docs/' },
    { name: 'currencies-api', link: 'https://waiviodev.com/currencies-api/docs/' }
];

