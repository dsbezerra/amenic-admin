import React, { Component } from 'react';
import Router from 'next/router';
import _ from 'lodash';
import * as Icon from 'grommet-icons';
import {
  Box,
  Button,
  Collapsible,
  Text,
} from 'grommet';

const parseField = (f) => {
  if (f.startsWith('-')) {
    return -1;
  }

  return 1;
};

const getSortFromProps = (props) => {
  const sort = {};
  const { query } = props;
  if (query && query.sort) {
    const fields = _.split(query.sort, ',');
    _.forEach(fields, (f) => {
      sort[f] = parseField(f);
    });
  }
  return sort;
}

class Sort extends Component {
  state = {
    sort: getSortFromProps(this.props),
    isOpen: false,
  }

  onApply = () => {
    const { sort } = this.state;
    const { pathname, query } = Router;

    let href = `${pathname}?`;
    if (query && query.search) {
      href += `search=${query.search}`;
    }

    const keys = Object.keys(sort);
    const size = keys.length;
    if (size === 0) {
      Router.push(href, href);
      return;
    }

    href += '&sort=';
    keys.forEach((k, i) => {
      const sign = sort[k] < 0 ? '-' : '';
      href += `${sign}${k}`;

      if (i < size - 1) {
        href += ',';
      }
    });

    Router.push(href, href);
  }

  onClear = () => {
    this.setState({ sort: {} });
  }

  onSelect = ({ value }) => {
    const { sort } = this.state;

    let newSort = { ...sort };

    const order = sort[value];
    if (order) {
      if (order === 1) {
        newSort = _.set(newSort, value, -1);
      } else if (order === -1) {
        newSort = _.omit(newSort, value);
      }
    } else {
      newSort = _.set(newSort, value, 1);
    }

    this.setState({
      sort: newSort,
    });
  }

  render() {
    const { sort, isOpen } = this.state;
    const { options } = this.props;
    const isActive = !_.isEmpty(sort);
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
            <Icon.Sort
              color={!isActive ? 'icon' : 'neutral-4'}
            />
            <Text color={!isActive ? '' : 'neutral-4'}>Sort</Text>
          </Box>
        </Button>

        <Collapsible
          direction="vertical"
          open={isOpen}
        >
          <Box>
            <Box direction="row" gap="xsmall" wrap>
              {_.map(options, opt => (
                <Button
                  key={`sort-${opt.value}`}
                  onClick={() => this.onSelect(opt)}
                  plain
                >
                  <Box
                    pad={{ vertical: 'xsmall', horizontal: 'small' }}
                    background={sort[opt.value] ? 'neutral-4' : ''}
                    direction="row"
                    align="center"
                    gap="small"
                    border
                    round
                  >
                    {(sort[opt.value] && sort[opt.value] === -1)
                      ? (
                        <Icon.Up
                          size="small"
                          color={sort[opt.value] ? 'white' : 'icon'}
                        />
                      ) : (
                        <Icon.Down
                          size="small"
                          color={sort[opt.value] ? 'white' : 'icon'}
                        />
                      )}
                    <Text
                      size="small"
                      color={sort[opt.value] ? 'white' : ''}
                    >
                      {opt.name}
                    </Text>
                  </Box>
                </Button>
              ))}
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

export { Sort };
