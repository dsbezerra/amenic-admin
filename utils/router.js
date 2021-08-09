import _ from 'lodash';
import Router from 'next/router';

export const back = (router) => {
  const { history } = router;
  if (_.isEmpty(history) || _.isArray(history) && history.length === 1) {
    Router.push('/');
    return;
  }

  Router.back();
};
