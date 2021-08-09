import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import _ from 'lodash';
import {
  Box,
  Button,
  FormField,
  Heading,
  ResponsiveContext,
  Select,
  Text,
  TextInput,
} from 'grommet';

import { PaginatedContent } from '../../components';

import { capitalize } from '../../utils/string';
import { formatISOString } from '../../utils/time';

import { app, TabApiKeys } from '.';
import { APIKEY, insert, getList } from '../../lib/api';
import buildQueryString from '../../lib/api/buildQueryString';
import { defaultPaginationQuery, getPagination } from '../../utils/pagination';

const InfoItem = ({ label, value }) => (
  <Box direction="row" gap="small">
    <Text size="small"><strong>{label}</strong></Text>
    <Text size="small">{value}</Text>
  </Box>
);

InfoItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

InfoItem.defaultProps = {
  label: '',
  value: '',
};

const getFormattedDate = (date) => {
  let result = 'Data inválida';
  try {
    result = formatISOString(date);
  } catch (err) {
    console.error(err);
  }
  return result;
};

class ApiKeys extends Component {
  state = {
    name: '',
    type: '',
    errors: {
      name: null,
      type: null,
    },
  }

  static async getInitialProps({ req, query }) {
    const headers = {};
    if (req && req.headers && req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    const {
      apikeys,
      totalCount,
      pages,
    } = await getList(APIKEY, { ...defaultPaginationQuery, ...query }, { headers });

    return {
      apikeys,
      pagination: getPagination(query, pages, {
        from: 'apikeys', to: 'app/apikeys',
      }),
      totalCount,
    };
  }

  onChange = (field, value) => {
    const { errors } = this.state;
    this.setState({
      [field]: value,
      errors: {
        ...errors,
        [field]: '',
      },
    });
  }

  onSave = async () => {
    const { name, type, errors } = this.state;

    const invalid = {};
    if (!name) {
      invalid.name = 'field is required';
    }

    if (!type) {
      invalid.type = 'field is required';
    }

    if (_.isEmpty(invalid)) {
      try {
        const { success } = await insert(APIKEY, { name, user_type: type });
        if (success) {
          this.setState({
            name: '',
            type: '',
            errors: {
              name: null,
              type: null,
            },
          });
        }

        const { router } = this.props;
        let path = router.pathname;
        if (!_.isEmpty(router.query)) {
          path += `?${buildQueryString(router.query)}`;
        }
        Router.replace(path);
      } catch (err) {
        console.log(err);
      }
    } else {
      this.setState({
        errors: {
          ...errors,
          name: invalid.name,
          type: invalid.type,
        },
      });
    }
  }

  render() {
    const { name, type, errors } = this.state;
    const {
      apikeys,
      totalCount,
      pagination,
    } = this.props;
    return (
      <ResponsiveContext.Consumer>
        {() => (
          <Box>
            <Box pad="medium">
              <Heading level="3" margin="none">
                New API Key
              </Heading>

              <Box margin={{ top: 'medium' }}>
                <FormField
                  label="Name (must be unique)"
                  help="Used as ID to know which application is using this API Key"
                  htmlFor="text-input__name"
                  error={errors.name}
                >
                  <TextInput
                    id="text-input__name"
                    value={name}
                    onChange={event => this.onChange('name', event.target.value)}
                  />
                </FormField>

                <FormField
                  label="User Type"
                  help="Whether it is a client or admin key"
                  htmlFor="text-input__type"
                  error={errors.type}
                >
                  <Select
                    placeholder="Select one User Type"
                    value={
                      type ? (
                        <Box
                          pad="9px"
                          direction="row"
                          align="start"
                          gap="small"
                          style={{ width: '208px' }}
                        >
                          <Text size="small">{capitalize(type)}</Text>
                        </Box>
                      ) : undefined
                    }
                    options={['client', 'admin']}
                    onChange={event => this.onChange('type', event.value)}
                  >
                    {(option, index, options, state) => (
                      <Box
                        pad="small"
                        direction="row"
                        align="start"
                        gap="small"
                        background={state.active ? 'active' : undefined}
                      >
                        <Text size="small">{capitalize(option)}</Text>
                      </Box>
                    )}
                  </Select>
                </FormField>
              </Box>

              <Box align="start">
                <Button
                  label={(
                    <Text color="white">
                      <strong>Save</strong>
                    </Text>
                  )}
                  primary
                  color="status-ok"
                  margin={{ vertical: 'medium' }}
                  onClick={this.onSave}
                />
              </Box>
            </Box>

            <Box fill border="top" />

            <Box pad="medium">
              <Heading level="3" margin="none">
                Keys
              </Heading>
              {totalCount === 0 && (
                <Text>No keys found.</Text>
              )}
              {totalCount > 0 && (
                <PaginatedContent {...pagination} totalCount={totalCount}>
                  {_.map(apikeys, k => (
                    <Box
                      key={k._id}
                      border={totalCount !== 1 && 'bottom'}
                      pad={{ vertical: 'medium' }}
                    >
                      <InfoItem label="Key" value={k.key} />
                      <InfoItem label="Name" value={k.name} />
                      <InfoItem label="Owner" value={k.owner} />
                      <InfoItem label="User Type" value={k.user_type} />
                      <InfoItem label="Issued At" value={getFormattedDate(k.iat)} />
                    </Box>
                  ))}
                </PaginatedContent>
              )}
            </Box>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}

export default app(ApiKeys, TabApiKeys);
