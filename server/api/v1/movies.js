const fs = require('fs');
const os = require('os');
const _ = require('lodash');
const Vibrant = require('node-vibrant');

const Image = require('../../db/api/Image');
const Movie = require('../../db/api/Movie');
const movieQuery = require('./builders/movie-query');

const { uploadBackdrop, uploadPoster, getImageName } = require('../../lib/cloudinary');

const { SetupRouter } = require('./base');

const router = SetupRouter(Movie, {
  queryBuilder: movieQuery,
  preRoutes: (r) => {
    /**
     * Retrieve now playing movies.
     */
    r.get('/now_playing', async (req, res) => {
      try {
        const opts = movieQuery(req);
        const { period, movies } = await Movie.getNowPlaying(opts);
        res.json({ period, movies });
      } catch (err) {
        res.json({ error: err.message || err.toString() });
      }
    });

    /**
     * Retrieve upcoming movies.
     */
    r.get('/upcoming', async (req, res) => {
      try {
        const opts = movieQuery(req);
        const { movies } = await Movie.getUpcoming(opts);
        res.json({ movies });
      } catch (err) {
        res.json({ error: err.message || err.toString() });
      }
    });

    /**
     * Returns all movies with incomplete metadata.
     */
    r.get('/incomplete', async (req, res) => {
      try {
        const { movies } = await Movie.getIncomplete(movieQuery(req));
        res.json({ movies });
      } catch (err) {
        res.json({ error: err.message || err.toString() });
      }
    });
  },
  hooks: {
    '/': {
      beforeResponse: async (data) => {
        // Put only now playing ids of movies returned
        const { movies } = await Movie.getNowPlaying();
        const nowPlayingIds = [];
        _.each(data, (movie) => {
          if (_.some(movies, npm => npm._id === movie._id)) {
            nowPlayingIds.push(movie._id);
          }
        });

        return { ...data, nowPlayingIds };
      },
    },
  },
});

router.put('/:id/hide', async (req, res) => {
  try {
    await Movie.hide(req.body);
    res.json({ success: true });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.get('/:id/images', async (req, res) => {
  try {
    const { images } = await Image.getMovieImages({
      movieId: req.params.id,
      ...req.query,
    });
    res.json(images);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.post('/:id/images', async (req, res) => {
  const { body, busboy } = req;
  try {
    if (!_.isEmpty(body)) {
      const { uri, type } = body;
      if (!uri || !type) {
        throw new Error('invalid body');
      }

      let func = null;
      if (type === 'backdrop') {
        func = uploadBackdrop;
      } else if (type === 'poster') {
        func = uploadPoster;
      } else {
        throw new Error('invalid type');
      }

      const result = await func(uri);
      const palette = await Vibrant.from(result.url || result.secure_url).getPalette();
      const image = await Image.add({
        movieId: req.params.id,
        name: getImageName(result.public_id),
        type,
        url: result.url,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        main: body.default === true,
        palette,
      });
      res.json({ success: true, data: image });
    } else if (busboy) {
      let type = null;
      let main = null;
      busboy.on('field', (key, value) => {
        if (key === 'type') {
          type = value;
        }

        if (key === 'default') {
          main = value;
        }
      });
      busboy.on('file', (_fieldname, file, filename) => {
        const filepath = `${os.tmpdir()}\\${filename}`;
        const fstream = fs.createWriteStream(filepath);
        fstream.on('close', async () => {
          try {
            let func = null;
            if (type === 'backdrop') {
              func = uploadBackdrop;
            } else if (type === 'poster') {
              func = uploadPoster;
            } else {
              throw new Error('invalid type');
            }

            const result = await func(filepath);
            const palette = await Vibrant.from(result.url || result.secure_url).getPalette();
            const image = await Image.add({
              movieId: req.params.id,
              name: getImageName(result.public_id),
              type,
              url: result.url,
              secureUrl: result.secure_url,
              width: result.width,
              height: result.height,
              main: main === true,
              palette,
            });
            res.json({ success: true, data: image });
          } catch (err) {
            res.json({ error: err.message || err.toString() });
          }
        });
        file.pipe(fstream);
      });

      req.pipe(busboy);
    } else {
      throw new Error('Empty body or file stream.');
    }
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
