import sendRequest from './sendRequest';

// const BASE_PATH = '/';

export const login = ({ username, password }) => sendRequest('/login', {
  method: 'POST',
  body: JSON.stringify({
    username,
    password,
  }),
});
