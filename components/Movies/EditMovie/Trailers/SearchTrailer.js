import React, { Component } from 'react';
import {
  Play,
} from 'grommet-icons';
import {
  Box,
  Button,
  CheckBox,
  FormField,
  Heading,
  Image,
  InfiniteScroll,
  RadioButton,
  Text,
  TextInput,
  ResponsiveContext,
} from 'grommet';

import { Spinner } from '../../..';

import { searchYoutubeTrailer } from '../../../../lib/api/service';

class SearchTrailer extends Component {
  state = {
    /** Used to control the query input field */
    search: '',

    /** Used only to display the query */
    query: '',

    /** The type of the audio */
    audio: '',

    /** Whether the mark as default checkbox is checked or not */
    checked: true,

    /** The selected trailer */
    selected: null,

    /** Holds the result data */
    results: [],

    /** How many results it should return */
    maxResults: 0,

    /** Whether the searching operation is in execution or not */
    isSearching: false,

    /** Holds ID of the currently hovered movie. */
    isWatching: '',
  }

  componentDidMount() {
    const { query } = this.props;
    if (query) {
      this.setState({ search: query });
      this.search(query);
    }
  }

  search = async (q) => {
    this.setState({ isSearching: true });

    const { audio, maxResults } = this.state;
    // eslint-disable-next-line react/destructuring-assignment
    let query = (q || this.props.query).trim();
    if (audio) {
      query += audio === 'original' ? ' legendado' : ' dublado';
    }
    try {
      const { results } = await searchYoutubeTrailer({ query, maxResults });
      this.setState({ results, query });
    } catch (e) {
      console.log(e);
    }

    this.setState({ isSearching: false });
  }

  showTrailer = (item) => {
    this.setState({ isWatching: item.id });
  }

  hideTrailer = () => {
    this.setState({ isWatching: '' });
  }

  onChange = ({ target }) => {
    const { name, value } = target;
    if (name) {
      this.setState({ [name]: value }, () => {
        // Refetch if we are changing the audio option.
        if (name !== 'query') {
          const { search } = this.state;
          this.search(search);
        }
      });
    }
  }

  onSelect = (item) => {
    this.setState({ selected: item });

    const { checked } = this.state;
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect({ ...item, main: checked });
    }
  }

  getTrailerSize = (visible, size) => {
    const result = {};

    if (visible || size === 'small') {
      result.width = '100%';
      result.height = '56.52%';
    } else {
      result.width = '20%';
      result.height = '10%';
    }

    return result;
  }

  render() {
    const {
      audio,
      checked,
      search,
      selected,
      results,
      query,
      isSearching,
      isWatching,
    } = this.state;

    return (
      <ResponsiveContext.Consumer>
        {size => (
          <Box
            onKeyPress={(e) => {
              const { nativeEvent } = e;
              if (nativeEvent.code === 'Enter') {
                this.search(search);
              }
            }}
          >
            <div onMouseEnter={this.hideTrailer}>
              <FormField
                label="Query"
                htmlFor="text-input__query"
              >
                <TextInput
                  id="text-input__query"
                  placeholder="Movie title"
                  value={search}
                  name="search"
                  onChange={this.onChange}
                />
              </FormField>
              <Box
                fill
                direction="row-responsive"
                align="between"
                gap="small"
                margin="small"
              >
                <RadioButton
                  name="audio"
                  label="Original (with subtitles)"
                  value="original"
                  checked={audio === 'original'}
                  onChange={this.onChange}
                />
                <RadioButton
                  name="audio"
                  label="Dubbed"
                  value="dubbed"
                  checked={audio === 'dubbed'}
                  onChange={this.onChange}
                />

                <Button
                  hoverIndicator="background"
                  onClick={() => this.setState({ checked: !checked })}
                >
                  <CheckBox
                    tabIndex="-1"
                    checked={checked}
                    label={(
                      <Box>
                        <Text size="small">Mark as default</Text>
                        <Text color="text-1" size="xsmall">
                          Whether it should be the main trailer displayed to user or not
                        </Text>
                      </Box>
                    )}
                  />
                </Button>
              </Box>
            </div>
            <Box align="center" justify="center">
              {isSearching ? <Spinner color="#000" /> : (
                <Box gap="small" pad="small">
                  <Heading
                    level="4"
                    margin="none"
                  >
                    Trailers
                  </Heading>
                  {query && <Text size="small">{`Showing results for '${query}'`}</Text>}
                  <div style={{ overflowY: 'auto' }}>
                    <InfiniteScroll items={results}>
                      {(item) => {
                        const isTrailerVisible = isWatching === item.id;
                        const isSelected = selected && selected.id === item.id;
                        return (
                          <Box
                            key={item.id}
                            border="bottom"
                            style={{
                              position: 'relative',
                              transition: 'all 1s ease',
                            }}
                            background={isSelected ? '#000' : ''}
                          >
                            <Button
                              plain
                              hoverIndicator
                              onClick={() => this.onSelect(item)}
                            >
                              <Box
                                direction="row-responsive"
                                align={isTrailerVisible ? 'start' : 'center'}
                                wrap={isTrailerVisible}
                              >
                                <Box
                                  {...this.getTrailerSize(isTrailerVisible, size)}
                                  style={{
                                    position: 'relative',
                                    transformOrigin: 'left top',
                                    transition: 'all .2s ease',
                                  }}
                                >
                                  <Image
                                    src={item.thumbnails.high.url}
                                    style={{
                                      transformOrigin: 'left top',
                                      transition: 'all .2s ease',
                                    }}
                                    onMouseEnter={size !== 'small' ? () => {
                                      this.showTrailer(item);
                                    } : null}
                                    width="100%"
                                  />
                                  {(size === 'small' && !isTrailerVisible) && (
                                    <Box
                                      style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                      }}
                                      pad="large"
                                      onClick={() => this.showTrailer(item)}
                                    >
                                      <Play color="white" size="large" />
                                    </Box>
                                  )}
                                  {isTrailerVisible && (
                                    <Box
                                      fill
                                      style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                      }}
                                      animation={{ type: 'fadeIn', duration: 200 }}
                                    >
                                      <iframe
                                        title={item.title}
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${item.id}`}
                                        frameBorder="none"
                                        allow="autoplay; fullscreen"
                                      />
                                    </Box>
                                  )}
                                </Box>
                                <Box pad="medium" basis="100%">
                                  <Text
                                    size="small"
                                    color={isSelected ? 'white' : ''}
                                    truncate
                                  >
                                    {item.title}
                                  </Text>
                                  <Text
                                    color={isSelected ? 'light-5' : 'text-1'}
                                    size="xsmall"
                                    truncate
                                  >
                                    {item.channelTitle}
                                  </Text>
                                </Box>
                              </Box>
                            </Button>
                          </Box>
                        );
                      }}
                    </InfiniteScroll>
                  </div>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}

export { SearchTrailer };
