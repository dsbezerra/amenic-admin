const Task = require('../../db/api/Task');
const { SetupRouter } = require('./base');

const router = SetupRouter(Task);
module.exports = router;
