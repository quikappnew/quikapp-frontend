// src/components/ClientForm.tsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Snackbar, Alert, AlertColor } from '@mui/material';
import { addLocation } from 'services/api';
import { useNavigate } from 'react-router-dom';     

const LocationForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [locationName, setLocationName] = useState('');
  const [nodalLocationName, setNodalLocationName] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [pinCodeError, setPinCodeError] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const location = {
      name_of_city: locationName,
      district,
      state,
      pincode: pinCode,
      nodal_location: nodalLocationName,
      soft_delete: false,
      created_at: new Date().toISOString(),
    };
    try {
      const response = await addLocation(location);
      
      setSnackbar({ 
        open: true,
        message: 'Location added successfully!',
        severity: 'success',
      });
      onSubmit(location);
      navigate('/locations');
    } catch (error) {
      
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      setPinCodeError('');
      if (pinCode.length === 6) {
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
          const data = await response.json();
  
          if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const postOffice = data[0].PostOffice[0];
            setLocationName(postOffice.Name);
            setDistrict(postOffice.District);
            setState(postOffice.State);
            setPinCodeError('');
          } else {
            setDistrict('');
            setState('');
            setLocationName('');
            setPinCodeError(data[0]?.Message || 'Pin code not found.');
          }
        } catch (error) {
  
          setDistrict('');
          setState('');
          setLocationName('');
          setPinCodeError('Error fetching data. Please try again.');
        }
      } else {
        setDistrict('');
        setState('');
        setLocationName('');
        if (pinCode.length > 0) {
           // Optionally show error only if user started typing
           setPinCodeError('Pincode must be 6 digits.'); // 
           setPinCodeError('');
        }
      }
    };

    const timerId = setTimeout(() => {
         fetchLocationData();
    }, 500);

    return () => clearTimeout(timerId);

  }, [pinCode]);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Nodal Location Name"
        variant="outlined"
        value={nodalLocationName}
        onChange={(e) => setNodalLocationName(e.target.value)}
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
        sx={{ mb:  2 }}
        inputProps={{ maxLength: 6 }}
        error={!!pinCodeError}
      />
      {pinCodeError && (
        <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2 }}>
          {pinCodeError}
        </Typography>
      )}

      <TextField
        fullWidth
        label="Location Name"
        variant="outlined"
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
        required
        sx={{ mb: 2 }}
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        fullWidth
        label="District"
        variant="outlined"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        required
        sx={{ mb: 2 }}
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        fullWidth
        label="State"
        variant="outlined"
        value={state}
        onChange={(e) => setState(e.target.value)}
        required
        sx={{ mb: 2 }}
        InputProps={{
          readOnly: true,
        }}
      />
    
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LocationForm;