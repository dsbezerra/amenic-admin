import React, { cloneElement } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import _ from 'lodash';
import {
  Dashboard,
  FormClose,
  Menu,
  Logout,
  Monitor,
  Multimedia,
  Notification,
  Robot,
  Ticket,
} from 'grommet-icons';
import {
  Box,
  Button,
  Heading,
  Layer,
  Text,
  ResponsiveContext,
} from 'grommet';

import { AppBar } from './index';

import { setTheme } from '../store/main';

const MI = (label, href, icon) => ({ label, href, icon });
const MenuItems = [
  MI('Dashboard', '/', <Dashboard />),
  MI('Application', '/app', <Monitor />),
  MI('Movies', '/movies', <Multimedia />),
  MI('Notifications', '/notifications', <Notification />),
  MI('Scrapers', '/scrapers', <Robot />),
  MI('Theaters', '/theaters', <Ticket />),
];


const MenuItem = ({ href, label, icon, isActive }) => (
  <Link href={href} passHref>
    <Button hoverIndicator style={{ width: '100%' }}>
      <Box
        pad={{ vertical: 'small', horizontal: 'medium' }}
        direction="row"
        align="center"
        gap="small"
        background={isActive ? 'background-2' : 'transparent'}
      >
        {cloneElement(icon, { color: isActive ? 'neutral-4' : 'icon' })}
        <Text
          size="small"
          color={isActive ? 'neutral-4' : ''}
          style={{ fontWeight: isActive ? 500 : null }}
        >
          {label}
        </Text>
      </Box>
    </Button>
  </Link>
);

const MobileMenu = ({ theme, onToggleTheme, onClose }) => (
  <Layer>
    <AppBar>
      <Button
        icon={<FormClose color="icon" />}
        hoverIndicator
        onClick={onClose}
      />

      <Box basis="100%">
        <Text
          margin={{ vertical: '12px' }}
          style={{
            letterSpacing: '4px',
            fontWeight: 500,
            fontFeatureSettings: '"smcp" 1',
          }}
          responsive
        >
          Amenic
        </Text>
      </Box>
      <Link
        href="/logout"
        passHref
      >
        <Button
          icon={<Logout color="icon" />}
          hoverIndicator
          alignSelf="end"
        />
      </Link>
    </AppBar>
    <Box
      fill
      align="center"
      justify="center"
    >
      {theme && (
        <Button
          onClick={onToggleTheme}
          plain
        >
          <Text size="small">
            {`${theme.toUpperCase()}`}
          </Text>
        </Button>
      )}
      {_.map(MenuItems, ({ href, label }, i) => (
        <Box
          animation={[
            { type: 'slideUp', duration: 200, delay: 100 * i },
            { type: 'fadeIn', duration: 200, delay: 100 * i },
            { type: 'zoomIn', duration: 200, delay: 100 * i },
          ]}
        >
          <Link
            key={href}
            href={href}
            passHref
          >
            <Heading level="2" style={{ letterSpacing: '4px', fontWeight: 500 }}>
              {label}
            </Heading>
          </Link>
        </Box>
      ))}
    </Box>
  </Layer>
);


const isActive = (router = {}, href) => {
  const { pathname } = router;
  if (pathname) {
    if (href === '/') {
      return pathname === '/' || pathname === '/index';
    }

    return pathname.indexOf(href) > -1;
  }

  return false;
};

class Layout extends React.Component {
  state = {
    showSidebar: false,
  }

  toggleTheme = () => {
    const { theme, dispatch } = this.props;
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  }

  renderDesktop = () => {
    const {
      user,
      children,
      router,
      theme,
    } = this.props;
    return (
      <Box
        direction="row"
        style={{ position: 'relative' }}
      >
        <Box
          height="100%"
          background="background-1"
          style={{ position: 'fixed' }}
        >
          <Box
            gap="small"
          >
            <Box
              pad={{ vertical: 'small', horizontal: 'medium' }}
            >
              <Text
                size="large"
                style={{
                  letterSpacing: '4px',
                  fontWeight: 500,
                  fontFeatureSettings: '"smcp" 1',
                }}
              >
                Amenic
              </Text>

              {theme && (
                <Button
                  onClick={this.toggleTheme}
                  plain
                >
                  <Text size="small">
                    {`${theme.toUpperCase()}`}
                  </Text>
                </Button>
              )}
            </Box>

            {user && (
              <Box
                direction="row"
                pad={{ vertical: 'small', horizontal: 'medium' }}
                border="bottom"
              >
                <Box fill>
                  <Text size="small">Welcome,</Text>
                  <Text size="small">{user.username}</Text>
                </Box>
                <Link
                  href="/logout"
                  passHref
                >
                  <Button
                    icon={<Logout color="icon" />}
                    hoverIndicator
                    alignSelf="end"
                  />
                </Link>
              </Box>
            )}
          </Box>
          <Box width="250px">
            <Box
              align="start"
            >
              <Box pad={{ top: 'medium', horizontal: 'medium', bottom: 'small' }}>
                <Text size="small">MENU</Text>
              </Box>
              {_.map(MenuItems, ({ href, label, icon }) => (
                <MenuItem
                  key={href}
                  href={href}
                  label={label}
                  icon={icon}
                  isActive={isActive(router, href)}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Box width="calc(100% - 250px)" style={{ marginLeft: '250px' }}>
          {children}
        </Box>
      </Box>
    );
  }

  renderMobile = () => {
    const { showSidebar } = this.state;
    const { children, theme } = this.props;
    return (
      <Box>
        <AppBar>
          <Button
            icon={<Menu color="icon" />}
            hoverIndicator
            onClick={() => this.setState({ showSidebar: !showSidebar })}
          />

          <Box basis="100%" justify="center">
            <Text
              style={{
                letterSpacing: '4px',
                fontWeight: 500,
                fontFeatureSettings: '"smcp" 1',
              }}
              responsive
            >
              Amenic
            </Text>
          </Box>
          {showSidebar && (
            <MobileMenu
              theme={theme}
              onToggleTheme={this.toggleTheme}
              onClose={() => this.setState({ showSidebar: false })}
            />)}
        </AppBar>
        <Box>
          {children}
        </Box>
      </Box>
    );
  }

  render() {
    const { title, theme } = this.props;
    return (
      <ResponsiveContext.Consumer>
        {size => (
          <Box>
            <Head>
              <title>{`amenic - ${title}`}</title>
              {theme && (
                <meta name="theme-color" content={theme === 'light' ? '#fff' : '#262626'} />
              )}
            </Head>
            {size !== 'small' ? this.renderDesktop() : this.renderMobile()}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}

function mapStateToProps({ main }) {
  const { theme } = main;
  return { theme };
}

// eslint-disable-next-line no-class-assign
Layout = connect(mapStateToProps)(Layout);
export { Layout };
