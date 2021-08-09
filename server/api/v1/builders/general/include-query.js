const parseSelectFields = (str, index) => {
  const result = {
    data: null,
    start: index,
    index,
  };

  const fields = [];

  let i = index;
  let start = index;

  let parsing = true;

  while (parsing && i < str.length) {
    const c = str.charAt(i);

    if (c === ',') {
      fields.push(str.substring(start, i));
      start = i + 1;
    } else if (c === '}') {
      fields.push(str.substring(start, i));
      parsing = false;
    }

    i += 1;
  }

  result.data = fields;
  result.index = i;

  return result;
};

const parseModel = (str) => {
  const result = {
    model: null,
    fields: [],
    end: str.length,
  };

  let parsing = true;
  let i = 0;

  if (str.startsWith(',')) {
    // eslint-disable-next-line no-param-reassign
    str = str.substring(1);
  }

  while (parsing && i < str.length) {
    const c = str.charAt(i);

    if (c === ',') {
      result.model = str.substring(0, i);
      result.end = i;

      parsing = false;
    } else if (c === '{') {
      result.model = str.substring(0, i);

      const fields = parseSelectFields(str, i + 1);
      if (fields.data) {
        result.fields = fields.data;
        result.end = fields.index;
        i = fields.index;
      }
      parsing = false;
    }

    if (parsing) {
      i += 1;
    }
  }

  if (!result.model && i > 0) {
    result.model = str.substring(0);
  }

  return result;
};

module.exports = (request) => {
  const result = [];

  if (request.query.include) {
    let { include } = request.query;
    do {
      const {
        model,
        fields,
        end,
      } = parseModel(include);
      if (model) {
        const populate = {
          path: model,
          select: fields.length === 0 ? ['-__v'] : fields,
        };
        result.push(populate);
      }

      if (!model) {
        break;
      }

      include = include.substring(end);
    } while (true);
  }

  return result;
};
