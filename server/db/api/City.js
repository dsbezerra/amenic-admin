const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const { api } = require('../');
const BaseClass = require('../base-class');

const { Schema } = mongoose;

const CitySchema = new Schema({
  stateId: {
    type: Schema.Types.ObjectId,
    ref: 'State',
    index: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  // TZ column value
  //
  // We don't use it in State because timezone depends on city region.
  //
  // Cities in the west or east can have different timezones even tough
  // they are in the same state.
  timeZone: {
    type: String,
    required: true,
    default: 'America/Sao_Paulo',
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

class CityClass extends BaseClass {
}
CitySchema.loadClass(CityClass);

const City = api.model('City', CitySchema);
module.exports = City;
