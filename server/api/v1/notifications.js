const Notification = require('../../db/api/Notification');
const notificationQuery = require('./builders/notification-query');

const { SetupRouter } = require('./base');

const router = SetupRouter(Notification, {
  queryBuilder: notificationQuery,
});

module.exports = router;
