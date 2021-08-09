import sendRequest from './sendRequest';
import buildQueryString from './buildQueryString';

const BASE_PATH = '/api/v1/';

export const APIKEY = 'APIKEY';
export const CITY = 'CITY';
export const MOVIE = 'MOVIE';
export const NOTIFICATION = 'NOTIFICATION';
export const STATE = 'STATE';
export const TASK = 'TASK';
export const THEATER = 'THEATER';

const getBaseURL = (model, single = false) => {
  let URL = BASE_PATH;
  switch (model) {
    case APIKEY:
      URL += 'apikeys';
      break;
    case CITY:
      URL += 'cities';
      break;
    case MOVIE:
      URL += 'movies';
      break;
    case NOTIFICATION:
      URL += 'notifications';
      break;
    case STATE:
      URL += 'states';
      break;
    case TASK:
      URL += 'tasks';
      break;
    case THEATER:
      URL += 'theaters';
      break;
    default:
  }
  if (single) {
    URL += `/${model.toLowerCase()}`;
  }
  return URL;
};

export const getById = (model, id, options = {}, query = {}) => sendRequest(
  `${getBaseURL(model, true)}/${id}?${buildQueryString(query)}`,
  Object.assign(
    {
      method: 'GET',
    },
    options,
  ),
);

export const getList = (model, q = { page: 1 }, options = {}) => sendRequest(
  `${getBaseURL(model)}?${buildQueryString(q)}`,
  Object.assign(
    {
      method: 'GET',
    },
    options,
  ),
);

export const insert = (model, data, options = {}) => sendRequest(
  `${getBaseURL(model, true)}`,
  Object.assign(
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    options,
  ),
);

export const update = (model, data, options = {}) => sendRequest(
  `${getBaseURL(model, true)}/${data._id}`,
  Object.assign(
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    options,
  ),
);

export const deleteById = (model, id, options = {}) => sendRequest(
  `${getBaseURL(model)}/${id}`,
  Object.assign(
    {
      method: 'DELETE',
    },
    options,
  ),
);

export * from './movie';
export * from './theater';
