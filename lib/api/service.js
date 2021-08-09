import _ from 'lodash';

import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/services';

export const searchYoutubeTrailer = (data, options = {}) => {
  const path = `${BASE_PATH}/youtube/search`;
  return sendRequest(
    path,
    Object.assign({
      method: 'POST',
      body: JSON.stringify(data),
    }),
    options,
  );
};
