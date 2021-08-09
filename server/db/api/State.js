const mongoose = require('mongoose');
const { api } = require('../');
const BaseClass = require('../base-class');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  federativeUnit: {
    index: true,
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

class StateClass extends BaseClass {
}

mongoSchema.loadClass(StateClass);

const State = api.model('State', mongoSchema);
module.exports = State;
