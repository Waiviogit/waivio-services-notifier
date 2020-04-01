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
    { name: 'waivio-api', link: 'https://waiviodev.com/api/docs' },
    { name: 'investarena-api', link: 'https://investarena.waiviodev.com/investarena-api/docs/' },
    { name: 'objects-bot-api', link: 'https://waiviodev.com/objects-bot/docs/' },
    { name: 'waivio-admin-api', link: 'https://waiviodev.com/admin-api/docs/' },
    { name: 'quick-forecast-api', link: 'https://www.investarena.com/quick-forecasts/docs/' },
    { name: 'campaigns-api', link: 'https://waiviodev.com/campaigns-api/api-docs/' },
    { name: 'auth-service', link: 'https://waiviodev.com/auth-service/docs/' },
    { name: 'currencies-api', link: 'https://waiviodev.com/currencies-api/docs/' }
];

