const mongoose = require('mongoose');
const { api } = require('../');
const BaseClass = require('../base-class');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    unique: true,
    index: true,
  },
  imdb: {
    id: String, // Title id
    score: Number, // Score value
  },
  rotten: {
    path: String, // Movie path
    class: String, // Score class
    score: Number, // Score value
  },
  keepSynced: {
    type: Boolean,
    index: true,
    default: false,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

class ScoreClass extends BaseClass {
  static async add({
    movieId, imdb, rotten, keepSynced,
  }) {
    return this.create({
      movieId,
      imdb,
      rotten,
      keepSynced,
      createdAt: new Date(),
    });
  }
}

mongoSchema.loadClass(ScoreClass);

const Score = api.model('Score', mongoSchema);

module.exports = Score;
