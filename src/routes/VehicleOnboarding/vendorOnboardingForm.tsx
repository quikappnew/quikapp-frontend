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
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: 'linear-gradient(135deg, #e0e7ff 0%, #fffde4 100%)',
        }}
      >
        <Card
          sx={{
            maxWidth: 750,
            width: '100%',
            boxShadow: 8,
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          <CardHeader
            title={
              <Typography
                variant="h4"
                fontWeight={800}
                letterSpacing={1}
                sx={{ color: '#1976d2' }}
              >
                Vehicle Onboarding
              </Typography>
            }
            sx={{
              textAlign: 'center',
              background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              py: 4,
            }}
          />
          <CardContent>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Grid container spacing={3}>
                {/* Form Fields */}
                <Grid item xs={12} md={6}>
                  <TextField label="Vehicle Number" name="vehicle_number" value={form.vehicle_number} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Chassis Number" name="chassis_number" value={form.chassis_number} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Vehicle Owner" name="vehicle_owner" value={form.vehicle_owner} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Vendor" name="vendor" value={form.vendor} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Truck Length (feet)" name="truck_length_feet" value={form.truck_length_feet} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Registration Date" name="registration_date" type="date" value={form.registration_date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Fitness Certificate Expiry" name="fitness_certificate_expiry" type="date" value={form.fitness_certificate_expiry} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Tax Expiry Date" name="tax_expiry_date" type="date" value={form.tax_expiry_date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Insurance Expiry Date" name="insurance_expiry_date" type="date" value={form.insurance_expiry_date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="National Permit Validity" name="national_permit_validity" type="date" value={form.national_permit_validity} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} required />
                </Grid>
                {/* Divider */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2, borderColor: '#1976d2' }} />
                </Grid>
                {/* File Inputs */}
                {fileFields.map((field) => (
                  <Grid item xs={12} md={6} key={field.name}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<CloudUpload />}
                      sx={{
                        borderRadius: 2,
                        border: '2px dashed #1976d2',
                        color: '#1976d2',
                        background: '#f0f7ff',
                        fontWeight: 600,
                        mb: 1,
                        py: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          background: '#e3f2fd',
                          borderColor: '#1565c0',
                          boxShadow: 2,
                        },
                      }}
                    >
                      {field.label}
                      <input type="file" name={field.name} hidden onChange={handleFileChange} />
                    </Button>
                    {files[field.name] && (
                      <Chip
                        label={files[field.name].name}
                        color="primary"
                        size="small"
                        sx={{ mt: 1, fontWeight: 500 }}
                      />
                    )}
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    fullWidth
                    sx={{
                      py: 1.7,
                      fontWeight: 700,
                      fontSize: '1.15rem',
                      borderRadius: 3,
                      background: 'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)',
                      color: '#fff',
                      boxShadow: 3,
                      mt: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #ffa726 0%, #ffd54f 100%)',
                        transform: 'scale(1.03)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                  </Button>
                </Grid>
                {success && (
                  <Grid item xs={12}>
                    <Alert severity="success" sx={{ mt: 2 }}>
                      Vehicle onboarded successfully!
                    </Alert>
                  </Grid>
                )}
                {error && (
                  <Grid item xs={12}>
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
  );
};

export default VehicleOnboardingForm;