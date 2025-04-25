// src/components/ClientForm.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { addClient } from 'services/api';

const ClientForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [clientName, setClientName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [spocName, setSpocName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {

    // addCliet api integration
    const client = {
      name: clientName,
      gst: gstNumber,
      pan: panNumber,
      spoc_name: spocName,
      contact_number: contactNumber,
      contact_email: contactEmail
    };
    addClient(client);
    e.preventDefault();
    onSubmit({ clientName, gstNumber, panNumber, spocName, contactNumber, contactEmail });
  };

  //Add contact number and contact email


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

      <TextField
        fullWidth
        label="Client Name"
        variant="outlined"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="GST Number"
        variant="outlined"
        value={gstNumber}
        onChange={(e) => setGstNumber(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="PAN Number"
        variant="outlined"
        value={panNumber}
        onChange={(e) => setPanNumber(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="SPOC Name"
        variant="outlined"
        value={spocName}
        onChange={(e) => setSpocName(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Contact Number"
        variant="outlined"
        value={contactNumber}
        onChange={(e) => setContactNumber(e.target.value)}
      />
      <TextField
        fullWidth
        label="Contact Email"
        variant="outlined"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
      />

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default ClientForm;