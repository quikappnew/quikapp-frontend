// src/components/ClientModal.tsx
import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import ClientForm from './clientForm';

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ open, onClose }) => {
    const handleFormSubmit = (data: any) => {
        console.log('Client Data:', data);
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
         Add Client
        </Typography>
        <ClientForm onSubmit={handleFormSubmit} />
      </Box>
    </Modal>
  );
};

export default ClientModal;