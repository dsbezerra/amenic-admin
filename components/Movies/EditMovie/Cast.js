import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormAdd, Trash } from 'grommet-icons';
import {
  Box,
  Button,
  Heading,
  Text,
  TextInput,
} from 'grommet';

import { AddModal, DeleteModal } from '../../Modal';

class Cast extends Component {
  state = {
    /** Cast member name to add */
    value: null,

    /** Holds index of cast member to be removed */
    remove: -1,

    /** Whether the add modal is visible or not */
    isAdding: false,
  }

  /**
   * Sends which member to add to parent component.
   */
  onAddMember = () => {
    const { value } = this.state;
    const { onAdd } = this.props;
    if (onAdd) {
      onAdd(value);
    }

    this.setState({ isAdding: false });
  }

  /**
  * Sends which member to remove to parent component.
  */
  onRemoveMember = () => {
    const { remove } = this.state;
    const { cast, onRemove } = this.props;
    if (onRemove) {
      onRemove(cast[remove], remove);
    }

    this.setState({ remove: -1 });
  }

  render() {
    const {
      value,
      remove,
      isAdding,
    } = this.state;

    const { cast } = this.props;

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
            title="Add Member"
            onAdd={this.onAddMember}
            onClose={() => this.setState({ isAdding: false })}
          >
            <Box width="100%">
              <TextInput
                id="text-input__cast-member"
                placeholder="Name"
                value={value}
                onChange={({ target }) => this.setState({ value: target.value.trim() })}
              />
            </Box>
          </AddModal>
        )}
        <Box fill>
          <Heading level="4">Cast</Heading>
          {_.map(cast, (m, i) => (
            <Box
              fill
              direction="row"
              key={`cast-member-${i}`}
              border="bottom"
              align="center"
            >
              <Box basis="100%">
                <Text truncate responsive>
                  {m}
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
        {remove >= 0 && remove < (cast || []).length ? (
          <DeleteModal
            onDelete={this.onRemoveMember}
            onClose={() => this.setState({ remove: -1 })}
          />
        ) : undefined}
      </Box>
    );
  }
}

Cast.propTypes = {
  /**
   * Cast data
   */
  cast: PropTypes.arrayOf(PropTypes.string).isRequired,

  /**
   * Used to notify parent component which cast member to add
   */
  onAdd: PropTypes.func.isRequired,

  /**
   * Used to notify parent component which cast member to remove
   */
  onRemove: PropTypes.func.isRequired,
};

export { Cast };
