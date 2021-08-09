import React, { Component } from 'react';
import Router from 'next/router';
import { Login } from 'grommet-icons';
import {
  Box,
  Button,
  TextInput,
  Text,
} from 'grommet';
import withGrommet from '../lib/withGrommet';
import withAuth from '../lib/withAuth';

import { login } from '../lib/api/admin';

class LoginPage extends Component {
  usernameInput = null;

  passwordInput = null;

  state = {
    error: null,
  }

  componentDidMount() {
    localStorage.removeItem('user');
  }

  onSubmit = async (e) => {
    e.preventDefault();

    this.setState({ error: null });

    const { usernameInput, passwordInput } = this;
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username && password) {
      try {
        const res = await login({ username, password });
        const { success, user } = res;
        if (success) {
          localStorage.setItem('user', JSON.stringify(user));
          Router.replace('/');
        }
      } catch (err) {
        this.setState({
          error: err.message,
        });
      }
    } else {
      this.setState({ error: 'Empty field(s)!' });
    }
  }

  render() {
    const { error } = this.state;
    return (
      <Box align="center" justify="center" pad="small" fill>
        <form onSubmit={this.onSubmit}>
          <Box
            align="center"
            animation={[
              { type: 'slideUp', duration: 500 },
              { type: 'fadeIn', duration: 500 },
            ]}
          >
            <Text
              color="dark-1"
              size="xxlarge"
              margin={{ top: 'large' }}
              style={{
                letterSpacing: '4px',
                fontWeight: 500,
                fontFeatureSettings: '"smcp" 1',
              }}
            >
              Amenic
            </Text>
            <Text
              color="dark-1"
              size="small"
              margin={{ bottom: 'medium' }}
              style={{ letterSpacing: '2px' }}
            >
              ADMINISTRATION
            </Text>
          </Box>

          {error && (
            <Box
              align="center"
              margin="small"
              animation={{ type: 'fadeIn', duration: 500 }}
            >
              {error}
            </Box>)}

          <Box
            justify="center"
            pad={{ left: 'medium', right: 'small', top: 'medium' }}
            gap="small"
            style={{ maxWidth: '250px' }}
            animation={[
              { type: 'slideUp', duration: 500 },
              { type: 'fadeIn', duration: 500, delay: 1000 },
            ]}
          >

            <Text
              color="dark-3"
              size="small"
              style={{ letterSpacing: '2px' }}
            >
              USERNAME
            </Text>
            <TextInput
              id="username"
              name="username"
              placeholder="Username"
              ref={(input) => { this.usernameInput = input; }}
            />

            <Text
              color="dark-3"
              size="small"
              margin={{ top: 'small' }}
              style={{ letterSpacing: '2px' }}
            >
              PASSWORD
            </Text>
            <TextInput
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              ref={(input) => { this.passwordInput = input; }}
            />

            <Button hoverIndicator margin={{ top: 'small' }} type="submit">
              <Box pad="small" direction="row" align="center" gap="small">
                <Login size="medium" />
                <Text>Log in</Text>
              </Box>
            </Button>
          </Box>
        </form>
      </Box>
    );
  }
}

export default withAuth(withGrommet(LoginPage), { logoutRequired: true });
