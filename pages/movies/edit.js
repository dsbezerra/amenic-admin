import React, { Component } from 'react';
import Router from 'next/router';
import _ from 'lodash';
import {
  Box,
  Tab,
  Tabs,
} from 'grommet';
import {
  Layout,
} from '../../components';

import {
  Cast,
  Genres,
  Images,
  Overview,
  Trailers,
} from '../../components/Movies/EditMovie';

import {
  MOVIE,
  getMovieById,
  getMovieGenres,
  getMovieImages,
  updateMovie,
} from '../../lib/api';

import withEditable from '../../lib/withEditable';
import withEverything from '../../lib/withEverything';

const TabOverview = 'overview';
const TabCast = 'cast';
const TabGenres = 'genres';
const TabImages = 'images';
const TabTrailers = 'trailers';
const TabScores = 'scores';

const TabItemNames = [
  TabOverview,
  TabCast,
  TabGenres,
  TabImages,
  TabTrailers,
  TabScores,
];

class EditMovie extends Component {
  state = {
    activeTab: -1,
  }

  static async getInitialProps({ query }) {
    const { data } = await getMovieById(query.id);
    console.log(data);
    // const { genres } = await getMovieGenres();
    // const images = await getMovieImages(query.id, {}, { headers });
    return {
      tab: query.t || TabOverview,
      movie: {
        ...data,
        genres: _.sortBy(data.genres),
      },
      images: [],
      allGenres: [],
    };
  }

  componentDidMount() {
    const { tab } = this.props;
    this.setState({ activeTab: this.getTabIndex(tab) });
  }


  getTabIndex = (name) => {
    const { activeTab } = this.state;
    if (activeTab > -1) {
      return activeTab;
    }

    return _.indexOf(TabItemNames, name);
  }

  getTabName = (t) => {
    if (!t || t.length < 1) {
      return t;
    }
    return `${t.charAt(0).toUpperCase()}${t.substring(1)}`;
  }

  onUpdateMovie = (field, value) => {
    const { onUpdate } = this.props;
    if (onUpdate) {
      onUpdate(field, value);
    }
  }

  onAddCastMember = (member) => {
    const { movie } = this.props;
    this.onUpdateMovie('cast', _.uniq([...movie.cast, member]));
  }

  onRemoveCastMember = (member, index) => {
    const { movie } = this.props;
    this.onUpdateMovie('cast', [...movie.cast.slice(0, index), ...movie.cast.slice(index + 1)]);
  }

  onAddGenre = (genre) => {
    const { movie } = this.props;
    this.onUpdateMovie('genres', _.sortBy(_.uniq([...movie.genres, genre])));
  }

  onRemoveGenre = (genre, index) => {
    const { movie } = this.props;
    this.onUpdateMovie('genres', [
      ...movie.genres.slice(0, index), ...movie.genres.slice(index + 1),
    ]);
  }

  onAddTrailer = (trailer) => {
    const { main, ...rest } = trailer;
    if (main) {
      this.onUpdateMovie('trailer', rest.id);
    }

    // TODO: Call POST to /trailers endpoint
    console.log('We should add this trailer to trailers collection');
  }

  onTabActive = (i) => {
    this.setState({ activeTab: i });

    const { movie } = this.props;
    const k = TabItemNames[i];
    const href = `/movies/edit?id=${movie._id}&t=${k}`;
    Router.push(href, href, { shallow: true });
  }

  renderTab = (k) => {
    const { movie } = this.props;

    let component = null;
    switch (k) {
      case TabOverview:
        component = (
          <Overview
            movie={movie}
            onChange={this.onUpdateMovie}
          />
        );
        break;

      case TabCast:
        component = (
          <Cast
            cast={movie.cast}
            onAdd={this.onAddCastMember}
            onRemove={this.onRemoveCastMember}
          />
        );
        break;

      case TabGenres: {
        const { allGenres } = this.props;
        component = (
          <Genres
            genres={movie.genres}
            suggestions={allGenres}
            onAdd={this.onAddGenre}
            onRemove={this.onRemoveGenre}
          />
        );
      } break;

      case TabImages: {
        const { images } = this.props;
        component = <Images movie={movie} images={images} />;
      } break;

      case TabTrailers:
        component = (
          <Trailers
            movie={movie}
            onAdd={this.onAddTrailer}
          />
        );
        break;

      case TabScores:
        break;

      default:
    }

    return (
      <Tab
        key={`tab${k.toLowerCase()}`}
        title={this.getTabName(k)}
      >
        <Box pad={{ horizontal: 'medium' }}>
          {component || 'missing component'}
        </Box>
      </Tab>
    );
  }

  render() {
    const {
      tab,
      editBar,
    } = this.props;

    return (
      <Layout title="Movies" {...this.props}>
        <Box
          animation={[
            { type: 'slideUp', duration: 500 },
            { type: 'fadeIn', duration: 500 },
          ]}
        >
          {editBar}
          <Box
            width="100%"
            align="start"
          >
            <Tabs
              width="100%"
              activeIndex={this.getTabIndex(tab)}
              justify="start"
              onActive={this.onTabActive}
            >
              {_.map(TabItemNames, this.renderTab)}
            </Tabs>
          </Box>
        </Box>
      </Layout>
    );
  }
}

const EditableMovie = withEditable(EditMovie, {
  title: 'Edit Movie',
  dataProp: 'movie',
  bgProp: 'backdrop|poster',
  saveFn: updateMovie,
});
export default withEverything(EditableMovie, { adminRequired: true });
