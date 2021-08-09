const cleanupImages = require('../task/cleanup-images');
const defineImagesPalette = require('../task/define-images-palette');
const sendImagesToCloudinary = require('./send-images-to-cloudinary');

module.exports = async () => {
  // Make sure we have movies' images only
  await cleanupImages();

  // Make sure all active images (of now playing or upcoming movies) are hosted on Cloudinary.
  await sendImagesToCloudinary();

  // Make sure all stored images have palette.
  await defineImagesPalette();
};
