const mongoose = require('mongoose');
const { api } = require('../');
const BaseClass = require('../base-class');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  theaterId: {
    type: String,
    ref: 'Theater',
    required: true,
  },
  period: Object,
  national: Boolean,
  isDubbed: Boolean,
  isSubbed: Boolean,
  is2D: Boolean,
  is3D: Boolean,
  room: Number,
  time: String,
  weekday: Number,
  timestamp: {
    type: Date,
    required: true,
  },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

mongoSchema.virtual('movie', {
  ref: 'Movie',
  localField: 'movieId',
  foreignField: '_id',
  justOne: true,
});

class ShowtimeClass extends BaseClass {}

mongoSchema.loadClass(ShowtimeClass);

const Showtime = api.model('Showtime', mongoSchema);

module.exports = Showtime;
