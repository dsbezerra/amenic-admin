const uuidv5 = require('uuid/v5');

const ApiKey = require('../../db/api/ApiKey');
const apiKeysQuery = require('./builders/api-keys-query');
const { SetupRouter } = require('./base');

const router = SetupRouter(ApiKey, {
  queryBuilder: apiKeysQuery,
});

// NOTE(diego):
// Version 1 UUID generated in www.uuidgenerator.net on date
// 20/09/2018 around time 16:49 using a Windows 10 x64.
// (Avell Notebook)
const AMENIC_UUID = '311de016-bd0e-11e8-a355-529269fb1459';

/**
 * Creates an ApiKey.
 *
 * @POST /api/v1/apikeys
 */
router.post('/', async (req, res) => {
  try {
    const apiKey = { ...req.body, owner: req.session.user.username };
    apiKey.key = uuidv5(apiKey.name, AMENIC_UUID).replace(/-/g, '');
    await ApiKey.add(apiKey);
    res.json({ success: true });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
