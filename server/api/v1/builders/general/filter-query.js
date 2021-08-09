module.exports = {
  parseBooleanProperty: (value, empty) => {
    const t = value === 'true' || value === '1';
    const prop = t ? '$ne' : '$eq';
    return { [prop]: empty };
  },
};
