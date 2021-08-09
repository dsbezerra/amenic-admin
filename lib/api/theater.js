import sendRequest from './sendRequest';
import buildQueryString from './buildQueryString';
import getAPIKey from './getAPIKey';

const BASE_PATH = '/v1/theaters';

export const getTheaterById = (id, query = {}, options = {}) => sendRequest(
  `${BASE_PATH}/theater/${id}?${buildQueryString(query)}`,
  Object.assign({ method: 'GET' }, options),
);

export const getTheaterCount = (query = { page: 1 }, options = {}) => sendRequest(
  `${BASE_PATH}/count?${buildQueryString(query)}`,
  Object.assign({ method: 'GET' }, options),
);

export const getTheaterList = (query = { page: 1 }, options = {}) => sendRequest(
  `${BASE_PATH}?${buildQueryString(query)}`,
  Object.assign({ method: 'GET' }, options),
);

export const getTheaterImages = (id, query = {}, options = {}) => (
  sendRequest(
    `${BASE_PATH}/theater/${id}/images?${buildQueryString(query)}`,
    Object.assign({ method: 'GET' }, options),
  )
);

export const updateTheater = (theater, options = {}) => sendRequest(
  `${BASE_PATH}/theater/${theater._id}?${getAPIKey()}`,
  Object.assign({ method: 'PUT', body: JSON.stringify(theater) }, options),
);

export const deleteTheater = (id, options = {}) => sendRequest(
  `${BASE_PATH}/theater/${id}?${getAPIKey()}`,
  Object.assign({ method: 'DELETE' }, options),
);
