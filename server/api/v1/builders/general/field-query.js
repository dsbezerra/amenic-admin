/**
 * Builds Mongo select string from querystrings
 * @param {Object} request The Express object to access querystrings
 * @return {Object} Payload containing limit and offset values
 */
module.exports = (request) => {
  let select = '-__v'; // Defaults to -__v to remove it from responses.

  if (request.query.fields) {
    select = request.query.fields.replace(/,/g, ' ');
  }

  return select;
};
