import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import * as Icon from 'grommet-icons';
import {
  Box,
  Button,
  Heading,
  TextInput,
} from 'grommet';

class Search extends Component {
  state = {
    search: '',
  }

  onSearch = () => {
    const { search } = this.state;
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch(search);
      return;
    }

    const { pathname, query } = Router;
    if (!search) {
      Router.push(pathname, pathname);
      return;
    }

    delete query.search;

    let href = `${pathname}?search=${search.replace(/ /g, '+').toLowerCase()}`;
    Object.keys(query).forEach((k) => {
      href += `&${k}=${query[k]}`;
    });

    Router.push(href, href);
  }

  render() {
    const { search } = this.state;
    const { query, placeholder } = this.props;
    return (
      <Box>
        <Heading level="4" margin={{ vertical: 'small' }}>
          Search
        </Heading>
        <Box direction="row" align="center" border>
          <TextInput
            id="search-text-input"
            placeholder={placeholder}
            size="medium"
            value={search}
            onKeyPress={(event) => {
              if (event && event.key === 'Enter') {
                this.onSearch();
              }
            }}
            onChange={event => this.setState({ search: event.target.value })}
            plain
          />
          <Button
            icon={<Icon.Search color="icon" />}
            onClick={this.onSearch}
            hoverIndicator
          />
        </Box>
        {query && query.search && (
          <Heading level="4">
            {`Search results for '${query.search}'`}
          </Heading>)}
      </Box>
    );
  }
}

Search.defaultProps = {
  onSearch: null,
};

Search.propTypes = {
  /**
   * Can be used to implement custom searches that doesn't need
   * to control Router.
   */
  onSearch: PropTypes.func,
};

export { Search };
