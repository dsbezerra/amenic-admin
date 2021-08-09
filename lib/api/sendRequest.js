import axios from './axios';

export default async function sendRequest(path, opts = {}) {
  const headers = Object.assign({}, opts.headers || {}, {
    'Content-type': 'application/json; charset=UTF-8',
  });

  const options = Object.assign({
    method: 'POST',
    url: path,
  }, opts, { headers });
  if (options.body) {
    options.data = options.body;
    delete options.body;
  }

  const response = await axios(options);
  const { data } = response;
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
