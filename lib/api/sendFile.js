import 'isomorphic-unfetch';

import getRootURL from './getRootURL';

export default async function sendFile(path, opts) {
  const response = await fetch(
    `${getRootURL(opts)}${path}`,
    Object.assign({ method: 'POST', credentials: 'same-origin' }, opts),
  );

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
