import sendRequest from './sendRequest';
import buildQueryString from './buildQueryString';

const BASE_PATH = '/v2/states';

/**
 * GET
 * /v2/states
 *
 * Retrieve list of states.
 */
export const getStateList = (q = { limit: 30, sort: 'name' }, options = {}) => sendRequest(
  `${BASE_PATH}/?${buildQueryString(q)}`,
  Object.assign({ method: 'GET' }, options),
);

/**
 * GET
 * /v2/states/state/:id/cities
 *
 * Retrieve list of cities from given state.
 */
export const getCitiesFromState = (
  id, q = { limit: 30, sort: 'name' }, options = {},
) => sendRequest(
  `${BASE_PATH}/state/${id}/cities?${buildQueryString(q)}`,
  Object.assign({ method: 'GET' }, options),
);
