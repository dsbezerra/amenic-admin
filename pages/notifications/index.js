import React, { Component } from 'react';
import Link from 'next/link';
import _ from 'lodash';
import {
  FormAdd,
} from 'grommet-icons';
import {
  Box,
  Button,
  Collapsible,
  Heading,
  Text,
} from 'grommet';
import {
  Layout,
  PaginatedContent,
} from '../../components';

import withEverything from '../../lib/withEverything';

import { defaultPaginationQuery, getPagination } from '../../utils/pagination';
import { NOTIFICATION, getList } from '../../lib/api';

class NotificationsPage extends Component {
  state = {
    // TODO
    isShowingData: [],

    // TODO
    isShowingHTMLText: [],
  }

  static async getInitialProps({ req, query }) {
    const headers = {};
    if (req && req.headers && req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    const {
      notifications,
      totalCount,
      pages,
    } = await getList(NOTIFICATION, { ...defaultPaginationQuery, ...query }, { headers });

    return {
      notifications,
      totalCount,
      pagination: getPagination(query, pages),
    };
  }

  render() {
    const {
      notifications,
      pagination,
      totalCount,
    } = this.props;
    return (
      <Layout title="Notifications" {...this.props}>
        <Box
          pad={{ horizontal: 'medium' }}
          animation={[
            { type: 'slideUp', duration: 500 },
            { type: 'fadeIn', duration: 500 },
          ]}
        >
          <Heading level="2">Notifications</Heading>
        </Box>

        <Box align="start" pad={{ horizontal: 'medium' }}>
          <Link href="/notifications/compose" passHref>
            <Button
              icon={<FormAdd color="white" />}
              label={(
                <Text color="white">
                  <strong>Compose</strong>
                </Text>
              )}
              primary
              color="status-ok"
              margin={{ vertical: 'medium' }}
            />
          </Link>
        </Box>

        {_.isEmpty(notifications) ? (
          <Box pad={{ horizontal: 'medium' }}>
            <Text>No notifications found.</Text>
          </Box>
        ) : (
          <PaginatedContent
            {...pagination}
            totalCount={totalCount}
          >
            <Box
              margin={{ top: 'medium' }}
              animation={[
                { type: 'slideUp', duration: 500, delay: 400 },
                { type: 'fadeIn', duration: 500, delay: 400 },
              ]}
            >
              {_.map(notifications, n => <NotificationRow key={n._id} notification={n} />)}
            </Box>
          </PaginatedContent>
        )}
      </Layout>
    );
  }
}

const notificationText = (notification) => {
  const r = _.split(notification.text, '\n');

  const result = [];
  for (let i = 0; i < r.length; i += 1) {
    result.push(r[i]);
    if (i < r.length - 1) {
      result.push(<br />);
    }
  }

  return result;
};

const NotificationRow = ({
  notification,
  isDataVisible,
  isHTMLTextVisible,
}) => (
  <Box border="top" pad="medium">

    <Box>
      <Text size="small">Type</Text>
      <Text size="small">{notification.type}</Text>
    </Box>

    <Box margin={{ top: 'small' }}>
      <Text size="small">Title</Text>
      <Text size="small">{notification.title}</Text>
    </Box>

    <Box margin={{ top: 'small' }}>
      <Text size="small">Text</Text>
      <Text size="small">
        {notificationText(notification)}
      </Text>
    </Box>

    {notification.htmlText && (
      <Box margin={{ top: 'small' }}>
        <Collapsible direction="vertical" open={isHTMLTextVisible}>
          <Text
            size="small"
            dangerouslySetInnerHTML={{
              __html: notification.htmlText,
            }}
          />
        </Collapsible>
        <Button>
          Show HTML Text
        </Button>
      </Box>
    )}

    {notification.data && (
      <Box margin={{ top: 'small' }}>
        <Collapsible direction="vertical" open={isDataVisible}>
          <Text
            size="small"
            dangerouslySetInnerHTML={{
              __html: notification.htmlText,
            }}
          />
        </Collapsible>
        <Button>
          Show Data
        </Button>
      </Box>
    )}
  </Box>
);


export default withEverything(NotificationsPage, { adminRequired: true });
