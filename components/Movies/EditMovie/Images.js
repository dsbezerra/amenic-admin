import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import filesize from 'filesize';
import Router from 'next/router';
import _ from 'lodash';
import {
  CheckboxSelected,
  FormAdd,
  Trash,
  View,
} from 'grommet-icons';
import {
  Box,
  Button,
  CheckBox,
  FormField,
  Image,
  ResponsiveContext,
  Tab,
  Tabs,
  Text,
  TextInput,
} from 'grommet';
import { AddModal, DeleteModal, Spinner } from '../..';

import { addMovieImage } from '../../../lib/api/movie';
import { setAsMain, deleteImage } from '../../../lib/api/image';
import { CenterModal } from '../../Modal';

/** Tab constants */
const TabBackdrops = 'backdrop';
const TabPosters = 'poster';

/** Tab list */
const TabItems = [TabBackdrops, TabPosters];

const StyledDropArea = styled.div`
// Some styling here
`;

class Images extends Component {
  /**
   * Component state.
   */
  state = {
    /** Which tab is currently active */
    active: 0,

    /** Whether the image should be marked as default or not */
    checked: true,

    /** Holds the id of the image to be deleted */
    remove: null,

    /** Holds the id of the image to be marked as primary */
    primary: null,

    /** Holds upload information (only if when source is URI)  */
    upload: {
      file: null,
      uri: '',
    },

    /** Whether the add modal is visible or not */
    isAdding: false,

    /** Whether the delete modal is visible or not */
    isDeleting: false,

    /** Whether the preview modal is visible or not */
    isPreviewing: false,

    /** Whether the set as primary confirmation modal is visible or not */
    isPrimarying: false,

    /** Whether we are uploading or not */
    isUploading: false,
  }

  /**
   * Helper to set object property value.
   */
  set = (prop, value) => this.setState({ [prop]: value });

  /**
   * Gets tab title for given tab.
   */
  getTabTitle = (tab) => {
    switch (tab) {
      case TabBackdrops: return 'Backdrops';
      case TabPosters: return 'Posters';
      default: return null;
    }
  }

  /**
   * Gets tab title from index.
   */
  getTabTitleFromIndex = index => this.getTabTitle(TabItems[index])

  /**
   * Gets image type name.
   */
  getImageType = (tab) => {
    switch (tab) {
      case TabBackdrops: return 'Backdrop';
      case TabPosters: return 'Poster';
      default: return null;
    }
  }

  /**
   * Gets image type name from index.
   */
  getImageTypeFromIndex = index => this.getImageType(TabItems[index])

  onAdd = async () => {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.isUploading) {
      return;
    }

    this.setState({ isUploading: true });

    const { active, checked, upload } = this.state;
    const type = (this.getImageTypeFromIndex(active) || '').toLowerCase();
    if (!type) {
      return;
    }

    try {
      let data = {};
      if (!_.isEmpty(upload.uri)) {
        data.uri = upload.uri;
        data.type = type;
        data.default = checked;
      } else if (this.input.files) {
        const file = this.input.files[0];
        if (file) {
          data = new FormData();
          data.append('default', checked);
          data.append('type', type);
          data.append('file', file);
        } else {
          throw new Error('Missing file.');
        }
      } else {
        throw new Error('Missing file or URL.');
      }

      const { movie } = this.props;
      await addMovieImage(movie, data);
    } catch (err) {
      console.log(err.message);
    }

    Router.replace(Router.asPath);
    this.setState({ isUploading: false, isAdding: false });
  }

  onSetPrimary = async () => {
    const { primary } = this.state;
    if (primary) {
      try {
        await setAsMain(primary);

        Router.replace(Router.asPath);
      } catch (err) {
        console.log(err);
      }
    }

    this.setState({ primary: null, isPrimarying: false });
  }

  onDelete = async () => {
    const { remove } = this.state;
    if (remove) {
      try {
        await deleteImage(remove);

        Router.replace(Router.asPath);
      } catch (err) {
        console.log(err);
      }
    }

    this.setState({ remove: null, isDeleting: false });
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles && acceptedFiles.length === 1) {
      const { name, size } = acceptedFiles[0];
      this.setState({
        upload: {
          uri: '',
          file: { name, size },
        },
      });
    } else {
      const { upload } = this.state;
      this.setState({
        upload: {
          ...upload,
          file: null,
        },
      });
    }
  }

  /**
   * Render function.
   */
  render() {
    const {
      active,
      checked,
      upload,
      isAdding,
      isDeleting,
      isPreviewing,
      isPrimarying,
      isUploading,
    } = this.state;
    const { images } = this.props;

    const width = (active) => {
      if (TabItems[active] === TabBackdrops) {
        return '350px';
      }
      return '220px';
    };

    const height = (active) => {
      if (TabItems[active] === TabBackdrops) {
        return '196px';
      }
      return '330px';
    };

    return (
      <Box margin={{ top: 'medium' }}>
        <Tabs
          width="100%"
          activeIndex={active}
          justify="start"
          onActive={index => this.setState({ active: index })}
        >
          {_.map(TabItems, tab => (
            <Tab title={this.getTabTitle(tab)}>
              <Box align="start">
                <Button
                  icon={<FormAdd color="white" />}
                  label={(
                    <Text color="white">
                      <strong>Add</strong>
                    </Text>
                  )}
                  primary
                  color="status-ok"
                  margin={{ vertical: 'medium' }}
                  onClick={() => this.set('isAdding', true)}
                />
              </Box>
            </Tab>
          ))}
        </Tabs>

        <ResponsiveContext.Consumer>
          {size => (
            <Box
              align="start"
              direction="row-responsive"
              wrap
            >
              {_.map(_.filter(images, i => i.type === TabItems[active]), image => (
                <Box
                  key={image._id}
                  margin="xsmall"
                  border
                >
                  <Box
                    width={size === 'small' ? '100%' : width(active)}
                    height={height(active)}
                  >
                    <Image
                      src={image.secureUrl || image.url}
                      fit="cover"
                      style={{ maxWidth: '100%' }}
                    />
                  </Box>

                  <Box align="start" gap="medium" pad="small">
                    <Box fill border="bottom">
                      <Text style={{ fontWeight: 500 }}>
                        Information
                      </Text>
                    </Box>

                    <Box>
                      <Text size="xsmall">
                        Primary?
                      </Text>
                      <Text size="small">
                        {image.main ? 'Yes' : 'No'}
                      </Text>
                    </Box>

                    <Box>
                      <Text size="xsmall">
                        Size
                      </Text>
                      <Text size="small">
                        {`${image.width}x${image.height}`}
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    fill
                    direction="row"
                    gap="medium"
                    pad="small"
                    justify="end"
                    border="top"
                    align="center"
                  >
                    {!image.main && (
                      <Button
                        label={(
                          <Box align="center" gap="xsmall">
                            <CheckboxSelected color="icon" />
                            <Text size="xsmall">Set Primary</Text>
                          </Box>
                        )}
                        plain
                        hoverIndicator
                        onClick={() => {
                          this.setState({ primary: image._id, isPrimarying: true });
                        }}
                      />
                    )}

                    <Button
                      label={(
                        <Box align="center" gap="xsmall">
                          <Trash color="icon" />
                          <Text size="xsmall">Delete</Text>
                        </Box>
                      )}
                      plain
                      hoverIndicator
                      onClick={() => {
                        this.setState({ remove: image._id, isDeleting: true });
                      }}
                    />

                    <Button
                      label={(
                        <Box align="center" gap="xsmall">
                          <View color="icon" />
                          <Text size="xsmall">Preview</Text>
                        </Box>
                      )}
                      plain
                      hoverIndicator
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </ResponsiveContext.Consumer>

        {isAdding && (
          <AddModal
            title={`Add ${this.getImageTypeFromIndex(active)}`}
            width="large"
            onAdd={this.onAdd}
            onClose={!isUploading && (() => this.set('isAdding', false))}
          >
            {isUploading ? <Spinner color="#000" /> : (
              <Box align="start" pad={{ vertical: 'small' }}>
                <Button
                  hoverIndicator="background"
                  onClick={() => this.setState({ checked: !checked })}
                >
                  <CheckBox
                    tabIndex="-1"
                    checked={checked}
                    label={(
                      <Box>
                        <Text>Mark as default.</Text>
                        <Text color="text-1" size="small">
                          Whether this image will be displayed in app or not.
                        </Text>
                      </Box>
                    )}
                  />
                </Button>

                <Box fill margin={{ top: 'medium' }}>
                  <FormField
                    label="URL"
                    htmlFor="text-input__image-url"
                  >
                    <TextInput
                      id="text-input__image-url"
                      placeholder="Image web address (http/https)"
                      value={upload.uri}
                      onChange={event => this.setState({ upload: { uri: event.target.value } })}
                    />
                  </FormField>

                  <Dropzone
                    onDrop={this.onDrop}
                    disableClick
                  >
                    {({ getRootProps, getInputProps, open }) => (
                      <StyledDropArea {...getRootProps()}>
                        <input {...getInputProps()} accept="image/*" />
                        <Box>
                          <Button
                            label={(
                              <Box align="center">
                                {upload.file && (
                                  <Box align="center">
                                    <Text color="text-1">{`Selected file: ${upload.file.name}`}</Text>
                                    <Text color="text-1">{filesize(upload.file.size)}</Text>
                                  </Box>
                                )}
                                <Text>Drop image here or click to open dialog</Text>
                              </Box>
                            )}
                            onClick={() => open()}
                          />
                        </Box>
                      </StyledDropArea>
                    )}
                  </Dropzone>
                </Box>
              </Box>
            )}
          </AddModal>
        )}

        {isDeleting && (
          <DeleteModal
            onDelete={this.onDelete}
            onClose={() => {
              this.setState({ remove: null, isDeleting: false });
            }}
          />
        )}

        {isPrimarying && (
          <CenterModal
            title="Set Primary"
            onClose={() => {
              this.setState({ primary: null, isPrimarying: false });
            }}
          >
            <Text>Are you sure you want to set this image as primary?</Text>
            <Box direction="row" justify="end" gap="small">
              <Button
                label={<Text>Cancel</Text>}
                margin={{ vertical: 'medium' }}
                onClick={() => {
                  this.setState({ primary: null, isPrimarying: false });
                }}
              />

              <Button
                label={(
                  <Text color="white">
                    <strong>Yes</strong>
                  </Text>
                )}
                primary
                color="status-ok"
                margin={{ vertical: 'medium' }}
                onClick={this.onSetPrimary}
              />
            </Box>
          </CenterModal>
        )}
      </Box>
    );
  }
}

export { Images };
