import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface ConfirmDeactivateModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

const ConfirmDeactivateModal: React.FC<ConfirmDeactivateModalProps> = ({
  open,
  onClose,
  onConfirm,
  userName
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Confirm Deactivation
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Are you sure you want to deactivate {userName}? This action can be reversed later.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={onConfirm}>
            Deactivate
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmDeactivateModal; 