import { cloneElement } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  CaretNext,
  CaretPrevious,
  ChapterNext,
  ChapterPrevious,
} from 'grommet-icons';
import {
  Box,
  Button,
  ResponsiveContext,
} from 'grommet';

const PageButton = ({ href, disabled, icon }) => {
  if (!href || disabled) {
    return (
      <Button
        icon={cloneElement(icon, { color: 'text-1' })}
        plain
        hoverIndicator
        disabled
      />
    );
  }

  return (
    <Link href={href ? href.replace('api/v1/', '') : ''} passHref prefetch>
      <Button
        icon={cloneElement(icon, { color: 'icon' })}
        plain
        hoverIndicator
      />
    </Link>
  );
};

const Pages = ({ pages, hasPreviousPage, hasNextPage }) => (
  <ResponsiveContext.Consumer>
    {size => (
      <Box
        align="center"
        direction="row"
        justify="center"
        gap={size !== 'small' ? 'medium' : 'xsmall'}
        margin="medium"
      >
        <PageButton
          href={pages && pages.first}
          icon={<ChapterPrevious />}
          disabled={pages && !pages.previous}
        />

        <PageButton
          href={pages && pages.previous}
          icon={<CaretPrevious />}
          disabled={!hasPreviousPage}
        />

        <PageButton
          href={pages && pages.next}
          icon={<CaretNext />}
          disabled={!hasNextPage}
        />

        <PageButton
          href={pages && pages.last}
          icon={<ChapterNext />}
          disabled={pages && !pages.next}
        />
      </Box>
    )}
  </ResponsiveContext.Consumer>
);

Pages.propTypes = {
  pages: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
    next: PropTypes.string,
    previous: PropTypes.string,
  }).isRequired,
  hasNextPage: PropTypes.bool.isRequired,
  hasPreviousPage: PropTypes.bool.isRequired,
};

export { Pages };
