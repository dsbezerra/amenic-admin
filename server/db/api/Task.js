const mongoose = require('mongoose');
const { api } = require('../');
const BaseClass = require('../base-class');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  type: String,
  name: String,
  description: String,
  args: Array,
  last_run: Date,
  last_error: String,
});

class TaskClass extends BaseClass {
}

mongoSchema.loadClass(TaskClass);

const Task = api.model('Task', mongoSchema);
module.exports = Task;
