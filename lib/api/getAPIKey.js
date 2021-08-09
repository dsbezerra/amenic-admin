import _ from 'lodash';

export default (query = {}) => {
  let preffix = '';
  if (!_.isEmpty(query)) {
    preffix = '&';
  }
  // TODO: Retrieve from localStorage
  return `${preffix}api_key=16ffd14cefff55f79fafec91b6cdcb26`;
};
