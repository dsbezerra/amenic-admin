import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import _ from 'lodash';
import {
  Edit,
  Trash,
  View,
} from 'grommet-icons';
import {
  Box,
  Button,
  Heading,
  Image,
  Text,
  CheckBox,
} from 'grommet';
import styled from 'styled-components';

import {
  CenterModal,
  DeleteModal,
  Layout,
  PaginatedContent,
  Search,
} from '../../components';
import {
  deleteMovie,
  updateMovie,
  getMovieCount,
  getMovieList,
} from '../../lib/api/movie';

import withEverything from '../../lib/withEverything';

import buildQueryString from '../../lib/api/buildQueryString';
import { defaultPaginationQuery, getPagination } from '../../utils/pagination';

const MOVIE_SORT_OPTIONS = [
  {
    value: 'title',
    name: 'Title',
  },
  {
    value: 'originalTitle',
    name: 'Original Title',
  },
  {
    value: 'releaseDate',
    name: 'Release Date',
  },
];

const InfoItem = ({ question, value }) => (
  <Box>
    <Text size="xsmall">
      {question}
    </Text>
    <Text size="xsmall" color="text-1">{value ? 'Yes' : 'No'}</Text>
  </Box>
);

class MoviesPage extends Component {
  state = {
    /** Holds id of movie to remove */
    remove: '',

    /** Holds movie to hide/unhide */
    hide: null,

    isShowingInfo: true,
  }

  static async getInitialProps({ pathname, query }) {
    const q = { ...defaultPaginationQuery, ...query };
    const movieListResponse = await getMovieList(q);
    if (!movieListResponse.data) {
      movieListResponse.data = [];
    }
    const countResponse = await getMovieCount(q);
    if (!countResponse.data) {
      countResponse.data = 0;
    }
    const movies = movieListResponse.data;
    const totalCount = countResponse.data;
    return {
      movies,
      pagination: getPagination(pathname, query, movies, totalCount),
      totalCount,
    };
  }

  onDelete = async () => {
    const { remove } = this.state;
    if (!remove) {
      return;
    }

    try {
      await deleteMovie(remove);
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

  onHide = async () => {
    const { hide } = this.state;
    if (!hide) {
      return;
    }

    hide.hidden = !hide.hidden;
    try {
      await updateMovie(hide);

      this.setState({ hide: null });

      // const { router } = this.props;
      // let path = router.pathname;
      // if (!_.isEmpty(router.query)) {
      //   path += `?${buildQueryString(router.query)}`;
      // }
      // Router.replace(path);
    } catch (err) {
      // TODO: Use Layer to notify.
      console.log(err);
    }
  }

  render() {
    const {
      movies,
      pagination,
      router,
      totalCount,
    } = this.props;
    const { hide, remove, isShowingInfo } = this.state;
    const { query } = router;

    return (
      <Layout title="Movies" {...this.props}>
        <Box
          pad={{ horizontal: 'medium' }}
          animation={[
            { type: 'slideUp', duration: 500 },
            { type: 'fadeIn', duration: 500 },
          ]}
        >
          <Heading level="2">Movies</Heading>
          <Search
            placeholder="Enter movie title (or original title)..."
            query={query}
          />
        </Box>
        <PaginatedContent
          filter={{
            fields: ['hidden', 'backdrop', 'poster', 'trailer'],
            render: ({ filter, onChange }) => (
              <Box direction="row-responsive" gap="small">
                <CheckBox
                  label="Hidden"
                  checked={filter.hidden}
                  onChange={() => onChange('hidden', !filter.hidden)}
                />

                <CheckBox
                  label="Backdrop"
                  checked={filter.backdrop}
                  onChange={() => onChange('backdrop', !filter.backdrop)}
                />

                <CheckBox
                  label="Poster"
                  checked={filter.poster}
                  onChange={() => onChange('poster', !filter.poster)}
                />

                <CheckBox
                  label="Trailer"
                  checked={filter.trailer}
                  onChange={() => onChange('trailer', !filter.trailer)}
                />
              </Box>
            ),
          }}
          sort={MOVIE_SORT_OPTIONS}
          totalCount={totalCount}
          {...pagination}
        >
          <Box
            margin={{ top: 'medium' }}
            animation={[
              { type: 'slideUp', duration: 500, delay: 400 },
              { type: 'fadeIn', duration: 500, delay: 400 },
            ]}
          >
            {_.map(movies, m => (
              <MovieRow
                key={m._id}
                movie={m}
                withInfo={isShowingInfo}
                onDelete={(e) => {
                  e.preventDefault();
                  this.setState({ remove: m._id });
                }}
                onHide={(e) => {
                  e.preventDefault();
                  this.setState({ hide: m });
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

        {hide && (
          <CenterModal
            onClose={() => this.setState({ hide: '' })}
          >
            <Text>{`Are you sure you want to ${hide.hidden ? 'unhide' : 'hide'}?`}</Text>
            <Box
              tag="footer"
              gap="small"
              direction="row"
              align="center"
              justify="end"
              pad={{ top: 'medium', bottom: 'small' }}
            >
              <Button
                label="Close"
                onClick={() => this.setState({ hide: null })}
                color="text-1"
              />
              <Button
                label={(
                  <Text color="white">
                    <strong>{`${hide.hidden ? 'Unhide' : 'Hide'}`}</strong>
                  </Text>
                )}
                onClick={this.onHide}
                primary
                color="status-critical"
              />
            </Box>
          </CenterModal>
        )}
      </Layout>
    );
  }
}

export default withEverything(MoviesPage, { adminRequired: true });

const StyledMovieRow = styled.div`
  :hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.02);
  }
`;
const MovieRow = ({ movie, withInfo, onHide, onDelete }) => (
  <StyledMovieRow>
    <Link href={`/movies/edit?id=${movie._id}`}>
      <Box
        width="100%"
        direction="row-responsive"
        pad={{ vertical: 'medium' }}
        border="bottom"
      >
        <Box direction="row" width="100%">
          <Box
            width="140px"
            height="small"
            margin={{ left: 'medium' }}
          >
            <Image
              alt={movie.title}
              src={movie.poster}
              fit="cover"
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
              <Box
                align="center"
                direction="row"
                gap="small"
              >
                <Heading
                  level="4"
                  margin="none"
                  style={{ fontWeight: 500 }}
                  truncate
                >
                  {movie.title}
                </Heading>
                {Math.abs(movie.rating) > 0 && (
                  <Image
                    width="16px"
                    height="16px"
                    src={`/static/img/rating_${movie.rating === -1 ? 'L' : movie.rating}_16px.png`}
                  />
                )}
              </Box>
              {movie.originalTitle && (
                <Text size="xsmall" color="text-1" truncate>
                  {`(${movie.originalTitle})`}
                </Text>
              )}
              <Text
                color="text-1"
                size="small"
                margin={{ top: 'xsmall' }}
                truncate
              >
                {_.join(movie.genres, ', ')}
              </Text>

              {withInfo && (
                <Box
                  animation={[
                    { type: 'slideUp', duration: 500 },
                    { type: 'fadeIn', duration: 500 },
                  ]}
                >
                  <Box border="top" margin={{ top: 'small' }} pad={{ top: 'small' }}>
                    <Text size="small" style={{ fontWeight: 500 }}>
                      Information
                    </Text>
                  </Box>
                  <Box
                    align="start"
                    margin={{ vertical: 'small' }}
                    direction="row"
                    gap="small"
                    wrap
                  >
                    <InfoItem
                      question="Hidden?"
                      value={movie.hidden}
                    />

                    <InfoItem
                      question="Has Backdrop?"
                      value={!_.isEmpty(movie.backdrop)}
                    />

                    <InfoItem
                      question="Has Trailer?"
                      value={movie.trailer}
                    />

                    <InfoItem
                      question="Has Cast?"
                      value={!_.isEmpty(movie.cast)}
                    />
                  </Box>
                </Box>
              )}
            </Box>

            <Box
              direction="row-responsive"
              margin={{ right: 'medium' }}
              gap="small"
            >
              <Link href={`/movies/edit?id=${movie._id}`} passHref>
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
                label={(
                  <Box align="center" gap="xsmall">
                    <Trash color="icon" />
                    <Text size="xsmall">Delete</Text>
                  </Box>
                )}
                plain
                hoverIndicator
                onClick={onDelete}
              />

              <Button
                label={(
                  <Box align="center" gap="xsmall">
                    <View color="icon" />
                    <Text size="xsmall">{`${movie.hidden ? 'Unhide' : 'Hide'}`}</Text>
                  </Box>
                )}
                plain
                hoverIndicator
                onClick={onHide}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Link>
  </StyledMovieRow>
);
