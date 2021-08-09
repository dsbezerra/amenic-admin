import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { rgba, opacify } from 'polished';
import _ from 'lodash';
import {
  Command,
  FormCheckmark,
  Redo,
  StatusCritical,
  Undo,
} from 'grommet-icons';
import {
  Box,
  Button,
  Collapsible,
  Heading,
  Text,
} from 'grommet';
import {
  CenterModal,
  Spinner,
} from '../components';

const EditFrom = 0;
const EditTo = 1;

const Shortcut = ({ shortcut }) => (
  <Box direction="row">
    <Box basis="50%">
      <Text><strong>{shortcut.command}</strong></Text>
    </Box>
    <Box basis="50%">
      <Text>{shortcut.label}</Text>
    </Box>
  </Box>
);

Shortcut.propTypes = {
  shortcut: PropTypes.shape({
    command: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

const ShortcutsModal = ({ shortcuts = [], onClose }) => (
  <CenterModal
    title="Basic commands"
    onClose={onClose}
  >
    <Box margin={{ vertical: 'small' }}>
      <Box gap="small">
        {_.map(shortcuts, s => <Shortcut key={s.id} shortcut={s} />)}
      </Box>
    </Box>
    <Box
      tag="footer"
      gap="small"
      direction="row"
      align="center"
      justify="end"
      pad={{ top: 'medium', bottom: 'small' }}
    >
      <Button
        label="Close"
        onClick={onClose}
        color="text-1"
      />
    </Box>
  </CenterModal>
);

ShortcutsModal.defaultPropTypes = {
  shortcuts: [],
};

ShortcutsModal.propTypes = {
  shortcuts: PropTypes.arrayOf(PropTypes.shape({
    command: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
};

const DEFAULT_SHORTUCTS = [
  {
    id: 'Ctrl+KeyZ',
    label: 'Undo a change',
    command: 'Ctrl+Z',
  },
  {
    id: 'Ctrl+KeyY',
    label: 'Redo a change',
    command: 'Ctrl+Y',
  },
  {
    id: 'Ctrl+Shift+KeyS',
    label: 'Saves all changes',
    command: 'Ctrl+Shift+S',
  },
];

const mapStateToProps = ({ main }) => {
  const { theme } = main;

  return { theme };
};

const getDataFromProps = (dataProp, props) => {
  if (dataProp) {
    const { [dataProp]: data } = props;
    return data;
  }

  throw new Error('data prop is not valid');
};

function withEditable(BaseComponent, {
  dataProp,
  bgProp,
  saveFn,
  title,
  shortcuts = DEFAULT_SHORTUCTS,
}) {
  class Editable extends Component {
    state = {
      data: getDataFromProps(dataProp, this.props),
      // Contains the edit history.
      edit: {
        // Stores undo state when the data is saved so we can easily tell
        // that it changed or not.
        undoAtSave: [],
        undo: [], // { field: String, change: [from, to] }
        redo: [], // { field: String, change: [from, to] }
      },
      saved: false,
      error: null,
      isSaving: false,
      isShortcutsVisible: false,
    }

    componentDidMount() {
      window.addEventListener('keyup', this.onKeyPress);
    }

    componentWillUnmount() {
      window.removeEventListener('keyup', this.onKeyPress);
    }

    onKeyPress = (e) => {
      const { ctrlKey, shiftKey } = e;
      if (ctrlKey) {
        switch (e.code) {
          // Undo on Ctrl+Y
          case 'KeyY':
            if (this.isRedoAvailable()) {
              this.redo();
            }
            break;

          // Undo on Ctrl+Z
          case 'KeyZ':
            if (this.isUndoAvailable()) {
              this.undo();
            }
            break;

          default:
        }
      }

      if (ctrlKey && shiftKey) {
        switch (e.code) {
          case 'KeyS':
            if (this.isDirty()) {
              this.onSave();
            }
            break;
          default:
        }
      }
    }

    onSave = async () => {
      if (!saveFn) {
        throw new Error('save function is not defined');
      }

      this.setState({ isSaving: true });

      const { edit, data } = this.state;
      let error = null;
      try {
        // Make sure all upper string properties are trimmed.
        _.keys(data).forEach((k) => {
          if (data[k] === 'string') {
            data[k] = data[k].trim();
          }
        });

        const res = await saveFn(data);
        error = res.error;
      } catch (err) {
        error = err.message || err.toString();
      }

      if (error) {
        this.setState({
          isSaving: false,
          error,
        });
        return;
      }

      this.setState({
        isSaving: false,
        saved: true,
        edit: {
          ...edit,
          undoAtSave: [...edit.undo],
        },
      });
    }

    onUpdateData = (field, value) => {
      const { edit, data } = this.state;

      const dataEdit = { field, change: [data[field], value] };
      this.setState({
        data: _.set({ ...data }, field, value),
        edit: {
          ...edit,
          undo: [...edit.undo, dataEdit],
        },
        saved: false,
      });
    }

    getProps = () => {
      const { data } = this.state;
      const {
        [dataProp]: ignored,
        ...other
      } = this.props;

      return {
        [dataProp]: data,
        ...other,
      };
    }

    getEditStatus = () => {
      const result = {
        statusColor: 'neutral-4',
        statusIcon: <FormCheckmark color="white" />,
        statusText: 'Apply',
      };

      const { error, saved, isSaving } = this.state;
      if (error) {
        result.statusColor = 'status-critical';
        result.statusIcon = <StatusCritical color="white" />;
        result.statusText = error;
      } else if (isSaving) {
        result.statusText = 'Saving...';
        result.statusIcon = <Spinner color="white" size="xsmall" />;
      } else if (!this.isDirty() && saved) {
        result.statusColor = 'status-ok';
        result.statusText = 'Saved';
      }


      return result;
    }

    getEditBar() {
      const {
        data,
        saved,
        isSaving,
      } = this.state;

      const {
        statusColor,
        statusIcon,
        statusText,
      } = this.getEditStatus();

      const { theme } = this.props;
      const isLight = theme === 'light';
      const component = isLight ? 255 : 38;
      const colorTo = rgba(component, component, component, 0);
      const colorFrom = opacify(1.0, colorTo);
      let bg = null;
      const bgProperties = _.split(bgProp, '|');
      if (bgProperties) {
        if (bgProperties.length === 1) bg = _.get(data, bgProperties[0]);
        else {
          bgProperties.forEach((p) => {
            if (data[p] && !bg) {
              bg = _.get(data, p);
            }
          });
        }
      }

      return (
        <Box
          style={{
            position: 'relative',
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: '50%',
          }}
        >
          <Collapsible
            direction="vertical"
            open={this.isActionsAvailable()}
          >
            <Box
              fill
              direction="row"
              background={statusColor}
              gap="small"
            >
              <Button
                plain
                onClick={!isSaving && this.onSave}
                disabled={!this.isDirty() && !saved}
              >
                <Box
                  direction="row"
                  pad={{ vertical: 'small', horizontal: 'medium' }}
                  gap="small"
                >
                  {statusIcon}
                  <Text color="white">
                    <strong>{statusText}</strong>
                  </Text>
                </Box>
              </Button>

              <Box direction="row" gap="small">
                <Button
                  onClick={this.undo}
                  disabled={!this.isUndoAvailable()}
                >
                  <Box
                    direction="row"
                    pad={{ vertical: 'small' }}
                    gap="small"
                  >
                    <Undo color="white" />
                    <Text color="white">
                      <strong>Undo</strong>
                    </Text>
                  </Box>
                </Button>

                <Button
                  onClick={this.redo}
                  disabled={!this.isRedoAvailable()}
                >
                  <Box
                    direction="row"
                    pad={{ vertical: 'small' }}
                    gap="small"
                  >
                    <Redo color="white" />
                    <Text color="white">
                      <strong>Redo</strong>
                    </Text>
                  </Box>
                </Button>
              </Box>
            </Box>
          </Collapsible>
          <Box
            direction="row"
            align="center"
            pad={{ vertical: 'large', horizontal: 'medium' }}
            height="300px"
            style={{
              background: (
                `linear-gradient(to bottom, ${colorFrom} 0%,${colorTo} 80%, ${colorFrom} 100%)`
              ),
            }}
            responsive
          >
            <Box
              fill
            >
              <Heading
                level="2"
                margin={{ top: 'none', bottom: 'xsmall' }}
              >
                {title || 'Edit'}
              </Heading>
            </Box>
            <Box align="center">
              <Button
                plain
                hoverIndicator={{
                  background: 'neutral-2',
                  borderRadius: '50%',
                }}
                onClick={() => this.setState({ isShortcutsVisible: true })}
              >
                <Command color="icon" />
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }

    undo = () => {
      const { edit, data } = this.state;

      const first = edit.undo.pop();
      edit.redo.push(first);

      this.setState({
        edit,
        data: _.set(data, first.field, first.change[EditFrom]),
      });
    }

    redo = () => {
      const { edit, data } = this.state;

      const first = edit.redo.pop();
      edit.undo.push(first);

      this.setState({
        edit,
        data: _.set(data, first.field, first.change[EditTo]),
      });
    }

    /**
     * Checks whether data ever changed.
     */
    isDirty = () => {
      const { edit } = this.state;
      return !_.isEqual(edit.undo, edit.undoAtSave);
    }

    isUndoAvailable = () => {
      const { edit } = this.state;
      return !_.isEmpty(edit.undo);
    }

    isRedoAvailable = () => {
      const { edit } = this.state;
      return !_.isEmpty(edit.redo);
    }

    isSaveAvailable = () => {
      const { saved, isSaving } = this.state;
      return this.isDirty() && !isSaving && !saved;
    }

    isActionsAvailable = () => this.isUndoAvailable() || this.isRedoAvailable()

    render() {
      const {
        isShortcutsVisible,
      } = this.state;
      return (
        <Box>
          <BaseComponent
            editBar={this.getEditBar()}
            onUpdate={this.onUpdateData}
            {...this.getProps()}
          />
          {isShortcutsVisible && (
            <ShortcutsModal
              shortcuts={shortcuts}
              onClose={() => this.setState({ isShortcutsVisible: false })}
            />
          )}
        </Box>
      );
    }
  }

  Editable.getInitialProps = (ctx) => {
    if (BaseComponent.getInitialProps) {
      return BaseComponent.getInitialProps(ctx);
    }

    return {};
  };

  Editable.propTypes = {
    theme: PropTypes.string.isRequired,
  };

  return connect(mapStateToProps)(Editable);
}

export default withEditable;
