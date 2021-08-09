import buildIncludeString from './buildIncludeString';

module.exports = (q, isFromServer = true) => {
  const query = q;
  if (isFromServer) {
    if (query.page > 0 && q.per_page) {
      query.limit = q.per_page;
      query.skip = (q.page - 1) * q.per_page;
    }
    delete query.page;
    delete query.per_page;
  }
  const names = Object.keys(query);
  let result = '';
  for (let i = 0; i < names.length; i += 1) {
    const p = names[i];

    let v = query[p];
    if (p === 'include') {
      v = buildIncludeString(v);
    }

    if (i < names.length - 1) {
      result += `${p}=${v}&`;
    } else {
      result += `${p}=${v}`;
    }
  }
  result += '&api_key=16ffd14cefff55f79fafec91b6cdcb26';
  return result;
};
