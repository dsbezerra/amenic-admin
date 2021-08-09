import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

let globalUser = {
  _id: 'diegobezerra',
  isAdmin: true,
};

export default (
  Page,
  { loginRequired = true, logoutRequired = false, adminRequired = false } = {},
) => class BaseComponent extends React.Component {
    static propTypes = {
      user: PropTypes.shape({
        id: PropTypes.string,
        isAdmin: PropTypes.bool,
      }),
      isFromServer: PropTypes.bool.isRequired,
    };

    static defaultProps = {
      user: null,
    };

    static async getInitialProps(ctx) {
      const isFromServer = !!ctx.req;
      // const user = ctx.req ? ctx.req.session && ctx.req.session.user : globalUser;
      const user = globalUser;

      if (isFromServer && user) {
        user._id = user._id.toString();
      }

      const props = { user, isFromServer };

      if (user && Page.getInitialProps) {
        Object.assign(props, (await Page.getInitialProps(ctx)) || {});
      }

      return props;
    }

    componentDidMount() {
      // TODO: refactor auth
      // let { user, isFromServer } = this.props;
      // if (isFromServer) {
      // globalUser = user;
      // } else {
      // globalUser = JSON.parse(localStorage.getItem('user'));
      // }
      const user = globalUser;
      if (loginRequired && !logoutRequired && !user) {
        Router.push('/login');
        return;
      }

      if (adminRequired && (!user || !user.isAdmin)) {
        Router.push('/');
      }

      if (logoutRequired && user) {
        Router.push('/');
      }
    }

    render() {
      const { user } = this.props;

      if (loginRequired && !logoutRequired && !user) {
        return null;
      }

      if (adminRequired && (!user || !user.isAdmin)) {
        return null;
      }

      if (logoutRequired && user) {
        return null;
      }

      return <Page {...this.props} />;
    }
  };
