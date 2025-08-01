// src/components/ClientModal.tsx
import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import LocationForm from './locationForm';

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ open, onClose }) => {
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
         Add Location
        </Typography>
        <LocationForm onSubmit={handleFormSubmit} />
      </Box>
    </Modal>
  );
};

export default LocationModal;