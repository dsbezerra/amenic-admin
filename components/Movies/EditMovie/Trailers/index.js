import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  FormAdd,
  FormClose,
  Trash,
  View,
} from 'grommet-icons';
import {
  Box,
  Button,
  FormField,
  Heading,
  Layer,
  Text,
  TextInput,
} from 'grommet';

import { AddModal, DeleteModal } from '../../../Modal';

import { SearchTrailer } from './SearchTrailer';

const WatchModal = ({ trailer, movie, onClose }) => (
  <Layer
    position="center"
    modal
    onClickOutside={onClose}
    onEsc={onClose}
    responsive
  >
    <Box pad="medium" gap="small" width="xlarge">
      <Box direction="row" gap="small" align="center" margin={{ bottom: 'small' }}>
        <FormClose color="icon" onClick={onClose} />
        <Text truncate>{`Trailer for ${movie.title}`}</Text>
      </Box>
      <div style={{
        position: 'relative',
        width: '100%',
        height: 0,
        paddingBottom: '41.5%',
      }}
      >
        <iframe
          title={`Trailer for ${movie.title}`}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${trailer || movie.trailer}`}
          frameBorder="none"
          allow="autoplay; fullscreen"
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
    </Box>
  </Layer>
);

WatchModal.propTypes = {
  /**
   * Trailer video id.
   */
  trailer: PropTypes.arrayOf(PropTypes.shape).isRequired,

  /**
   * Used to complement SearchTrailer component with movie title.
   */
  // eslint-disable-next-line react/forbid-prop-types
  movie: PropTypes.object.isRequired,

  /**
   * Used to close modal
   */
  onClose: PropTypes.func.isRequired,
};

class Trailers extends Component {
  state = {
    /** The trailer to add */
    selected: null,

    /** Holds index of trailer to be removed */
    remove: -1,

    /** Holds index of trailer to be watched */
    watch: -1,

    /** Whether the add modal is visible or not */
    isAdding: false,

    /** Whether the watch modal for main trailer is visible or not */
    isWatching: false,
  }

  /**
   * Sends which trailer to add to parent component.
   */
  onAdd = () => {
    const { selected } = this.state;
    const { onAdd } = this.props;
    if (onAdd) {
      onAdd(selected);
    }

    this.setState({ isAdding: false });
  }

  /**
   * Sends which trailer to remove to parent component.
   */
  onRemove = () => {
    const { remove } = this.state;
    const { trailers, onRemove } = this.props;
    if (onRemove) {
      onRemove(trailers[remove], remove);
    }

    this.setState({ remove: -1 });
  }

  onOpen = () => {
    this.setState({ isWatching: true });
  }

  onClose = () => {
    this.setState({ isWatching: false });
  }

  onSelect = (item) => {
    this.setState({ selected: item });
  }

  render() {
    const {
      watch,
      remove,
      isAdding,
      isWatching,
    } = this.state;

    const { movie, trailers } = this.props;

    return (
      <Box
        margin={{ top: 'medium' }}
        align="start"
      >
        <Box
          fill
          align="start"
          border="bottom"
          pad={{ vertical: 'small' }}
        >
          <Button
            icon={<FormAdd color="white" />}
            label={(
              <Text color="white">
                <strong>Add</strong>
              </Text>
            )}
            primary
            color="status-ok"
            onClick={() => this.setState({ isAdding: true })}
          />
        </Box>
        {isAdding && (
          <AddModal
            title="Add Trailer"
            width="large"
            onAdd={this.onAdd}
            onClose={() => this.setState({ isAdding: false })}
          >
            <Box width="100%">
              <SearchTrailer
                query={`${movie.title} trailer`}
                onSelect={this.onSelect}
              />
            </Box>
          </AddModal>
        )}
        <Box margin={{ vertical: 'medium' }}>
          <FormField
            label="Trailer"
            htmlFor="text-input__trailer"
          >
            <TextInput
              id="text-input__trailer"
              placeholder="video id"
              value={movie.trailer}
              name="search"
              disabled
            />
          </FormField>
        </Box>

        {movie.trailer && (
          <Button
            margin={{ horizontal: 'small' }}
            label={(
              <Text>
                <strong>Watch</strong>
              </Text>
            )}
            onClick={this.onOpen}
          />
        )}
        {(movie.trailer && isWatching) ? (
          <WatchModal
            trailer={movie.trailer}
            movie={movie}
            onClose={this.onClose}
          />
        ) : null}
        <Box fill>
          <Heading level="4">Trailers</Heading>
          {_.map(trailers, (t, i) => (
            <Box
              fill
              direction="row"
              key={`movie-trailer-${t}`}
              border="bottom"
              align="center"
              gap="small"
            >
              <Box basis="100%">
                <Text truncate responsive>
                  {t.description}
                </Text>
              </Box>
              <Button
                icon={<View color="icon" />}
                onClick={() => this.setState({ watch: i })}
              />
              <Button
                icon={<Trash color="icon" />}
                onClick={() => this.setState({ remove: i })}
              />
            </Box>
          ))}
        </Box>

        {remove >= 0 && remove < (trailers || []).length ? (
          <DeleteModal
            onDelete={this.onRemove}
            onClose={() => this.setState({ remove: -1 })}
          />
        ) : undefined}

        {watch >= 0 && watch < (trailers || []).length ? (
          <WatchModal
            trailer={trailers[watch].id}
            movie={movie}
            onClose={() => this.setState({ watch: -1 })}
          />
        ) : undefined}
      </Box>
    );
  }
}

Trailers.defaultProps = {
  trailers: [],
};

Trailers.propTypes = {
  /**
   * Used to complement SearchTrailer component with movie title.
   */
  // eslint-disable-next-line react/forbid-prop-types
  movie: PropTypes.object.isRequired,

  /**
   * List of trailers to display.
   */
  trailers: PropTypes.arrayOf(PropTypes.shape),

  /**
   * Used to notify parent component which trailer to add
   */
  onAdd: PropTypes.func.isRequired,

  /**
   * Used to notify parent component which trailer to remove
   */
  onRemove: PropTypes.func.isRequired,
};

export { Trailers };
export { SearchTrailer };
