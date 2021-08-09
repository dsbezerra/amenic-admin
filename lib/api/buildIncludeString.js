
const buildIncludeString = (include = []) => {
  if (include.length === 0) {
    return '';
  }
  let str = '{';
  for (let i = 0; i < include.length; i += 1) {
    const inc = include[i];
    str += inc.field;
    if (inc.fields && inc.fields.length) {
      str += '{';
      str += inc.fields.join('\\n');
      str += '}';
    }
    if (i < include.length - 1) {
      str += ',';
    }
  }
  str += '}';
  return str;
};

export default buildIncludeString;
