import sendRequest from './sendRequest';

const BASE_PATH = '/api/v1/commands';

export const getCommandsList = (options = {}) => sendRequest(
  BASE_PATH,
  Object.assign(
    {
      method: 'GET',
    },
    options,
  ),
);

export const runCommand = (command, options = {}) => (
  sendRequest(
    BASE_PATH,
    Object.assign(
      {
        method: 'POST',
        body: JSON.stringify(command),
      },
      options,
    ),
  )
);
