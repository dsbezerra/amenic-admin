module.exports = (opts) => {
  const port = process.env.PORT || 9000;
  let ROOT_URL = process.env.NODE_ENV === 'production' ? 'https://amenic-admin.herokuapp.com'
    : `http://localhost:${port}`;

  if (opts && opts.headers && opts.headers.host) {
    ROOT_URL = `http://${opts.headers.host}`;
  } else if (typeof window !== 'undefined') {
    ROOT_URL = window.location.origin;
  }
  return ROOT_URL;
};
