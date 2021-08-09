import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import _ from 'lodash';
import {
  Edit,
  Trash,
} from 'grommet-icons';
import {
  Box,
  Button,
  CheckBox,
  Heading,
  Image,
  Text,
} from 'grommet';
import styled from 'styled-components';

import {
  DeleteModal,
  Layout,
  LocationChooser,
  PaginatedContent,
  Search,
} from '../../components';
import {
  deleteTheater,
  getTheaterCount,
  getTheaterList,
} from '../../lib/api';
import buildQueryString from '../../lib/api/buildQueryString';
import withEverything from '../../lib/withEverything';

import { defaultPaginationQuery, getPagination } from '../../utils/pagination';

class TheatersPage extends Component {
  state = {
    remove: '',
  }

  static async getInitialProps({ pathname, query }) {
    const q = {
      ...defaultPaginationQuery,
      ...query,
      include: [
        { field: 'city', fields: ['name', 'state'] },
      ],
    };
    const theaterListResponse = await getTheaterList(q);
    if (!theaterListResponse.data) {
      theaterListResponse.data = [];
    }
    const countResponse = await getTheaterCount(q);
    if (!countResponse.data) {
      countResponse.data = 0;
    }
    const theaters = theaterListResponse.data;
    const totalCount = countResponse.data;
    return {
      theaters,
      pagination: getPagination(pathname, query, theaters, totalCount),
      totalCount,
    };
  }

  onDelete = async () => {
    const { remove } = this.state;
    if (!remove) {
      return;
    }

    try {
      await deleteTheater(remove);
      this.setState({ remove: '' });

      const { router } = this.props;

      let path = router.pathname;
      if (!_.isEmpty(router.query)) {
        path += `?${buildQueryString(router.query)}`;
      }
      Router.replace(path);
    } catch (err) {
      // TODO: Use Layer to notify.
      console.log(err);
    }
  }

  render() {
    const {
      theaters,
      city,
      state,
      pagination,
      router,
      totalCount,
    } = this.props;
    const { remove } = this.state;
    const { query } = router;

    return (
      <Layout title="Theaters" {...this.props}>
        <Box
          pad={{ horizontal: 'medium' }}
          animation={[
            { type: 'slideUp', duration: 500 },
            { type: 'fadeIn', duration: 500 },
          ]}
        >
          <Heading level="2">Theaters</Heading>
          <Search
            placeholder="Enter theater name..."
            query={query}
          />
        </Box>

        <PaginatedContent
          filter={{
            fields: ['hidden'],
            render: ({ filter, onChange }) => (
              <Box>
                <Box direction="row-responsive" gap="small" margin={{ bottom: 'small' }}>
                  <CheckBox
                    label="Hidden"
                    checked={filter.hidden}
                    onChange={() => onChange('hidden', !filter.hidden)}
                  />
                </Box>
                <LocationChooser
                  defaultState={state}
                  defaultCity={city}
                  onChange={(name, value) => {
                    if (name === 'city') {
                      if (value) {
                        onChange(name, value._id);
                      } else {
                        onChange(name, undefined);
                      }
                    }
                  }}
                />
              </Box>
            ),
          }}
          {...pagination}
          totalCount={totalCount}
        >
          <Box
            margin={{ top: 'medium' }}
            animation={[
              { type: 'slideUp', duration: 500, delay: 400 },
              { type: 'fadeIn', duration: 500, delay: 400 },
            ]}
          >
            {_.map(theaters, c => (
              <TheaterRow
                key={c._id}
                theater={c}
                onDelete={(e) => {
                  e.preventDefault();
                  this.setState({ remove: c._id });
                }}
              />
            ))}
          </Box>
        </PaginatedContent>
        {remove && (
          <DeleteModal
            onDelete={this.onDelete}
            onClose={() => this.setState({ remove: '' })}
          />
        )}
      </Layout>
    );
  }
}

TheatersPage.propTypes = {
  theaters: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
  })),
  city: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    state: PropTypes.string,
  }),
  state: PropTypes.string,
  totalCount: PropTypes.number,
};

TheatersPage.defaultProps = {
  theaters: [],
  city: null,
  state: null,
  totalCount: 0,
};

const StyledTheaterRow = styled.div`
  :hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.02);
  }
`;
const TheaterRow = ({ theater, onDelete }) => (
  <StyledTheaterRow>
    <Link href={`/theaters/edit?id=${theater._id}`}>
      <Box
        fill
        direction="row-responsive"
        pad={{ vertical: 'medium' }}
        border="bottom"
      >
        <Box direction="row" fill>
          <Box
            width="56px"
            height="56px"
            margin={{ left: 'medium' }}
          >
            <Image
              alt={theater.name}
              src={theater.images && theater.images.icon}
              fit="contain"
              style={{ borderRadius: '10px' }}
            />
          </Box>

          <Box
            direction="row-responsive"
            width="100%"
            align="start"
          >
            <Box
              width="100%"
              pad={{ horizontal: 'medium' }}
            >
              <Heading
                level="4"
                margin="none"
                style={{ fontWeight: 500 }}
                truncate
              >
                {theater.name}
              </Heading>
              {(theater.city && theater.city.name) && (
                <Text size="small">{`${theater.city.name} - ${theater.city.state}`}</Text>
              )}
            </Box>

            <Box
              direction="row-responsive"
              margin={{ right: 'medium' }}
              gap="small"
            >

              <Link href={`/theaters/edit?id=${theater._id}`}>
                <Button
                  label={(
                    <Box align="center" gap="xsmall">
                      <Edit color="icon" />
                      <Text size="xsmall">Edit</Text>
                    </Box>
                  )}
                  plain
                  hoverIndicator
                />
              </Link>

              <Button
                icon={(
                  <Box align="center" gap="xsmall">
                    <Trash color="icon" />
                    <Text size="xsmall">Delete</Text>
                  </Box>
                )}
                plain
                hoverIndicator
                onClick={onDelete}
              />
            </Box>
          </Box>

        </Box>
      </Box>
    </Link>
  </StyledTheaterRow>
);

TheaterRow.propTypes = {
  theater: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    city: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      state: PropTypes.string,
    }),
    images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};


export default withEverything(TheatersPage, { adminRequired: true });
