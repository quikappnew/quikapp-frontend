import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Alert,
  Chip,
  Divider,
  InputLabel,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import SidebarLayout from 'layouts/SidebarLayout';
import { vehicleOnboarding } from 'services/api';

const initialState = {
  vehicle_number: '',
  chassis_number: '',
  vehicle_owner: '',
  vendor: '',
  truck_length_feet: '',
  registration_date: '',
  fitness_certificate_expiry: '',
  tax_expiry_date: '',
  insurance_expiry_date: '',
  national_permit_validity: '',
};

const fileFields = [
  { name: 'fitness_certificate_file', label: 'Fitness Certificate File' },
  { name: 'tax_certificate_file', label: 'Tax Certificate File' },
  { name: 'insurance_file', label: 'Insurance File' },
  { name: 'national_permit_file', label: 'National Permit File' },
  { name: 'rc_documents_file', label: 'RC Documents File' },
  { name: 'pucc_file', label: 'PUCC File' },
];

const VehicleOnboardingForm = () => {
  const [form, setForm] = useState(initialState);
  const [files, setFiles] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles({ ...files, [e.target.name]: e.target.files?.[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    Object.entries(files).forEach(([key, file]) => {
      if (file instanceof File) {
        formData.append(key, file);
      }
    });

    try {
      await vehicleOnboarding(formData);
      setSuccess(true);
      setForm(initialState);
      setFiles({});
    } catch (err: any) {
      setError(err.message || 'Failed to onboard vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        my: 4,
        p: 4,
        background: '#fff',
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <h4 className="text-xl font-bold mb-8 text-gray-500"> Vehicle Onboarding Form</h4>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Vendor Name *" fullWidth size="medium" />
        </Grid>
        <Grid item xs={12}>
          <TextField label="SPOC Name *" fullWidth size="medium" />
        </Grid>
        <Grid item xs={6}>
          <TextField label="SPOC Phone *" fullWidth size="medium" />
        </Grid>
        <Grid item xs={6}>
          <TextField label="SPOC Email *" fullWidth size="medium" />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Alternate Contact Number" fullWidth size="medium" />
        </Grid>
        <Grid item xs={6}>
          <TextField label="GST Number *" fullWidth size="medium" />
        </Grid>
        <Grid item xs={6}>
          <TextField label="PAN Number *" fullWidth size="medium" />
        </Grid>
        {/* File Uploads */}
        <Grid item xs={6}>
          <InputLabel sx={{ fontWeight: 600, mb: 1 }}>GST Certificate</InputLabel>
          <Button
            variant="outlined"
            component="label"
            sx={{
              color: '#ff9800',
              borderColor: '#ff9800',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { borderColor: '#fb8c00', background: '#fff3e0' },
            }}
            fullWidth
          >
            Choose File
            <input type="file" hidden />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <InputLabel sx={{ fontWeight: 600, mb: 1 }}>PAN Card</InputLabel>
          <Button
            variant="outlined"
            component="label"
            sx={{
              color: '#ff9800',
              borderColor: '#ff9800',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { borderColor: '#fb8c00', background: '#fff3e0' },
            }}
            fullWidth
          >
            Choose File
            <input type="file" hidden />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <InputLabel sx={{ fontWeight: 600, mb: 1 }}>Address Proof</InputLabel>
          <Button
            variant="outlined"
            component="label"
            sx={{
              color: '#ff9800',
              borderColor: '#ff9800',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { borderColor: '#fb8c00', background: '#fff3e0' },
            }}
            fullWidth
          >
            Choose File
            <input type="file" hidden />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <InputLabel sx={{ fontWeight: 600, mb: 1 }}>Cancelled Cheque</InputLabel>
          <Button
            variant="outlined"
            component="label"
            sx={{
              color: '#ff9800',
              borderColor: '#ff9800',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { borderColor: '#fb8c00', background: '#fff3e0' },
            }}
            fullWidth
          >
            Choose File
            <input type="file" hidden />
          </Button>
        </Grid>
        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: 700,
              fontSize: '1.1rem',
              background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
              color: '#fff',
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': {
                background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)',
              },
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VehicleOnboardingForm;