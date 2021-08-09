const mongoose = require('mongoose');
const _ = require('lodash');
const { api } = require('../');
const BaseClass = require('../base-class');

const { Schema } = mongoose;

const Image = require('./Image');
const Showtime = require('./Showtime');

const mongoSchema = new Schema({
  hidden: {
    type: Boolean,
    index: true,
  },
  imdbId: String,
  tmdbId: Number,
  rottenPage: String,
  title: {
    type: String,
    required: true,
    index: true,
  },
  originalTitle: {
    type: String,
    index: true,
  },
  genres: Array,
  synopsis: String,
  backdrop: String,
  poster: String,
  rating: {
    type: Number,
    default: 0,
    required: true,
    index: true,
  },
  runtime: {
    type: Number,
    default: 0,
    required: true,
  },
  trailer: String,
  studio: String,
  releaseDate: {
    type: Date,
    required: true,
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

class MovieClass extends BaseClass {
  static async getNowPlaying() {
    // Get now playing week start date.
    const start = () => {
      const date = new Date();

      const weekday = date.getDay();
      const daysToCurrentWeekThursday = (weekday < 4 ? 3 - weekday : 4 + 7 - 1 - weekday) - 6;

      const y = date.getFullYear();
      const m = date.getMonth();
      const d = date.getDate();

      date.setUTCFullYear(y);
      date.setUTCMonth(m);
      date.setUTCDate(d + daysToCurrentWeekThursday);
      date.setUTCHours(0);
      date.setUTCMinutes(0);
      date.setUTCSeconds(0);
      date.setUTCMilliseconds(0);

      return date;
    };

    const period = {
      start: start(),
      end: start(),
    };
    period.end = period.end.setUTCDate(period.end.getUTCDate() + 6);

    const movies = await Showtime.aggregate([
      { $match: { 'period.start': { $gte: period.start } } },
      { $group: { _id: '$movieId', theaters: { $addToSet: '$theaterId' } } },
      {
        $lookup: {
          from: 'movies', localField: '_id', foreignField: '_id', as: 'movie',
        },
      },
      {
        $lookup: {
          from: 'theaters', localField: 'theaters', foreignField: '_id', as: 'theaters',
        },
      },
      { $addFields: { 'movie.theaters': '$theaters' } },
      { $unwind: '$movie' },
      { $sort: { 'movie.releaseDate': -1 } },
      { $replaceRoot: { newRoot: '$movie' } },
    ]);

    if (!movies) {
      throw new Error('Movies not found');
    }

    return { period, movies };
  }

  static async getUpcoming({
    select = {},
  } = {}) {
    const movies = await this.find({ releaseDate: { $gt: new Date() } })
      .select(select)
      .sort({ releaseDate: 1 });

    if (!movies) {
      throw new Error('Movies not found');
    }

    return { movies };
  }

  static async getIncomplete({
    limit = 20,
    offset = 0,
  }) {
    const movies = await this.find({
      $and: [
        { releaseDate: { $gte: new Date() } },
        {
          $or: [
            { synopsis: { $in: [null, ''] } },
            { backdrop: { $in: [null, ''] } },
            { poster: { $in: [null, ''] } },
            { studio: { $in: [null, ''] } },
            { trailer: { $in: [null, ''] } },
            { rating: { $in: [null, 0] } },
            { runtime: { $in: [null, 0] } },
            { genres: { $in: [null] } },
          ],
        },
      ],
    }).sort({ releaseDate: 1 })
      .skip(offset)
      .limit(limit);

    if (!movies) {
      throw new Error('Movies not found');
    }

    return { movies };
  }

  static async hide({
    _id,
    ...modified
  }) {
    const movie = await this.findById(_id);
    if (!movie) {
      throw new Error('Not found');
    }

    const changed = modified;
    if (movie.hidden === null || !movie.hidden) {
      changed.hidden = true;
    } else {
      changed.hidden = false;
    }

    return this.updateOne({ _id }, {
      $set: {
        ...changed,
        updatedAt: new Date(),
      },
    });
  }

  static async listGenres() {
    const genres = await this.aggregate([
      { $unwind: '$genres' },
      { $group: { _id: 'genres', items: { $addToSet: '$genres' } } },
    ]);

    let result = [];

    if (genres) {
      const f = genres[0];

      const { items } = f;
      if (items && items.length > 0) {
        result = _.sortBy(items);
      }
    }

    return { genres: result };
  }
}

mongoSchema.post('remove', async (doc) => {
  try {
    // Delete all showtimes
    await Showtime.remove({ movieId: doc._id });
    // Delete all images related to this movie
    const { images } = await Image.getMovieImages({ movieId: doc._id });
    // eslint-disable-next-line no-restricted-syntax
    for (const image of images) {
      // eslint-disable-next-line no-await-in-loop
      await image.remove();
    }
  } catch (err) {
    // Ignored
    console.log(err);
  }
});

mongoSchema.loadClass(MovieClass);

const Movie = api.model('Movie', mongoSchema);

module.exports = Movie;
