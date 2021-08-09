const mongoose = require('mongoose');
const { api } = require('../');
const BaseClass = require('../base-class');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  shortName: String,
  images: {
    backdrop: String,
    icon: String,
    logo: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

class NotificationClass extends BaseClass {}

mongoSchema.loadClass(NotificationClass);

const Notification = api.model('Notification', mongoSchema);

module.exports = Notification;
