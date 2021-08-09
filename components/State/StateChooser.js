import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  FormField,
  Select,
} from 'grommet';
import { getStateList } from '../../lib/api/state';

function StateChooser(props) {
  const [states, setStates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(undefined);

  const { defaultValue, onSelect } = props;

  // Load states
  async function loadStates() {
    setIsLoading(true);
    try {
      const { data } = await getStateList();
      setStates([{ _id: 'ALL' }, ...data]);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }

  useEffect(() => { loadStates(); }, []);

  function handleSelectedChanged(e) {
    setSelected(e.value);
    if (onSelect) {
      onSelect(e.value);
    }
  }

  return (
    <FormField label="State">
      <Select
        placeholder={isLoading ? 'Loading states...' : 'Select State'}
        value={
          (selected || defaultValue) ? (
            <Box
              pad="small"
              direction="row"
              align="start"
              gap="small"
            >
              <strong>{(selected || defaultValue)._id}</strong>
              {(selected || defaultValue).name}
            </Box>
          ) : undefined
        }
        options={states}
        onChange={handleSelectedChanged}
      >
        {(option, state) => (
          <Box
            pad="small"
            direction="row"
            align="start"
            gap="small"
            background={state.active ? 'active' : undefined}
          >
            <strong>{option._id}</strong>
            {option.name}
          </Box>
        )}
      </Select>
    </FormField>
  );
}

StateChooser.defaultProps = {
  defaultValue: undefined,
  onSelect: undefined,
};

StateChooser.propTypes = {
  defaultValue: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),

  /**
   * Used to notify parent component of selected state.
   */
  onSelect: PropTypes.func,
};

export { StateChooser };
