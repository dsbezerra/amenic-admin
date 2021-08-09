import _ from 'lodash';

import sendFile from './sendFile';
import sendRequest from './sendRequest';
import buildQueryString from './buildQueryString';
import getAPIKey from './getAPIKey';

const BASE_PATH = '/v1/movies';

export const getMovieById = (id, query = {}, options = {}) => sendRequest(
  `${BASE_PATH}/movie/${id}?${buildQueryString(query)}`,
  Object.assign({ method: 'GET' }, options),
);

export const getMovieCount = (query = { page: 1 }, options = {}) => sendRequest(
  `${BASE_PATH}/count?${buildQueryString(query)}`,
  Object.assign({ method: 'GET' }, options),
);

export const getMovieList = (query = { page: 1 }, options = {}) => sendRequest(
  `${BASE_PATH}?${buildQueryString(query)}`,
  Object.assign({ method: 'GET' }, options),
);

export const getIncomplete = (query = {}, options = {}) => (
  sendRequest(
    `${BASE_PATH}/incomplete?${buildQueryString(query)}`,
    Object.assign({ method: 'GET' }, options),
  )
);

export const getNowPlaying = (query = {}, options = {}) => (
  sendRequest(
    `${BASE_PATH}/now_playing?${buildQueryString(query)}`,
    Object.assign({ method: 'GET' }, options),
  )
);

export const getUpcoming = (query = {}, options = {}) => (
  sendRequest(
    `${BASE_PATH}/upcoming?${buildQueryString(query)}`,
    Object.assign({ method: 'GET' }, options),
  )
);

export const getMovieImages = (id, query = {}, options = {}) => (
  sendRequest(
    `${BASE_PATH}/movie/${id}/images?${buildQueryString(query)}`,
    Object.assign({ method: 'GET' }, options),
  )
);

export const getMovieGenres = (options = {}) => sendRequest(
  '/api/v1/genres',
  Object.assign({ method: 'GET' }, options),
);

export const updateMovie = (movie, options = {}) => sendRequest(
  `${BASE_PATH}/movie/${movie._id}?${getAPIKey()}`,
  Object.assign({ method: 'PUT', body: JSON.stringify(movie) }, options),
);

export const deleteMovie = (id, options = {}) => sendRequest(
  `${BASE_PATH}/movie/${id}?${getAPIKey()}`,
  Object.assign({ method: 'DELETE' }, options),
);

export const addMovieImage = (movie, data, options = {}) => {
  const path = `${BASE_PATH}/movie/${movie._id}/images`;
  if (_.isEmpty(data.uri)) {
    return sendFile(path, Object.assign({ method: 'POST', body: data }));
  }
  return sendRequest(
    path,
    Object.assign({
      method: 'POST',
      body: JSON.stringify(data),
    }),
    options,
  );
};
