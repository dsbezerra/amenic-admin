const City = require('../../db/api/City');

const { SetupRouter } = require('./base');

const router = SetupRouter(City);

module.exports = router;
