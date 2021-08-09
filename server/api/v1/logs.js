const Entry = require('../../db/logs/Entry');
const logQuery = require('./builders/log-query');

const { SetupRouter } = require('./base');

const router = SetupRouter(Entry, {
  queryBuilder: logQuery,
});

module.exports = router;
