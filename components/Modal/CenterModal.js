import PropTypes from 'prop-types';
import {
  Box,
  Heading,
  Layer,
} from 'grommet';

const CenterModal = ({
  title,
  // eslint-disable-next-line react/prop-types
  children,
  onClose,
  ...other
}) => (
  <Layer
    position="center"
    modal
    onClickOutside={onClose}
    onEsc={onClose}
  >
    <Box pad="medium" gap="small" width="medium" {...other}>
      <Heading level={3} margin="none">
        {title}
      </Heading>
      {children}
    </Box>
  </Layer>
);

CenterModal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export { CenterModal };
