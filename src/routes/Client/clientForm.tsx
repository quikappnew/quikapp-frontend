// src/components/ClientForm.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const ClientForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [clientName, setClientName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [spocName, setSpocName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ clientName, gstNumber, panNumber, spocName });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

      <TextField
        fullWidth
        label="Client Name*"
        variant="outlined"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="GST Number*"
        variant="outlined"
        value={gstNumber}
        onChange={(e) => setGstNumber(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="PAN Number*"
        variant="outlined"
        value={panNumber}
        onChange={(e) => setPanNumber(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="SPOC Name*"
        variant="outlined"
        value={spocName}
        onChange={(e) => setSpocName(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default ClientForm;