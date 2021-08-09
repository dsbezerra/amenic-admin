
/**
 * Removes chars from the beginning of a string.
 * @param {*} str
 * @param {*} c
 */
const trimLeft = (str, c) => {
  if (!str) return str;

  let i = 0;
  while (str.charAt(i) === c) {
    i += 1;
  }

  return str.substring(i);
};

/**
 * Builds sort query from querystrings
 * @param {Object} request The Express object to access querystrings
 * @return {Object} Payload containing sort info
 */
module.exports = (request) => {
  const { sort } = request.query;
  if (!sort) {
    return undefined;
  }
  // return sort.split(',')
  //   .map(f => [f]);

  const result = {};

  sort.split(',')
    .forEach((f) => {
      let key = f;
      let sign = 1;

      if (f.startsWith('+')) {
        key = trimLeft(f, '+');
      }

      if (f.startsWith('-')) {
        key = trimLeft(f, '-');
        sign = -1;
      }

      key = key.trim();
      result[key] = sign;
    });

  return result;
};
