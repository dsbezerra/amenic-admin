import React, { Component } from 'react';
import Router from 'next/router';
import _ from 'lodash';
import {
  Next,
  Previous,
} from 'grommet-icons';
import {
  Box,
  Button,
  FormField,
  Heading,
  Tab,
  Tabs,
  Text,
  TextInput,
  ResponsiveContext,
} from 'grommet';

import {
  CenterModal,
  Layout,
  HorizontalScroller,
} from '../../components';

import withEverything from '../../lib/withEverything';

import { capitalize } from '../../utils/string';
import { formatISOString } from '../../utils/time';
import { TASK, getList } from '../../lib/api';
import { getCommandsList, runCommand } from '../../lib/api/commands';

export const TabHome = 'home';
export const TabApiKeys = 'apikeys';
export const TabLogs = 'logs';

const TabItems = [
  TabHome,
  TabApiKeys,
  TabLogs,
];

// NOTE: must match TabItems order.
const TabItemNames = [
  'Home',
  'API Keys',
  'Logs',
];

export function app(BaseComponent, TabName) {
  class Page extends Component {
    state = {
      activeTab: -1,
    }

    getTabIndex = (t) => {
      const { activeTab } = this.state;
      if (activeTab > -1) {
        return activeTab;
      }

      return _.indexOf(TabItems, t);
    }

    onTabActive = (i) => {
      this.setState({ activeTab: i });

      const k = TabItems[i];
      const href = `/app${k !== TabHome ? `/${k}` : ''}`;
      Router.push(href, href);
    }

    render() {
      return (
        <Layout title="Application" {...this.props}>
          <Box
            pad={{ horizontal: 'medium' }}
          >
            <Heading level="2">Application</Heading>
          </Box>
          <Box
            width="100%"
            align="start"
            margin={{ top: 'medium' }}
          >
            <Tabs
              width="100%"
              activeIndex={this.getTabIndex(TabName)}
              justify="start"
              onActive={this.onTabActive}
            >
              {_.map(TabItems, (t, i) => (
                <Tab key={t} title={TabItemNames[i]}>
                  {t === TabName ? (
                    <Box
                      animation={[
                        { type: 'slideUp', duration: 500 },
                        { type: 'fadeIn', duration: 500 },
                      ]}
                    >
                      <BaseComponent {...this.props} />
                    </Box>
                  ) : undefined}
                </Tab>
              ))}
            </Tabs>
          </Box>
        </Layout>
      );
    }
  }

  Page.getInitialProps = (ctx) => {
    if (BaseComponent.getInitialProps) {
      return BaseComponent.getInitialProps(ctx);
    }

    return {};
  };

  return withEverything(Page, { adminRequired: true });
}

// eslint-disable-next-line react/no-multi-comp
class Home extends Component {
  state = {
    /**
     * This is a map to command args defined by user
     * [command_name -> command_args].
     */
    commandsArgs: {},

    /** Holds index of command currently displaying args */
    displayCommandArgsIndex: -1,
  }

  static async getInitialProps({ req }) {
    const headers = {};
    if (req && req.headers && req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    const commands = await getCommandsList({ headers });
    const { tasks } = await getList(TASK, { page: 1, per_page: 100 }, { headers });
    return {
      commands,
      tasks,
    };
  }

  onRunCommand = async (command) => {
    const { commandsArgs } = this.state;

    const args = [];

    const map = commandsArgs[command.command_name];
    if (map) {
      // Build args.
      Object.keys(map).forEach((k) => {
        args.push(k);
        args.push(map[k]);
      });
    }

    await runCommand({
      command_name: command.command_name,
      command_args: args,
    });
  }

  renderCommand = (command, index) => {
    const ActionButton = ({ label, ...rest }) => (
      <Button
        label={(
          <Box pad="xsmall">
            <Text size="xsmall">
              {label}
            </Text>
          </Box>
        )}
        plain
        hoverIndicator
        {...rest}
      />
    );

    return (
      <Box
        key={command.command_name}
        width="100%"
        pad="small"
      >
        <Text size="xsmall" color="text-1">
          {command.command_name}
        </Text>
        <Box margin={{ top: 'small' }}>
          <Text size="small" style={{ whiteSpace: 'initial' }}>
            {command.command_description}
          </Text>
        </Box>
        <Box
          direction="row"
          justify="between"
        >
          <ActionButton
            label="RUN"
            onClick={() => this.onRunCommand(command)}
          />
          {!_.isEmpty(command.command_args) && (
            <ActionButton
              label="EDIT ARGS"
              onClick={() => {
                this.setState({
                  displayCommandArgsIndex: index,
                });
              }}
            />
          )}
        </Box>
      </Box>
    );
  }

  renderCommandArgsModal = () => {
    const { displayCommandArgsIndex } = this.state;
    if (displayCommandArgsIndex < 0) return undefined;

    const { commands } = this.props;
    const command = commands[displayCommandArgsIndex];
    if (!command) return undefined;

    const { commandsArgs } = this.state;
    const argsValue = commandsArgs[command.command_name] || {};
    return (
      <CenterModal
        title={command.command_name}
        onClose={() => this.setState({ displayCommandArgsIndex: -1 })}
      >
        <Text>{command.command_description}</Text>
        <Text size="small" color="text-1">ARGS</Text>
        <Box fill border="top" />
        {_.map(command.command_args, arg => (
          <Box key={arg}>
            <Box margin={{ vertical: 'small' }}>
              <FormField
                label={(
                  <Text size="small">{arg.name}</Text>
                )}
                help={(
                  <Text size="small" color="text-1">{arg.description}</Text>
                )}
              >
                <TextInput
                  value={argsValue[arg.name]}
                  onChange={event => this.setState({
                    commandsArgs: {
                      ...commandsArgs,
                      [command.command_name]: {
                        ...commandsArgs[command.command_name],
                        [arg.name]: event.target.value,
                      },
                    },
                  })}
                />
              </FormField>
            </Box>
          </Box>
        ))}
        <Box align="end">
          <Button
            label={(
              <Box pad="xsmall">
                <Text size="xsmall">
                  Close
                </Text>
              </Box>
            )}
            onClick={() => this.setState({ displayCommandArgsIndex: -1 })}
          />
        </Box>
      </CenterModal>
    );
  }

  renderTask = (task) => {
    return (
      <Box key={task.id} border="bottom" pad={{ vertical: 'medium' }}>
        <Box margin={{ bottom: 'small' }}>
          <Text size="small" color="text-1">{task.type}</Text>
        </Box>


        <Box margin={{ vertical: 'xsmall' }}>
          <Text size="small" style={{ fontWeight: 'bold' }}>
            {task.name.toUpperCase()}
          </Text>
        </Box>

        <Box margin={{ vertical: 'xsmall' }}>
          <Text size="small">
            {task.description}
          </Text>
        </Box>

        {task.last_run && (
          <Box margin={{ vertical: 'xsmall' }}>
            <Text size="small">
              {`Last run: ${formatISOString(task.last_run)}`}
            </Text>
          </Box>
        )}

        {!task.last_error && (
          <Box margin={{ vertical: 'xsmall' }}>
            <Text size="small" color="green">
              This task's last run was executed successfully!
            </Text>
          </Box>
        )}
        {task.last_error && (
          <Box margin={{ vertical: 'xsmall' }}>
            <Text size="small" color="red">
              {`Error: ${task.lastError}`}
            </Text>
          </Box>
        )}
      </Box>
    );
  }

  render() {
    const { displayCommandArgsIndex } = this.state;
    const { commands, tasks } = this.props;
    return (
      <ResponsiveContext.Consumer>
        {size => (
          <Box>
            <Box pad="medium">
              <Heading level="3" margin="none">
                Status and Shortcuts
              </Heading>
              <Box
                direction="row-responsive"
                margin={{ top: 'medium' }}
                gap="small"
              >
                <Box
                  basis="50%"
                  border
                  align="center"
                  justify="center"
                  round
                >
                  API Uptime with restart and shutdown buttons goes here
                </Box>

                <Box
                  basis="20%"
                  align="center"
                  justify="center"
                  background="background-1"
                  round
                />

                <Box
                  basis="20%"
                  align="center"
                  justify="center"
                  background="background-1"
                  round
                />

                <Box
                  width={size === 'small' ? '100%' : '320px'}
                  border
                  round
                >
                  <HorizontalScroller
                    leftArrow={<Previous size="small" />}
                    rightArrow={<Next size="small" />}
                  >
                    {_.map(commands, this.renderCommand)}
                  </HorizontalScroller>
                </Box>
              </Box>
            </Box>

            <Box fill border="top" />

            <Box pad="medium">
              <Heading level="3" margin="none">
                Tasks
              </Heading>
              {_.map(tasks, this.renderTask)}
            </Box>
            {displayCommandArgsIndex > -1 && this.renderCommandArgsModal()}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}

export default app(Home, TabHome);
