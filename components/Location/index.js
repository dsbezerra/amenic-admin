import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
} from 'grommet';
import {
  CityChooser,
  StateChooser,
} from '..';

class LocationChooser extends Component {
  state = {
    /** Holds the selected state used to fetch cities */
    state: undefined,
  }

  onCityChange = (city) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange('city', city);
    }
  }

  onStateChange = (state) => {
    this.setState({ state });

    const { onChange } = this.props;
    if (onChange) {
      onChange('state', state);
    }
  }

  render() {
    const { state } = this.state;
    const { defaultState, defaultCity } = this.props;
    return (
      <Box
        align="start"
        direction="row-responsive"
        {...this.props}
      >
        <StateChooser
          defaultValue={defaultState}
          onSelect={this.onStateChange}
        />
        <CityChooser
          state={state}
          defaultValue={defaultCity}
          defaultState={defaultState}
          onSelect={this.onCityChange}
        />
      </Box>
    );
  }
}

LocationChooser.defaultProps = {
  onChange: undefined,
};

LocationChooser.propTypes = {
  /**
   * Used to notify parent component of selected location.
   */
  onChange: PropTypes.func,
};

export { LocationChooser };
