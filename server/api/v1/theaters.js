const Theater = require('../../db/api/Theater');
const { SetupRouter } = require('./base');

const theaterQuery = require('./builders/theater-query');

const router = SetupRouter(Theater, {
  queryBuilder: theaterQuery,
});
module.exports = router;
