import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Text,
} from 'grommet';

import { CenterModal } from './CenterModal';

const DeleteModal = ({ onDelete, onClose }) => (
  <CenterModal title="Confirm" onClose={onClose}>
    <Text>Are you sure you want to delete?</Text>
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
            <strong>Delete</strong>
          </Text>
        )}
        onClick={onDelete}
        primary
        color="status-critical"
      />
    </Box>
  </CenterModal>
);

DeleteModal.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export { DeleteModal };
