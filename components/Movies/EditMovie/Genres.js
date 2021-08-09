import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  FormAdd,
  Sort,
  Trash,
} from 'grommet-icons';
import {
  Box,
  Button,
  Heading,
  Text,
  TextInput,
} from 'grommet';

import { AddModal, DeleteModal } from '../../Modal';

class Genres extends Component {
  state = {
    /** Genre to add */
    value: null,

    /** Holds index of genre to be removed */
    remove: -1,

    /** Whether the add modal is visible or not */
    isAdding: false,
  }

  /**
   * Sends which genre to add to parent component.
   */
  onAdd = () => {
    const { value } = this.state;
    const { onAdd } = this.props;
    if (onAdd) {
      onAdd(value);
    }

    this.setState({ isAdding: false });
  }

  /**
   * Sends which genre to remove to parent component.
   */
  onRemove = () => {
    const { remove } = this.state;
    const { genres, onRemove } = this.props;
    if (onRemove) {
      onRemove(genres[remove], remove);
    }

    this.setState({ remove: -1 });
  }

  render() {
    const {
      value,
      remove,
      isAdding,
    } = this.state;

    const { genres, suggestions } = this.props;

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
            title="Add Genre"
            onAdd={this.onAdd}
            onClose={() => this.setState({ isAdding: false })}
          >
            <Box width="100%">
              <TextInput
                id="text-input__genre"
                placeholder="Ação, Aventura, Comédia..."
                value={value}
                suggestions={suggestions}
                onChange={({ target }) => this.setState({ value: target.value.trim() })}
                onSelect={({ suggestion }) => this.setState({ value: suggestion })}
              />
            </Box>
          </AddModal>
        )}

        <Box fill>
          <Heading level="4">Genres</Heading>
          {_.map(genres, (g, i) => (
            <Box
              fill
              direction="row"
              key={`movie-genre-${g}`}
              border="bottom"
              align="center"
            >
              <Box basis="100%">
                <Text truncate responsive>
                  {g}
                </Text>
              </Box>
              <Button
                icon={<Trash color="icon" />}
                margin={{ horizontal: 'small' }}
                onClick={() => this.setState({ remove: i })}
              />
            </Box>
          ))}
        </Box>

        {remove >= 0 && remove < (genres || []).length ? (
          <DeleteModal
            onDelete={this.onRemove}
            onClose={() => this.setState({ remove: -1 })}
          />
        ) : undefined}
      </Box>
    );
  }
}

Genres.defaultProps = {
  suggestions: [],
};

Genres.propTypes = {
  /**
   * Genres data
   */
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,

  /**
   * A list of suggested genres
   */
  suggestions: PropTypes.arrayOf(PropTypes.string),

  /**
   * Used to notify parent component which genre to add
   */
  onAdd: PropTypes.func.isRequired,

  /**
   * Used to notify parent component which genre to remove
   */
  onRemove: PropTypes.func.isRequired,
};

export { Genres };
