import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import _ from 'lodash';
import {
  Box,
  Button,
  Text,
  Heading,
  Image,
  ResponsiveContext,
} from 'grommet';
import { Cinemais, Ibicinemas } from '../components/Icon';

import withEverything from '../lib/withEverything';

import {
  Layout,
  HorizontalScroller,
  Spinner,
} from '../components';

import { getNowPlaying, getUpcoming } from '../lib/api/movie';

const MovieSection = ({
  summary,
  secondary,
  movies,
  loading,
}) => (
  <Box margin={{ vertical: 'medium' }}>
    <SectionHeader
      summary={summary}
      secondary={secondary}
    />
    {loading ? (
      <Box align="center" margin="large">
        <Spinner color="#000" />
      </Box>
    ) : (
      <Box animation={[
        { type: 'slideUp', duration: 500 },
        { type: 'fadeIn', duration: 500, delay: 100 },
      ]}
      >
        {(_.size(movies) > 0) ? (
          <HorizontalScroller>
            {_.map(movies, m => <Movie key={m._id} movie={m} />)}
          </HorizontalScroller>
        ) : (
          <Box margin="medium">
            <Text>No movies found</Text>
          </Box>
        )}
      </Box>
    )}
  </Box>
);

MovieSection.propTypes = {
  summary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
  movies: PropTypes.arrayOf().isRequired,
  loading: PropTypes.bool.isRequired,
};

const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const parseDate = (ISOString, abbrev = false, lower = true) => {
  if (!ISOString) {
    return '';
  }

  const date = new Date(ISOString);
  const d = date.getDate();
  let m = monthNames[date.getMonth()];
  if (lower) {
    m = m.toLowerCase();
  }
  if (abbrev) {
    m = m.substr(0, 3);
  }
  let y = ` ${date.getFullYear()}`;
  if (new Date().getFullYear() === date.getFullYear()) {
    y = '';
  }

  return `${d} de ${m}${y}`;
};

const Movie = ({ movie }) => (
  <ResponsiveContext.Consumer>
    {size => (
      <Link href={`/movies/edit?id=${movie._id}`} passHref>
        <Button hoverIndicator>
          <Box
            background="background-1"
            width={size !== 'small' ? '120px' : '100px'}
            margin={{ horizontal: 'xsmall', vertical: 'xsmall' }}
            responsive
          >
            <Box>
              <Image
                alt={movie.title}
                src={movie.poster}
                style={{ maxWidth: '120px', maxHeight: '180px' }}
                round="small"
                fit="cover"
              />
            </Box>
            <Box pad={{ horizontal: 'small', vertical: 'small' }}>
              <Text
                size="small"
                margin={{ vertical: 'none' }}
                style={{ fontWeight: 500 }}
                truncate
                responsive
              >
                {movie.title}
              </Text>
              <Text size="xsmall" margin={{ top: 'small' }} truncate responsive>
                {movie.theaters ? (
                  <Box direction="row" gap="xsmall">
                    {movie.theaters.map(t => (
                      t._id.indexOf('cinemais') > -1 ? (
                        <Cinemais key={`${movie._id}-movie-theater-${t._id}`} />
                      ) : <Ibicinemas key={`${movie._id}-movie-theater-${t._id}`} />
                    ))}
                  </Box>
                ) : movie.formattedReleaseDate}
              </Text>
            </Box>
          </Box>
        </Button>
      </Link>
    )}
  </ResponsiveContext.Consumer>
);

const moviePropType = PropTypes.shape({
  _id: PropTypes.string,
  title: PropTypes.string,
  poster: PropTypes.string,
  theaters: PropTypes.arrayOf(PropTypes.string),
  formattedReleaseDate: PropTypes.string,
});

Movie.propTypes = {
  movie: moviePropType.isRequired,
};

const SectionHeader = ({ summary, secondary }) => (
  <Box margin={{ horizontal: 'medium', bottom: 'small' }}>
    {summary && (
      <Heading
        level="2"
        margin={{ bottom: 'small' }}
        style={{ fontWeight: 600 }}
        responsive
      >
        {summary}
      </Heading>
    )}
    {secondary && (
      (typeof secondary === 'string' ? (
        <Text
          color="text-1"
          size="small"
        >
          {secondary}
        </Text>
      ) : cloneElement(secondary))
    )}
  </Box>
);

SectionHeader.propTypes = {
  summary: PropTypes.string,
  secondary: PropTypes.string,
};

SectionHeader.defaultProps = {
  summary: null,
  secondary: null,
};

class App extends Component {
  static async getInitialProps() {
    const nowPlayingResponse = await getNowPlaying({
      fields: ['title', 'poster', 'theater'].join(','),
    });
    const upcomingResponse = await getUpcoming({
      fields: ['title', 'poster', 'releaseDate'].join(','),
      limit: 100,
    });
    return {
      nowPlaying: {
        loading: false,
        // period: formatPeriod(nowPlayingResponse.period),
        movies: nowPlayingResponse.data,
      },
      upcoming: {
        loading: false,
        movies: _.map(upcomingResponse.data, m => ({
          ...m,
          formattedReleaseDate: parseDate(m.releaseDate),
        })),
      },
    };
  }

  render() {
    const { nowPlaying, upcoming } = this.props;
    return (
      <Layout title="Home" {...this.props}>
        <Box>
          <MovieSection
            summary="Nos cinemas"
            section="now_playing"
            loading={nowPlaying.loading}
            movies={nowPlaying.movies}
          />

          <MovieSection
            summary="Próximos lançamentos"
            section="upcoming"
            loading={upcoming.loading}
            movies={upcoming.movies}
          />
        </Box>
      </Layout>
    );
  }
}

App.propTypes = {
  nowPlaying: PropTypes.shape({
    loading: PropTypes.bool,
    movies: PropTypes.arrayOf(moviePropType),
  }),
  upcoming: PropTypes.shape({
    loading: PropTypes.bool,
    movies: PropTypes.arrayOf(moviePropType),
  }),
};

App.defaultProps = {
  nowPlaying: [],
  upcoming: [],
};

export default withEverything(App, { adminRequired: true });
