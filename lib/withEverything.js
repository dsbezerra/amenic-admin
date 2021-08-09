import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import withGrommet from './withGrommet';
import withAuth from './withAuth';

// withEverything adds grommet, router, redux store to BaseComponent.
function withEverything(BaseComponent, authProps = {}) {
  class Layout extends React.Component {
    componentDidMount() {
    }

    render() {
      return (
        <BaseComponent {...this.props} />
      );
    }
  }

  Layout.getInitialProps = (ctx) => {
    if (BaseComponent.getInitialProps) {
      return BaseComponent.getInitialProps(ctx);
    }

    return {};
  };

  const layoutComponent = withGrommet(Layout);
  const authComponent = withAuth(layoutComponent, authProps);

  return withRouter(authComponent);
}

export default withEverything;
