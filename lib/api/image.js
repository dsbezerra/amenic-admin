import sendRequest from './sendRequest';
// import buildQueryString from './buildQueryString';

const BASE_PATH = '/api/v1/images';

export const setAsMain = (id, options = {}) => (
  sendRequest(
    `${BASE_PATH}/${id}/main`,
    Object.assign(
      {
        method: 'POST',
      },
      options,
    ),
  )
);

export const deleteImage = (id, options = {}) => (
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
