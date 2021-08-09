const mongoose = require('mongoose');
const { api } = require('..');
const BaseClass = require('../base-class');

const { Schema } = mongoose;

const TheaterSchema = new Schema({
  hidden: {
    type: Boolean,
    index: true,
  },
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  cityId: {
    type: Schema.Types.ObjectId,
    ref: 'City',
    required: true,
    index: true,
  },
  internalId: String,
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
}, { toJSON: { virtuals: true } });

TheaterSchema.virtual('city', {
  ref: 'City',
  localField: 'cityId',
  foreignField: '_id',
  justOne: true,
});

class TheaterClass extends BaseClass {}
TheaterSchema.loadClass(TheaterClass);

const Theater = api.model('Theater', TheaterSchema);

module.exports = Theater;
