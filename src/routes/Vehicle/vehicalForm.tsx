// src/components/ClientForm.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem, TextareaAutosize, FormControl, InputLabel } from '@mui/material';

const VehicleForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [chassisNumber, setChassisNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ vehicleNumber, model, capacity, chassisNumber });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

      <TextField
        fullWidth
        label="Vehicle Number"
        variant="outlined"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Model"
        variant="outlined"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Capacity"
        variant="outlined"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Chassis Number"
        variant="outlined"
        value={chassisNumber}
        onChange={(e) => setChassisNumber(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Remarks"
        variant="outlined"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        multiline
        rows={4}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth variant="outlined">
        <InputLabel id="vehicleType-label">Vehicle Type</InputLabel>
        <Select
          fullWidth
          labelId="vehicleType-label"
          label="Vehicle Type"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          sx={{ mb: 2 }}
          required
        >
          <MenuItem value="Own fleet">Own fleet</MenuItem>
          <MenuItem value="Vendor fleet">Vendor fleet</MenuItem>
        </Select>
      </FormControl>
 
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default VehicleForm;