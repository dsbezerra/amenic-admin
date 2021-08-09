const Image = require('../../db/api/Image');
const { SetupRouter } = require('./base');

const router = SetupRouter(Image);

/**
 * Marks an image as primary.
 */
router.post('/:id/main', async (req, res) => {
  try {
    await Image.markAsMain(req.params.id, true);
    res.json({ success: true });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
