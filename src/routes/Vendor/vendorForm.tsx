// src/components/ClientForm.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const VendorForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    gst: '',
    pan: '',
    spocName: '',
    cancelledCheque: null as File | null
  });

  const [errors, setErrors] = useState({
    name: '',
    gst: '',
    pan: '',
    spocName: '',
    cancelledCheque: ''
  });

  const validateGST = (value: string) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(value) ? '' : 'Please enter a valid GST number';
  };

  const validatePAN = (value: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(value) ? '' : 'Please enter a valid PAN number';
  };

  const handleChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate fields
    let error = '';
    if (!value) {
      error = 'This field is required';
    } else if (field === 'gst') {
      error = validateGST(value as string);
    } else if (field === 'pan') {
      error = validatePAN(value as string);
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required fields are filled and valid
    const newErrors = {
      name: !formData.name ? 'This field is required' : '',
      gst: !formData.gst ? 'This field is required' : validateGST(formData.gst),
      pan: !formData.pan ? 'This field is required' : validatePAN(formData.pan),
      spocName: !formData.spocName ? 'This field is required' : '',
      cancelledCheque: !formData.cancelledCheque ? 'Please upload cancelled cheque' : ''
    };

    setErrors(newErrors);

    // If no errors, submit the form
    if (!Object.values(newErrors).some(error => error)) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Name*"
        variant="outlined"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={!!errors.name}
        helperText={errors.name}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="GST*"
        variant="outlined"
        value={formData.gst}
        onChange={(e) => handleChange('gst', e.target.value)}
        error={!!errors.gst}
        helperText={errors.gst}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="PAN*"
        variant="outlined"
        value={formData.pan}
        onChange={(e) => handleChange('pan', e.target.value)}
        error={!!errors.pan}
        helperText={errors.pan}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="SPOC name*"
        variant="outlined"
        value={formData.spocName}
        onChange={(e) => handleChange('spocName', e.target.value)}
        error={!!errors.spocName}
        helperText={errors.spocName}
        sx={{ mb: 2 }}
      />
      <Box sx={{ mb: 2 }}>
        <input
          accept="image/*,.pdf"
          style={{ display: 'none' }}
          id="cancelled-cheque-upload"
          type="file"
          onChange={(e) => handleChange('cancelledCheque', e.target.files?.[0] || null)}
        />
        <label htmlFor="cancelled-cheque-upload">
          <Button variant="outlined" component="span" fullWidth>
            {formData.cancelledCheque ? formData.cancelledCheque.name : 'Upload Cancelled Cheque*'}
          </Button>
        </label>
        {errors.cancelledCheque && (
          <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            {errors.cancelledCheque}
          </Typography>
        )}
      </Box>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Add a vendor
      </Button>
    </Box>
  );
};

export default VendorForm;