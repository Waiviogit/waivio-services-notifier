const { Router } = require('express');
const { notifications, botRC, cronMessage } = require('../controllers/notificationsController');

const mainRoutes = new Router();
const notificationsRoutes = new Router();
mainRoutes.use('/telegram-api', notificationsRoutes);

notificationsRoutes.route('/sentry').get(notifications);
notificationsRoutes.route('/bot-rc').post(botRC);
notificationsRoutes.route('/cron-message').post(cronMessage);

module.exports = mainRoutes;
