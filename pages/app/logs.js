import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Box,
  DataTable,
  Text,
} from 'grommet';
import {
  PaginatedContent,
} from '../../components';

import { app, TabLogs } from '.';

import { getLogList } from '../../lib/api/logs';
import { capitalize } from '../../utils/string';
import { defaultPaginationQuery, getPagination } from '../../utils/pagination';

/** Properties of each table row data */
const PropertyTime = 'property#Time';
const PropertyApp = 'property#App';
const PropertyLevel = 'property#Level';
const PropertyMessage = 'property#Message';

const PROPERTIES = [
  PropertyTime,
  PropertyApp,
  PropertyLevel,
  PropertyMessage,
];

const AppColors = {
  API: '#3498db',
  Worker: '#34495e',
};

const LogLevelColors = {
  error: '#FF3211',

  warn: '#FFC030',
  warning: '#FFC030',

  info: '#6FAE51',
  debug: '#5C98D2',
};

const AppAliases = {
  web: 'API',
  worker: 'Worker',
};

/** Columns of table */
const COLUMNS = _.map(PROPERTIES, (prop) => {
  const key = prop.replace('property#', '');
  const res = {
    property: key,
    header: capitalize(key),
    render: datum => (
      <Text size="small">{datum[key]}</Text>
    ),
  };

  const tagRender = (id, data, color) => (
    <Box
      key={id}
      background={color}
      pad="5px"
      round="xsmall"
    >
      <Text
        color="white"
        size="xsmall"
      >
        {data}
      </Text>
    </Box>
  );

  if (prop === PropertyLevel || prop === PropertyApp) {
    const colorObj = prop === PropertyLevel ? LogLevelColors : AppColors;
    res.render = (datum) => {
      const data = datum[key];
      const color = colorObj[data];
      return tagRender(datum._id, AppAliases[data] || data, color || 'text-1');
    };
  }

  return res;
});

class Logs extends Component {
  static async getInitialProps({ req, query }) {
    const headers = {};
    if (req && req.headers && req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    const {
      entries,
      totalCount,
      pages,
    } = await getLogList({ ...defaultPaginationQuery, ...query }, { headers });

    return {
      entries,
      pagination: getPagination(query, pages, {
        from: 'logs', to: 'app/logs',
      }),
      totalCount,
    };
  }

  render() {
    const {
      entries,
      pagination,
      totalCount,
    } = this.props;
    return (
      <Box pad={{ horizontal: 'medium' }}>
        {totalCount === 0 && (
          <Text>No logs found.</Text>
        )}
        {totalCount > 0 && (
          <PaginatedContent {...pagination} totalCount={totalCount}>
            <DataTable
              data={entries}
              columns={COLUMNS}
              sortable
            />
          </PaginatedContent>
        )}
      </Box>
    );
  }
}

Logs.defaultProps = {
  entries: [],
};

Logs.propTypes = {
  /**
   * Log entries to display.
   */
  entries: PropTypes.arrayOf(PropTypes.object),

  /**
   * Total count of log entries for the current query.
   */
  totalCount: PropTypes.number.isRequired,
};

export default app(Logs, TabLogs);
