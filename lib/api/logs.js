import sendRequest from './sendRequest';
import buildQueryString from './buildQueryString';

const BASE_PATH = '/api/v1/logs';

export const getLogList = (q = { page: 1 }, options = {}) => {
  const URL = `${BASE_PATH}?${buildQueryString(q)}`;
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
