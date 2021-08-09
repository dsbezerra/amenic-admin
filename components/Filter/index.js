import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import _ from 'lodash';
import * as Icon from 'grommet-icons';
import {
  Box,
  Button,
  Collapsible,
  Text,
} from 'grommet';

const handleBooleanValue = (value) => {
  let v = value;

  if (v === 'true' || v === '1') {
    v = true;
  } else if (v === 'false' || v === '0') {
    v = false;
  }

  return v;
};

const getFilterFromProps = (props) => {
  const filter = {};
  const { query, fields } = props;
  if (query) {
    Object.keys(query).forEach((k) => {
      if (fields.includes(k)) {
        const { [k]: item } = props;
        let v = item || query[k];
        v = handleBooleanValue(v);
        if (_.has(item, '_id')) {
          v = item._id;
        }
        filter[k] = v;
      }
    });
  }
  return filter;
};

class Filter extends Component {
  state = {
    filter: getFilterFromProps(this.props),
    isOpen: false,
  }

  onChange = (field, value) => {
    const { filter } = this.state;
    let v = value;
    if (typeof v === 'object'
      && !v._id) {
      v = undefined;
    }

    let newFilter = { ...filter };
    if (!v) {
      if (typeof v === 'boolean') {
        newFilter = _.set(newFilter, field, v);
      } else {
        newFilter = _.omit(newFilter, field, v);
      }
    } else {
      newFilter = _.set(newFilter, field, v);
    }

    this.setState({
      filter: newFilter,
    });
  }

  onApply = () => {
    const { filter } = this.state;
    const { pathname, query } = Router;

    let href = `${pathname}?`;
    if (query && query.search) {
      href += `search=${query.search}`;
    }
    Object.keys(filter).forEach((k) => {
      let queryValue = '';

      const value = filter[k];
      if (_.has(value, '_id')) {
        queryValue = value._id;
      } else {
        queryValue = value;
      }

      href += `&${k}=${queryValue}`;
    });

    Router.push(href, href);
  }

  onClear = () => {
    const { pathname, query } = Router;

    let href = `${pathname}?`;
    if (query && query.search) {
      href += `search=${query.search}`;
    }
    Router.push(href, href);

    this.setState({ filter: {} });
  }

  render() {
    const { filter, isOpen } = this.state;
    const { children } = this.props;
    const isActive = !_.isEmpty(filter);
    return (
      <Box align="start">
        <Button
          plain
          onClick={() => this.setState({ isOpen: !isOpen })}
        >
          <Box
            gap="small"
            align="start"
            direction="row"
            margin={{ vertical: 'medium' }}
          >
            <Icon.Filter
              color={!isActive ? 'icon' : 'neutral-4'}
            />
            <Text color={!isActive ? '' : 'neutral-4'}>Filter</Text>
          </Box>
        </Button>

        <Collapsible
          direction="vertical"
          open={isOpen}
        >
          <Box>
            <Box align="start" pag={{ vertical: 'medium' }}>
              {children({ ...this.props, ...this.state, onChange: this.onChange })}
            </Box>

            {isOpen && (
              <Box
                align="start"
                pad={{ vertical: 'medium' }}
                direction="row"
                gap="small"
              >
                <Button
                  label="Apply"
                  onClick={this.onApply}
                />
                <Button
                  label="Clear"
                  onClick={this.onClear}
                />
              </Box>
            )}
          </Box>
        </Collapsible>
      </Box>
    );
  }
}

Filter.defaultProps = {
  query: {},
  fields: [],
  children: [],
};

Filter.propTypes = {
  query: PropTypes.objectOf(PropTypes.any),
  /**
   * Fields is used to correctly detect filter fields in query.
   * Added to avoid adding fields like sort, page, per_page, limit, etc
   * as filter properties.
   *
   * TODO: Refactor to work like Sort component where the sorted fields are in
   * the sort query.
   */
  fields: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export { Filter };
