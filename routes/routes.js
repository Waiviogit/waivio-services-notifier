const { Router } = require('express');
const { notifications } = require('../controllers/notificationsController');

const mainRoutes = new Router();
const notificationsRoutes = new Router();
mainRoutes.use('/telegram-api', notificationsRoutes);

notificationsRoutes.route('/sentry').get(notifications);

module.exports = mainRoutes;
