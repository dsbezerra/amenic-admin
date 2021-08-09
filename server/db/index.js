const mongoose = require('mongoose');

const api = mongoose.createConnection(process.env.MONGO_URL);
const logs = mongoose.createConnection(process.env.LOG_DATABASE_URL);

const db = { api, logs };

module.exports = db;
