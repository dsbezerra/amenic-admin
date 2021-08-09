import React, { Component } from 'react';
import {
  Box,
  Heading,
} from 'grommet';

import {
  Layout,
} from '../../components';

import withEverything from '../../lib/withEverything';

class ScrapersPage extends Component {
  state = {}

  render() {
    return (
      <Layout title="Scrapers" {...this.props}>
        <Box
          pad={{ horizontal: 'medium' }}
          animation={[
            { type: 'slideUp', duration: 500 },
            { type: 'fadeIn', duration: 500 },
          ]}
        >
          <Heading level="2">Scrapers</Heading>
        </Box>
      </Layout>
    );
  }
}

export default withEverything(ScrapersPage, { adminRequired: true });
