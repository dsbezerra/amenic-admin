import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/apikeys';

export const getApiKeysList = (options = {}) =>
  sendRequest(
    BASE_PATH,
    Object.assign(
      {
        method: 'GET',
      },
      options,
    ),
  );

export const addApiKey = ({ apiKey }, options = {}) => (
  sendRequest(
    BASE_PATH,
    Object.assign(
      {
        method: 'POST',
        body: JSON.stringify(apiKey),
      },
      options,
    ),
  )
);

export const deleteApiKey = (id, options = {}) => (
  sendRequest(
    `${BASE_PATH}/${id}`,
    Object.assign(
      {
        method: 'DELETE',
      },
      options,
    ),
  )
);

export const updateApiKey = ({ apiKey }, options = {}) => (
  sendRequest(
    `${BASE_PATH}/${apiKey._id}`,
    Object.assign(
      {
        method: 'PUT',
        body: JSON.stringify(apiKey),
      },
      options,
    ),
  )
);
