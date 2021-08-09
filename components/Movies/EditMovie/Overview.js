import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  CheckBox,
  FormField,
  Image,
  Select,
  Text,
  TextInput,
} from 'grommet';
import { ResizableTextArea } from '../../UI';

/** Brazilian Ratings */
const RATINGS = [-1, 10, 12, 14, 16, 18];

class Overview extends Component {
  /**
   * Send to parent component a custom onChange event for each
   * modified field
   */
  onChange = (field, value) => {
    const { onChange } = this.props;
    if (onChange) { onChange(field, value); }
  }

  /**
   * Get the rating icon
   */
  getRatingIcon = (value) => {
    switch (value) {
      case -1:
        return '/static/img/rating_L_16px.png';
      default:
        return `/static/img/rating_${value}_16px.png`;
    }
  }

  /**
   * Gets the rating label
   */
  getRatingLabel = (value) => {
    switch (value) {
      case -1:
        return 'Livre';
      default:
        return `${value} anos`;
    }
  }

  render() {
    // TODO:
    // Consider getting object keys and render for
    // with map function.
    const { movie } = this.props;
    return (
      <Box margin={{ top: 'medium' }}>
        <Box basis="50%" pad="small" gap="small">
          <CheckBox
            id="text-input__hidden"
            label="Hidden"
            checked={movie.hidden}
            onChange={() => this.onChange('hidden', !movie.hidden)}
          />
        </Box>
        <Box
          direction="row-responsive"
          margin={{ bottom: 'medium' }}
        >
          <Box basis="50%">
            <FormField
              label="ID"
              htmlFor="text-input__id"
            >
              <TextInput
                id="text-input__id"
                value={movie._id}
                style={{ opacity: '0.5' }}
                disabled
              />
            </FormField>
          </Box>

          <Box basis="50%">
            <FormField
              label="Slug"
              htmlFor="text-input__slug"
            >
              <TextInput
                id="text-input__slug"
                value={movie.slug}
                style={{ opacity: '0.5' }}
                disabled
              />
            </FormField>
          </Box>

          <Box direction="row">
            <FormField
              label="IMDb ID"
              htmlFor="text-input__imdbId"
            >
              <TextInput
                id="text-input__imdbId"
                value={movie.imdbId}
                style={{ opacity: '0.5' }}
                disabled
              />
            </FormField>

            <FormField
              label="TMDb ID"
              htmlFor="text-input__tmdbId"
            >
              <TextInput
                id="text-input__tmdbId"
                value={`${movie.tmdbId}`}
                onChange={event => this.onChange('tmdbId', parseInt(event.target.value, 10))}
              />
            </FormField>
          </Box>
        </Box>

        <Box direction="row-responsive">
          <Box basis="50%">
            <FormField
              label="Original Title"
              htmlFor="text-input__original-title"
            >
              <TextInput
                id="text-input__original-title"
                value={movie.originalTitle}
                onChange={event => this.onChange('originalTitle', event.target.value)}
              />
            </FormField>
          </Box>

          <Box basis="50%">
            <FormField
              label="Title"
              htmlFor="text-input__title"
            >
              <TextInput
                id="text-input__title"
                value={movie.title}
                onChange={event => this.onChange('title', event.target.value)}
              />
            </FormField>
          </Box>

          <Box direction="row">
            <FormField
              label="Runtime"
              htmlFor="text-input__runtime"
            >
              <TextInput
                id="text-input__runtime"
                type="number"
                value={`${movie.runtime}`}
                onChange={event => this.onChange('runtime', parseInt(event.target.value, 10))}
              />
            </FormField>

            <FormField
              label="Distributor"
              htmlFor="text-input__distributor"
            >
              <TextInput
                id="text-input__distributor"
                value={movie.studio}
                onChange={event => this.onChange('studio', event.target.value)}
              />
            </FormField>
          </Box>

          <FormField
            label="Rating"
            htmlFor="text-input__rating"
          >
            <Select
              placeholder="Select Rating"
              value={
                movie.rating ? (
                  <Box
                    pad="9px"
                    direction="row"
                    align="start"
                    gap="small"
                    style={{ width: '208px' }}
                  >
                    <Image
                      src={this.getRatingIcon(movie.rating)}
                    />
                    {this.getRatingLabel(movie.rating)}
                  </Box>
                ) : undefined
              }
              options={RATINGS}
              onChange={event => this.onChange('rating', event.value)}
            >
              {(option, index, options, state) => (
                <Box
                  pad="small"
                  direction="row"
                  align="start"
                  gap="small"
                  background={state.active ? 'active' : undefined}
                >
                  <Image
                    src={this.getRatingIcon(option)}
                  />
                  {this.getRatingLabel(option)}
                </Box>
              )}
            </Select>
          </FormField>
        </Box>

        <FormField
          label="Synopsis"
          htmlFor="text-input__synopsis"
        >
          <ResizableTextArea
            id="text-input__synopsis"
            value={movie.synopsis}
            onChange={event => this.onChange('synopsis', event.target.value)}
          />
        </FormField>

        <Box>
          <Text size="xsmall">
            Created at:
            <strong>{` ${new Date(movie.createdAt).toLocaleString()}`}</strong>
          </Text>
          <Text size="xsmall">
            Updated at:
            <strong>{` ${new Date(movie.updatedAt).toLocaleString()}`}</strong>
          </Text>
        </Box>
      </Box>
    );
  }
}

Overview.propTypes = {
  /**
   * Origin of Overview data.
   */
  movie: PropTypes.shape.isRequired,

  /**
   * Used to notify parent component of changes
   */
  onChange: PropTypes.func.isRequired,
};

export { Overview };
