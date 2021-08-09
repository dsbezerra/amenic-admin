import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Text,
} from 'grommet';

import { CenterModal } from './CenterModal';

const AddModal = ({
  title, children, onAdd, onClose, ...rest
}) => (
  <CenterModal
    title={title}
    onClose={onClose}
    {...rest}
  >
    {children}
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
      <Button
        label={(
          <Text color="white">
            <strong>Add</strong>
          </Text>
        )}
        onClick={onAdd}
        primary
        color="status-ok"
      />
    </Box>
  </CenterModal>
);

AddModal.defaultProps = {
  title: 'Add',
};

AddModal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element.isRequired,
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export { AddModal };
