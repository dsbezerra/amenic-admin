import {
  Box,
} from 'grommet';

import { Pages } from './Pages';
import { Filter, Sort } from '..';

export const PageSwitcher = ({ limit, offset, totalCount, ...rest }) => {
  const first = totalCount > 0 ? offset + 1 : 0;
  let last = offset + limit;
  if (last > totalCount) {
    last = totalCount;
  }
  return (
    <Box direction="row-responsive" align="center" justify="center">
      {totalCount >= 0 ? (
        <Box fill pad="medium">
          {`Showing ${first} to ${last} of ${totalCount}`}
        </Box>
      ) : <Box fill />}
      <Pages {...rest} />
      <Box fill />
    </Box>
  );
};

export const PaginatedContent = ({ children, filter, sort, query, top, bottom, ...rest }) => {
  const specific = top || bottom;
  return (
    <Box>
      {(filter || sort) && (
        <Box pad={{ horizontal: 'medium' }}>
          {filter && (
            <Filter query={query} fields={filter.fields}>
              {filter.render}
            </Filter>
          )}
          {sort && (
            <Sort query={query} options={sort} />
          )}
        </Box>
      )}
      {(top || !specific) && <PageSwitcher {...rest} />}
      {children}
      {(bottom || !specific) && <PageSwitcher {...rest} />}
    </Box>
  );
};
