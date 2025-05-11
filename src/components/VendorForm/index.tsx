import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
  FormHelperText,
  Card,
} from '@mui/material';
import { vendorOnboarding } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface VendorFormData {
  name: string;
  spoc_name: string;
  spoc_phone: string;
  spoc_email: string;
  alternate_contact_number: string;
  gst: string;
  pan: string;
  gst_certificate_file: File | null;
  pan_card_file: File | null;
  address_proof_file: File | null;
  cancelled_cheque_file: File | null;
}

const VendorForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    spoc_name: '',
    spoc_phone: '',
    spoc_email: '',
    alternate_contact_number: '',
    gst: '',
    pan: '',
    gst_certificate_file: null,
    pan_card_file: null,
    address_proof_file: null,
    cancelled_cheque_file: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
      // Clear error state when file is selected
      setTouched(prev => ({
        ...prev,
        [fieldName]: false
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = Object.keys(formData);
    const newTouched = allFields.reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {});
    setTouched(newTouched);

    // Validate all required files are present
    const requiredFiles = [
      'gst_certificate_file',
      'pan_card_file',
      'address_proof_file',
      'cancelled_cheque_file'
    ];
    
    const missingFiles = requiredFiles.filter(file => !formData[file as keyof VendorFormData]);
    
    if (missingFiles.length > 0) {
      setSnackbar({
        open: true,
        message: 'Please upload all required documents',
        severity: 'error'
      });
      return;
    }

    setLoading(true);

    try {
      // Create FormData object
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append('name', formData.name);
      submitFormData.append('spoc_name', formData.spoc_name);
      submitFormData.append('spoc_phone', formData.spoc_phone);
      submitFormData.append('spoc_email', formData.spoc_email);
      submitFormData.append('alternate_contact_number', formData.alternate_contact_number);
      submitFormData.append('gst', formData.gst);
      submitFormData.append('pan', formData.pan);

      // Add file fields
      if (formData.gst_certificate_file) {
        submitFormData.append('gst_certificate_file', formData.gst_certificate_file);
      }
      if (formData.pan_card_file) {
        submitFormData.append('pan_card_file', formData.pan_card_file);
      }
      if (formData.address_proof_file) {
        submitFormData.append('address_proof_file', formData.address_proof_file);
      }
      if (formData.cancelled_cheque_file) {
        submitFormData.append('cancelled_cheque_file', formData.cancelled_cheque_file);
      }

      // Call API
      await vendorOnboarding(submitFormData);
      
      setSnackbar({
        open: true,
        message: 'Vendor onboarded successfully!',
        severity: 'success',
      });

      // Navigate to vendor list after successful submission
      setTimeout(() => {
        navigate('/vendor/list');
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbar({
        open: true,
        message: 'Error onboarding vendor. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const FileInput = ({ label, id, name, value }: { label: string; id: string; name: string; value: File | null }) => {
    const isError = touched[name] && !value;
    
    return (
      <FormControl fullWidth error={isError} sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom color="textPrimary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <input
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              id={id}
              name={name}
              type="file"
              onChange={(e) => handleFileChange(e, name)}
            />
            <label htmlFor={id} style={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  component="span"
                  sx={{
                    textTransform: 'none',
                    minWidth: '120px',
                    borderColor: isError ? '#d32f2f' : undefined,
                    color: isError ? '#d32f2f' : undefined,
                    '&:hover': {
                      borderColor: isError ? '#d32f2f' : undefined,
                    },
                    fontWeight: 600,
                    borderRadius: 2
                  }}
                >
                  Choose File
                </Button>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isError ? '#d32f2f' : 'text.secondary',
                    flexGrow: 1
                  }}
                >
                  {value ? value.name : 'No file chosen'}
                </Typography>
              </Box>
            </label>
          </Box>
        </Box>
        {isError && (
          <FormHelperText 
            error 
            sx={{ 
              color: '#d32f2f',
              marginLeft: 0,
              marginTop: 1
            }}
          >
            This file is required
          </FormHelperText>
        )}
      </FormControl>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafbfc', py: 6 }}>
      <Card sx={{ p: 4, maxWidth: 600, mx: 'auto', my: 4, borderRadius: 3, boxShadow: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          Vendor Onboarding Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vendor Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                InputLabelProps={{ sx: { fontWeight: 600 } }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SPOC Name"
                name="spoc_name"
                value={formData.spoc_name}
                onChange={handleInputChange}
                required
                InputLabelProps={{ sx: { fontWeight: 600 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SPOC Phone"
                name="spoc_phone"
                value={formData.spoc_phone}
                onChange={handleInputChange}
                required
                InputLabelProps={{ sx: { fontWeight: 600 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SPOC Email"
                name="spoc_email"
                type="email"
                value={formData.spoc_email}
                onChange={handleInputChange}
                required
                InputLabelProps={{ sx: { fontWeight: 600 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alternate Contact Number"
                name="alternate_contact_number"
                value={formData.alternate_contact_number}
                onChange={handleInputChange}
                InputLabelProps={{ sx: { fontWeight: 600 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GST Number"
                name="gst"
                value={formData.gst}
                onChange={handleInputChange}
                required
                InputLabelProps={{ sx: { fontWeight: 600 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="PAN Number"
                name="pan"
                value={formData.pan}
                onChange={handleInputChange}
                required
                InputLabelProps={{ sx: { fontWeight: 600 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileInput
                label="GST Certificate"
                id="gst-certificate"
                name="gst_certificate_file"
                value={formData.gst_certificate_file}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileInput
                label="PAN Card"
                id="pan-card"
                name="pan_card_file"
                value={formData.pan_card_file}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileInput
                label="Address Proof"
                id="address-proof"
                name="address_proof_file"
                value={formData.address_proof_file}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileInput
                label="Cancelled Cheque"
                id="cancelled-cheque"
                name="cancelled_cheque_file"
                value={formData.cancelled_cheque_file}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="info"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                fullWidth
                sx={{ borderRadius: 2, py: 1.5, fontSize: 18, mt: 2 }}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Card>
    </Box>
  );
};

export default VendorForm; 