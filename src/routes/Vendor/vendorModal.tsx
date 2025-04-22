// src/components/ClientModal.tsx
import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import VendorForm from './vendorOnBoardingForm';
import { vendorOnboarding } from '../../services/api';

interface VendorModalProps {
  open: boolean;
  onClose: () => void;
}

const VendorModal: React.FC<VendorModalProps> = ({ open, onClose }) => {
    const handleFormSubmit = (data: any) => {
        console.log('Vendor Data:', data);
        // Handle form submission logic here
        vendorOnboarding(data);
        onClose(); // Close the modal after submission
      };
  return (

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
        {/* <Typography variant="h6" component="h2">
         Add Vendor
        </Typography>
        <VendorForm onSubmit={handleFormSubmit} /> */}
      </Box>
  );
};

export default VendorModal;