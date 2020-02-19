exports.HELP_MESSAGE = [ '/help - show this page',
    '/start - start bot',
    '/nodes - show active nodes list',
    '/subNotifications - subscribe for services fall notifications',
    '/status - current status of Waivio services',
    '/apilinks - list of Waivio docs' ].join('\n');
exports.START_MESSAGE = 'Welcome to waivio notify bot!\nUse /help to show info.';
exports.SUB_NOTIFICATIONS_MESSAGE = 'Now you\'ll be notified when one of services has fall down';
exports.APILINKS_MESSAGE = 'WAIVIO Docs links:';
exports.LIST_APILINKS = [
    { name: 'waivio-api', link: 'https://app.swaggerhub.com/apis-docs/waivio/waivio-api/1.0.0' },
    { name: 'investarena-api', link: 'https://app.swaggerhub.com/apis-docs/waivio/investarena-api/1.0.0' },
    { name: 'objects-bot-api', link: 'https://app.swaggerhub.com/apis-docs/waivio/objects-bot/1.0.0' },
    { name: 'waivio-admin-api', link: 'https://app.swaggerhub.com/apis-docs/waiviogit/waivio-admin-api/1.0.0' },
    { name: 'quick-forecast-api', link: 'https://app.swaggerhub.com/apis-docs/waiviogit/quick-forecasts/1' },
    { name: 'campaigns-api', link: 'https://waiviodev.com/campaigns-api/api-docs/' }
];

