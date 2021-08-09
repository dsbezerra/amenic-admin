/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { destroy, getUploadedImages } = require('../lib/cloudinary');
const Movie = require('../db/api/Movie');
const Image = require('../db/api/Image');

/**
 * Removes an image from our database if its movie is not in database.
 * @param {Object} image Image model.
 */
async function removeIfMovieDoesNotExists(image) {
  const movie = await Movie.findById(image.toObject().movieId);
  if (movie) {
    return;
  }
  await image.remove();
}

/**
 * Removes an image from Cloudinary if this image is not persisted in database.
 * @param {Object} cloudinaryImage Cloudinary image resouce object.
 */
async function removeIfImageDoesNotExist(cloudinaryImage) {
  const image = await Image.findOne({ url: cloudinaryImage.url });
  if (!image) {
    try {
      await destroy(cloudinaryImage.public_id);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = async () => {
  console.log('[cleanup-images] STARTED');

  const images = await Image.find({});
  if (images.length === 0) {
    // No-op
  } else {
    // const uploadedImages = await getUploadedImages();
    // for (const image of uploadedImages) {
    //   await removeIfImageDoesNotExist(image);
    // }
    try {
      for (const image of images) {
        await removeIfMovieDoesNotExists(image);
      }
    } catch (err) {
      console.log(err);
    }
  }
  console.log('[cleanup-images] FINISHED');
};
