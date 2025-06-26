// src/components/ClientModal.tsx
import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import UserForm from './userForm';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  user?: any;
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, user }) => {
  const handleFormSubmit = (data: any) => {

    // Handle form submission logic here
    onClose(); // Close the modal after submission
  };

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
        }}
      >
        <Typography variant="h6" component="h2">
          {user ? 'Edit User' : 'Add User'}
        </Typography>
        <UserForm onSubmit={handleFormSubmit} user={user} onClose={onClose} />
      </Box>
    </Modal>
  );
};

export default UserModal;