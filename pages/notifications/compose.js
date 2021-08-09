import React, { Component } from 'react';
import {
  Box,
  Heading,
} from 'grommet';
import {
  Layout,
} from '../../components';

import withEverything from '../../lib/withEverything';

class ComposeNotificationPage extends Component {
  componentDidMount() { }

  render() {
    return (
      <Layout title="Notifications" {...this.props}>
        <Box
          pad={{ horizontal: 'medium' }}
          animation={[
            { type: 'slideUp', duration: 500 },
            { type: 'fadeIn', duration: 500 },
          ]}
        >
          <Heading level="2">Compose</Heading>
        </Box>
      </Layout>
    );
  }
}

export default withEverything(ComposeNotificationPage, { adminRequired: true });
