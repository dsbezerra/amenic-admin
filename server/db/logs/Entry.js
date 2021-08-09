const mongoose = require('mongoose');
const BaseClass = require('../base-class');
const { logs } = require('..');

const { Schema } = mongoose;

const NAME = 'Entry';

const mongoSchema = new Schema({
  App: {
    type: String,
    index: true,
    alias: 'app',
    required: true,
  },
  Level: {
    type: String,
    index: true,
    alias: 'level',
    required: true,
  },
  Message: {
    type: String,
    alias: 'message',
    required: true,
  },
  Time: {
    type: Date,
    index: true,
    alias: 'time',
    required: true,
  },
});

class EntryClass extends BaseClass {}
mongoSchema.loadClass(EntryClass);

const Entry = logs.model(NAME, mongoSchema);

module.exports = Entry;
