const _ = require('lodash');

const Image = require('../db/api/Image');
const Movie = require('../db/api/Movie');

const {
  getImageName,
  uploadPoster,
  uploadBackdrop,
  matchesCloudName,
} = require('../lib/cloudinary');

/**
 * Uploads an image to Cloudinary and saves in database.
 * @param {Number} movie Movie ID.
 * @param {String} type Whether is poster or backdrop.
 * @param {String} uri Image path.
 * @param {Boolean} main Whether is the default used in applications.
 */
async function uploadAndInsert(movie, type, uri, main) {
  if (!uri) {
    return;
  }

  let func = null;
  switch (type) {
    case 'poster': func = uploadPoster; break;
    case 'backdrop': func = uploadBackdrop; break;
    default: return;
  }

  const result = await func(uri);
  await Image.add({
    movieId: movie,
    name: getImageName(result.public_id),
    type,
    url: result.url,
    secureUrl: result.secure_url,
    width: result.width,
    height: result.height,
    main,
  });
}

module.exports = async () => {
  try {
    const nowPlaying = await Movie.getNowPlaying();
    const upcoming = await Movie.getUpcoming();
    const movies = _.concat(nowPlaying.movies, upcoming.movies);

    const promises = [];
    movies.forEach((movie) => {
      if (movie.poster && !matchesCloudName(movie.poster)) {
        promises.push(uploadAndInsert(movie.id || movie._id, 'poster', movie.poster, true));
      }

      if (movie.backdrop && !matchesCloudName(movie.backdrop)) {
        promises.push(uploadAndInsert(movie.id || movie._id, 'backdrop', movie.backdrop, true));
      }
    });

    if (promises.length === 0) {
      console.log('There are no images out of Cloudinary.');
      return;
    }

    await Promise.all(promises);
    console.log('%d images are now on Cloudinary.', promises.length);
  } catch (err) {
    console.log(err);
  }
};
