import React from 'react';
import { connect } from 'react-redux';
import { Grommet } from 'grommet';

import { light, dark } from './themes';

function mapStateToProps({ main }) {
  const { theme } = main;
  return { theme };
}

function withGrommet(BaseComponent) {
  class App extends React.Component {
    componentDidMount() { }

    render() {
      const { theme, ...rest } = this.props;
      return (
        <Grommet theme={theme === 'light' ? light : dark} full>
          <BaseComponent {...rest} />
        </Grommet>
      );
    }
  }

  App.getInitialProps = (ctx) => {
    if (BaseComponent.getInitialProps) {
      return BaseComponent.getInitialProps(ctx);
    }

    return {};
  };

  return connect(mapStateToProps)(App);
}

export default withGrommet;
