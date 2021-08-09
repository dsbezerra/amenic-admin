import axios from 'axios';

export default axios.create({
  // TODO: Change production URL to AWS
  baseURL: process.env.NODE_ENV === 'production' ? 'https://amenic-admin.herokuapp.com'
  // NOTE: Use LAN IP Address to make possible to test from other devices in network.
    : 'http://192.168.31.4:8000',
});
