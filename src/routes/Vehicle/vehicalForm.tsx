// src/components/ClientForm.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';

const VehicleForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('');
  const [spocName, setSpocName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ vehicleNumber, model, capacity, chassisNumber });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

      <TextField
        fullWidth
        label="Vehicle Number*"
        variant="outlined"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Model*"
        variant="outlined"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Capacity*"
        variant="outlined"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Chassis Number*"
        variant="outlined"
        value={chassisNumber}
        onChange={(e) => setChassisNumber(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Remarks*"
        variant="outlined"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />
      <Select
        fullWidth
        label="Status*"
        variant="outlined"
        value={spocName}
        onChange={(e) => setSpocName(e.target.value)}
      >
        <MenuItem value="Own">Own</MenuItem>
        <MenuItem value="Market">Market</MenuItem>
      </Select>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default VehicleForm;