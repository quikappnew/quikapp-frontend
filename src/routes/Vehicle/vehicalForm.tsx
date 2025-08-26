// src/components/ClientForm.tsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem, TextareaAutosize, FormControl, InputLabel } from '@mui/material';
import { getVendors } from 'services/api';

interface VehicleFormProps {
  onSubmit: (data: any) => void;
  disabled?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onSubmit, disabled = false }) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [length, setLength] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vendors, setVendors] = useState<any[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);

  const fetchVendors = async () => {
    try {
      setLoadingVendors(true);
      const response = await getVendors({ page_size: 100 });
      if (response?.data) {
        setVendors(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoadingVendors(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled) {
      onSubmit({ 
        vehicle_number: vehicleNumber,
        length,
        vendor_id: vendorId,
        remarks,
        vehicle_type: vehicleType
      });
    }
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
        disabled={disabled}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Length"
        variant="outlined"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        required
        disabled={disabled}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth variant="outlined">
        <InputLabel id="vendor-label">Vendor</InputLabel>
        <Select
          fullWidth
          labelId="vendor-label"
          label="Vendor"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          disabled={disabled || loadingVendors}
          sx={{ mb: 2 }}
          required
        >
          {vendors.map((vendor) => (
            <MenuItem key={vendor.id} value={vendor.id}>
              {vendor.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Remarks"
        variant="outlined"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        multiline
        rows={4}
        disabled={disabled}
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
          disabled={disabled}
          sx={{ mb: 2 }}
          required
        >
          <MenuItem value="Own fleet">Own fleet</MenuItem>
          <MenuItem value="Vendor fleet">Vendor fleet</MenuItem>
        </Select>
      </FormControl>
 
      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        disabled={disabled}
        fullWidth
      >
        {disabled ? 'Creating...' : 'Create Vehicle'}
      </Button>
    </Box>
  );
};

export default VehicleForm;