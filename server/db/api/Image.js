const mongoose = require('mongoose');
const _ = require('lodash');
const { api } = require('../');
const BaseClass = require('../base-class');

const { Schema } = mongoose;

const Movie = require('./Movie');
const { destroyFromUri, matchesCloudName } = require('../../lib/cloudinary');

const mongoSchema = new Schema({
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  type: { // backdrop or poster
    type: String,
    required: true,
    index: true,
  },
  quality: { // lq, mq or hq
    type: String,
    required: true,
    index: true,
  },
  // Whether this image is the default one to use for movie (backdrop or poster)
  // NOTE(diego): Not used for now.
  main: {
    type: Boolean,
    required: true,
    index: true,
  },
  url: {
    type: String,
    required: true,
  },
  secureUrl: String,
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  palette: {
    vibrantColor: String,
    lightVibrantColor: String,
    darkVibrantColor: String,
    mutedColor: String,
    lightMutedColor: String,
    darkMutedColor: String,
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

function mapPalette(palette) {
  return {
    vibrantColor: palette.Vibrant !== null ? palette.Vibrant.getHex() : null,
    mutedColor: palette.Muted !== null ? palette.Muted.getHex() : null,
    darkMutedColor: palette.DarkMuted !== null ? palette.DarkMuted.getHex() : null,
    darkVibrantColor: palette.DarkVibrant !== null ? palette.DarkVibrant.getHex() : null,
    lightMutedColor: palette.LightMuted !== null ? palette.LightMuted.getHex() : null,
    lightVibrantColor: palette.LightVibrant !== null ? palette.LightVibrant.getHex() : null,
  };
}

class ImageClass extends BaseClass {
  static async getMovieImages(conditions) {
    const images = await this.find(conditions)
      .sort({ createdAt: -1 });

    if (!images) {
      throw new Error('Images not found');
    }

    return { images };
  }

  static async add({
    movieId = 0,
    name = '',
    type = '',
    quality = 'mq', // NOTE(diego): For now.
    main = false,
    url = '',
    secureUrl,
    width = 0,
    height = 0,
    palette = {},
  }) {
    if (!movieId || !type || !url) {
      throw new Error('Image missing some parameters');
    }

    let mappedPalette = null;
    if (_.isEmpty(palette)) {
      mappedPalette = {};
    } else {
      mappedPalette = mapPalette(palette);
    }

    const result = await this.create({
      movieId,
      name,
      type,
      quality,
      main,
      url,
      secureUrl,
      width,
      height,
      palette: mappedPalette,
      createdAt: new Date(),
    });
    if (main) {
      await this.markAsMain(result);
    }
    return result;
  }

  static async edit({
    _id,
    ...modified
  }) {
    const image = await this.findById(_id);
    if (!image) {
      throw new Error('Image not found');
    }

    let mappedPalette = null;
    if (_.isEmpty(modified.palette)) {
      mappedPalette = {};
    } else {
      mappedPalette = mapPalette(modified.palette);
    }

    const newModified = {
      ...modified,
      palette: mappedPalette,
    };
    return this.updateOne({ _id }, {
      $set: {
        ...newModified,
        updatedAt: new Date(),
      },
    });
  }

  static async editMany(conditions, modified) {
    return this.update(conditions, { $set: { ...modified } }, { multi: true });
  }

  static async deleteById(id, ignoreMain = false) {
    const image = await this.findOne({ _id: id });
    if (!image) {
      throw new Error('Image not found');
    }

    const doc = image.toObject();
    if (doc.main && !ignoreMain) {
      throw new Error('Main image cannot be deleted');
    }

    return image.remove();
  }

  static async markAsMain(obj, update = false) {
    let image = obj;
    if (typeof obj === 'string') {
      image = await this.getById(obj);
    }

    if (image) {
      const modified = {};
      if (image.type === 'backdrop') {
        modified.backdrop = image.secureUrl || image.url;
      } else if (image.type === 'poster') {
        modified.poster = image.secureUrl || image.url;
      } else {
        throw new Error('invalid type');
      }
      // Make sure no other images of same type have main defined to true
      await this.editMany({
        _id: {
          $ne: image._id,
        },
        movieId: image.movieId,
        type: image.type,
      }, { main: false });
      // Only do this if we are updating
      if (update) {
        await this.edit({ _id: image._id, main: true });
      }
      // Define movie main backdrop/poster
      Movie.edit({ _id: image.movieId, ...modified });
    }
  }
}

mongoSchema.post('remove', async (doc) => {
  try {
    // Delete from cloudinary
    if (matchesCloudName(doc.url)) {
      await destroyFromUri(doc.url);
    } else if (matchesCloudName(doc.secureUrl)) {
      await destroyFromUri(doc.secureUrl);
    }
  } catch (err) {
    console.log(err);
  }
});

mongoSchema.loadClass(ImageClass);

const Image = api.model('Image', mongoSchema);
module.exports = Image;
