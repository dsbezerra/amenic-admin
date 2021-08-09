const mongoose = require('mongoose');
const { api } = require('../');
const BaseClass = require('../base-class');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Whether this trailer is the default one to use for movie
  main: {
    type: Boolean,
    required: true,
    index: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  channelTitle: String,
  title: String,
  publishedAt: {
    type: Date,
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

class TrailerClass extends BaseClass {
}

mongoSchema.loadClass(TrailerClass);

const Trailer = api.model('Trailer', mongoSchema);
module.exports = Trailer;
