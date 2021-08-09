import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import {
  Edit,
} from 'grommet-icons';
import {
  Box,
  Button,
  CheckBox,
  FormField,
  Image,
  Text,
  TextInput,
  ResponsiveContext,
} from 'grommet';
import {
  Layout,
  LocationChooser,
} from '../../components';

import {
  THEATER,
  getTheaterById,
  update,
} from '../../lib/api';

import withEditable from '../../lib/withEditable';
import withEverything from '../../lib/withEverything';

const ImageEdit = styled(Box)`
  position: relative;

  ::after {
    position: absolute;
    width: 100%;
    height: 100%;
    content: ' ';
    top: 0;
    left: 0;
    pointer-events: none;
  }

  :hover {
    ::after {
      background-color: rgba(0, 0, 0, 0.2);
      z-index: 1;
    }

    cursor: pointer;

    .edit-icon {
      opacity: 1;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .edit-icon {
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, -100%);
    opacity: 0;
    transition: all 400ms ease;
    z-index: 99;
  }
`;

const EditableImage = ({ src }) => (
  <ResponsiveContext.Consumer>
    {size => (
      <ImageEdit
        pad="medium"
        border
      >
        <Image
          src={src}
          style={{ maxWidth: '100%' }}
        />

        <Edit
          color="white"
          className="edit-icon"
          size={size !== 'small' ? 'large' : 'medium'}
        />
      </ImageEdit>
    )}
  </ResponsiveContext.Consumer>
);

EditableImage.propTypes = {
  src: PropTypes.string.isRequired,
};

EditableImage.defaultPropTypes = {
  src: '',
};

class EditTheater extends Component {
  state = {
    cities: {},
    states: {},
    isEditingLocation: false,
  }

  static async getInitialProps({ query }) {
    const { data } = await getTheaterById(query.id, {
      include: [{ field: 'city' }],
    });
    return { theater: data };
  }

  onUpdateTheater = (field, value) => {
    const { onUpdate } = this.props;
    if (onUpdate) {
      onUpdate(field, value);
    }
  }

  onLocationChange = (field, value) => {
    const { location, cities, states } = this.state;

    this.setState({
      location: {
        ...location,
        [field]: value,
      },
    });

    if (field === 'state') {
      this.setState({
        states: {
          ...states,
          [value._id]: value,
        },
      });
    }

    if (field === 'city' && value) {
      this.onUpdateTheater('cityId', value._id);
      this.setState({
        isEditingLocation: false,
        cities: {
          ...cities,
          [value._id]: value,
        },
      });
    }
  }

  render() {
    const {
      theater,
      editBar,
    } = this.props;

    const {
      cities,
      isEditingLocation,
    } = this.state;

    // eslint-disable-next-line react/destructuring-assignment
    const city = cities[theater.cityId] || this.props.theater.city;
    return (
      <Layout title="Theaters" {...this.props}>
        <Box
          animation={[
            { type: 'slideUp', duration: 500 },
            { type: 'fadeIn', duration: 500 },
          ]}
        >
          {editBar}
          <Box
            fill
            align="start"
            pad="medium"
          >
            <Box
              fill
              direction="row-responsive"
              align="center"
              gap="medium"
            >
              <Box
                basis="20%"
                direction="row"
                justify="center"
              >
                <EditableImage
                  src={theater.images.icon}
                  border="none"
                  round
                />
              </Box>

              <Box fill>
                <Box margin="small">
                  <CheckBox
                    id="checkbox__hidden"
                    label="Hidden"
                    checked={theater.hidden}
                    onChange={() => this.onUpdateTheater('hidden', !theater.hidden)}
                  />
                </Box>
                <FormField
                  label="Name"
                  htmlFor="text-input__name"
                >
                  <TextInput
                    id="text-input__name"
                    value={theater.name}
                    onChange={event => this.onUpdateTheater('name', event.value)}
                  />
                </FormField>

                <FormField
                  label="Short Name"
                  htmlFor="text-input__shortName"
                >
                  <TextInput
                    id="text-input__shortName"
                    value={theater.shortName}
                    onChange={event => this.onUpdateTheater('shortName', event.shortName)}
                  />
                </FormField>
                {(!theater.cityId || isEditingLocation) ? (
                  <Box gap="small" direction="row-responsive">
                    <LocationChooser
                      onChange={this.onLocationChange}
                    />
                    {isEditingLocation && (
                      <Button
                        label="Cancel"
                        alignSelf="center"
                        onClick={() => this.setState({ isEditingLocation: false })}
                        plain
                      />
                    )}
                  </Box>
                ) : (
                  <FormField
                    label="City"
                  >
                    {!_.isEmpty(city) && (
                      <Box direction="row" pad="small" gap="small">
                        <Box direction="row" gap="small" align="center">
                          <Text>{city.name}</Text>
                        </Box>
                        <Button
                          label="Edit"
                          onClick={() => this.setState({ isEditingLocation: true })}
                          plain
                        />
                      </Box>
                    )}
                  </FormField>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Layout>
    );
  }
}

const EditableTheater = withEditable(EditTheater, {
  title: 'Edit Theater',
  dataProp: 'theater',
  bgProp: 'images.backdrop',
  model: THEATER,
  saveFn: update,
});
export default withEverything(EditableTheater, { adminRequired: true });
