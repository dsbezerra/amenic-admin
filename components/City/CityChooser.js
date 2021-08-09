import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Box,
  FormField,
  Select,
} from 'grommet';
import { getCitiesFromState } from '../../lib/api/state';

class CityChooser extends Component {
  state = {
    /**
     * List of cities to be displayed.
     */
    cities: [],

    /**
     * The current selected value.
     */
    value: undefined,

    /**
     * Whether is loading or not the data.
     */
    isLoading: false,
  }

  componentDidMount() {
    const { state, defaultState } = this.props;
    if (state || defaultState) {
      this.fetchCities(state || defaultState);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { state } = nextProps;
    if (state) {
      // eslint-disable-next-line react/destructuring-assignment
      if (!_.isEqual(this.props.state, state)) {
        this.onChange(undefined);
        if (state._id) {
          this.fetchCities(state);
        }
      }
    }
  }

  /**
   * Retrieves city list from a data source.
   */
  fetchCities = async (state) => {
    this.setState({ isLoading: true, cities: [] });

    const { _id } = state;
    try {
      const { data } = await getCitiesFromState(_id);
      this.setState({
        cities: [{ name: 'ALL' }, ...data],
      });
    } catch (err) {
      console.log(err);
    }

    this.setState({ isLoading: false });
  }

  /**
   * Sends onChange event to parent component.
   */
  onChange = (value) => {
    const { cities } = this.state;
    this.setState({ value, cities: value === undefined ? [] : cities });

    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(value);
    }
  }

  shouldRenderValue = () => {
    const { isLoading, value } = this.state;
    const { state, defaultState, defaultValue } = this.props;
    if (isLoading) {
      return false;
    }

    if (value) {
      return true;
    }

    if (!state && defaultState && defaultValue) {
      return true;
    }

    return false;
  }

  render() {
    const {
      cities,
      value,
      isLoading,
    } = this.state;

    const { state, defaultState, defaultValue } = this.props;

    return (
      <FormField
        label="City"
      >
        <Select
          // eslint-disable-next-line no-nested-ternary
          placeholder={isLoading ? (
            'Loading cities...')
            : (state && state._id ? 'Select City' : 'Select a State First...')}
          value={
            this.shouldRenderValue() ? (
              <Box
                pad="small"
                direction="row"
                align="start"
                gap="small"
              >
                {(state || defaultState) && <strong>{(state || defaultState).federativeUnit}</strong>}
                {(value || defaultValue).name}
              </Box>
            ) : undefined
          }
          options={cities}
          onChange={event => this.onChange(event.value)}
        >
          {(option, index, options, selectState) => (
            <Box
              pad="small"
              direction="row"
              align="start"
              gap="small"
              background={selectState.active ? 'active' : undefined}
            >
              {option.name}
            </Box>
          )}
        </Select>
      </FormField>
    );
  }
}

CityChooser.defaultProps = {
  onSelect: undefined,
};

CityChooser.propTypes = {
  /**
   * Load cities from a specific state.
   */
  state: PropTypes.objectOf({
    _id: PropTypes.string,
    name: PropTypes.string,
    federativeUnit: PropTypes.string,
  }).isRequired,

  /**
   * Used to notify parent component of selected city.
   */
  onSelect: PropTypes.func,
};

export { CityChooser };
