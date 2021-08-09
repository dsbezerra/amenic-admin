import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/scores';

export const getMovieScores = (movieId, options = {}) => {
  const URL = `${BASE_PATH}?movie=${movieId}`;
  return sendRequest(
    URL,
    Object.assign(
      {
        method: 'GET',
      },
      options,
    ),
  );
};

export const updateMovieScores = (scores, options = {}) => {
  const URL = `${BASE_PATH}`;
  return sendRequest(
    URL,
    Object.assign(
      {
        method: 'PUT',
        body: JSON.stringify(scores),
      },
      options,
    ),
  );
};

export const searchMovieScores = ({ query, service }, options = {}) => {
  const URL = `${BASE_PATH}/search?q=${query}&s=${service}`;
  return sendRequest(
    URL,
    Object.assign(
      {
        method: 'POST',
      },
      options,
    ),
  );
};

export const addMovieScores = (payload, options = {}) => {
  const URL = `${BASE_PATH}`;
  return sendRequest(
    URL,
    Object.assign(
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      options,
    ),
  );
};
