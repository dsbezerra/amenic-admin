const City = require('../../db/api/City');
const State = require('../../db/api/State');

const { SetupRouter } = require('./base');

const router = SetupRouter(State);

router.get('/:id/cities', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await City.list({
      conditions: { stateId: id },
    });
    res.json(result);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
