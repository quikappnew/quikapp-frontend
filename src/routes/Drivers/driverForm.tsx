// src/components/ClientForm.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const DriverForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [driverName, setDriverName] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ driverName, district, state, pinCode });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

      <TextField
        fullWidth
        label="Driver Name"
        variant="outlined"
        value={driverName}
        onChange={(e) => setDriverName(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="District"
        variant="outlined"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="State"
        variant="outlined"
        value={state}
        onChange={(e) => setState(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Pin Code"
        variant="outlined"
        value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default DriverForm;