const express = require('express');
const paginationLinks = require('./builders/general/pagination-links');
const defaultQuery = require('./builders/default-query');

const { ApiError } = require('./helpers/errors');

function sendError(res, err) {
  if (err instanceof ApiError) {
    const { code, message } = err;
    res.status(code).json({ code, error: message || err.toString() });
  } else {
    res.json({ error: err.message || err.toString() });
  }
}

function SetupRouter(Model, opts = {}) {
  async function handle(req, res, fn, query) {
    const hooks = (opts.hooks && opts.hooks[req.route.path]) || {};
    try {
      // Perform main operation.
      let r = await fn;

      // If we need the result paginated, create pagination data.
      if (query && query.paginated) {
        r.pages = paginationLinks(req, query, r);
      }

      // If we have a custom data handler before a response, call it.
      if (hooks.beforeResponse) {
        r = await hooks.beforeResponse(r);
      }

      // Send response to client.
      res.json(r);
    } catch (err) {
      sendError(res, err);
    }
  }

  const router = express.Router();
  if (opts.middlewares) {
    router.use(opts.middlewares);
  }

  if (opts.preRoutes) {
    opts.preRoutes(router);
  }

  if (!opts.queryBuilder) {
    // eslint-disable-next-line no-param-reassign
    opts.queryBuilder = defaultQuery;
  }

  /**
   * Retrieves a list of Model.
   */
  router.get('/', (req, res) => {
    try {
      const query = opts.queryBuilder(req);
      handle(req, res, Model.list(query), query);
    } catch (err) {
      sendError(res, err);
    }
  });

  /**
   * Retrieves the document of Model matching ID.
   */
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = opts.queryBuilder(req);
    handle(req, res, Model.getById(id, query));
  });

  /**
   * Modifies the document of Model matching ID.
   */
  router.put('/:id', (req, res) => {
    handle(req, res, Model.edit(req.body));
  });

  /**
   * Removes the document of Model matching ID.
   */
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    handle(req, res, Model.delete(id));
  });

  return router;
}

module.exports = { SetupRouter };
