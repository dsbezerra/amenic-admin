const Vibrant = require('node-vibrant');

const Image = require('../db/api/Image');

async function generatePalette(image) {
  if (!image) {
    return null;
  }

  const palette = await Vibrant.from(image.url || image.secureUrl).getPalette();
  return Image.edit({ ...image, palette: { ...palette } });
}

module.exports = async () => {
  const images = await Image.find({
    palette: { $in: [null, {}] },
  });

  if (images.length === 0) {
    console.log('All images have palette.');
    return;
  }

  const promises = [];
  for (let i = 0; i < images.length; i += 1) {
    promises.push(generatePalette(images[i].toObject()));
  }

  try {
    await Promise.all(promises);
    console.log('All images updated.');
  } catch (err) {
    console.log(err);
  }
};
