// src/components/ClientModal.tsx
import React, { useState } from 'react';
import { Modal, Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import VehicleForm from './vehicalForm';
import { createVehicle } from 'services/api';

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const VehicleModal: React.FC<ClientModalProps> = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFormSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await createVehicle(data);
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create vehicle';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Add Vehicle
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Vehicle created successfully!
          </Alert>
        )}
        
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 1 }}>Creating vehicle...</Typography>
          </Box>
        )}
        
        <VehicleForm onSubmit={handleFormSubmit} disabled={loading || success} />
      </Box>
    </Modal>
  );
};

export default VehicleModal;