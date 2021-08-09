/**
 * Checks whether the given object is string or not.
 * @param {Object} src The object to check.
 */
const isString = src => typeof src === 'string';

/**
 * Checks whether the string is empty or not.
 * @param {String} src The string to check.
 */
const isEmpty = src => (isString(src) && src.length === 0);

/**
 * Parses a string to boolean value.
 * @param {String} s String to parse.
 */
const parseBoolean = (s) => {
  if (isEmpty(s)) {
    return null;
  }

  const sLc = s.toLowerCase();
  if (sLc === 'true' || s === '1') {
    return true;
  }

  if (sLc === 'false' || s === '0') {
    return false;
  }

  return null;
};

/**
 * Sets the first character of a string to uppercase.
 * @param {String} str String to capitalize.
 */
const capitalize = (str) => {
  if (!str || str.length < 1) {
    return str;
  }
  return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
};

/**
 * Checks whether src strings contains substring.
 * @param {String} s1 String to look for.
 * @param {String} s2 Substring to compare.
 */
const contains = (s1, s2, ignoreCase = false) => {
  if (isEmpty(s1) || isEmpty(s2)) return false;

  let src = s1;
  let substring = s2;
  if (ignoreCase) {
    src = src.toLowerCase();
    substring = substring.toLowerCase();
  }

  return src.indexOf(substring) > -1;
};

/**
 * Same as contains except that in this case is ignored.
 * @param {String} src String to look for.
 * @param {String} substring Substring to compare.
 */
const containsIgnoreCase = (src, substring) => (
  contains(src, substring, true)
);

module.exports = {
  isString,
  isEmpty,
  parseBoolean,
  capitalize,
  contains,
  containsIgnoreCase,
};
