import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  FormControl,
  FormHelperText,
  Grid,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateVendorOnboarding, getVendorOnboarding } from '../../services/api';

interface VendorOnboardingEditModalProps {
  open: boolean;
  onClose: () => void;
  onboardingId: string;
  onSuccess: () => void;
}

interface VendorOnboardingFormData {
  name: string;
  pan: string;
  pan_card_file: File | null;
  aadhaar_card_file: File | null;
}

const VendorOnboardingEditModal: React.FC<VendorOnboardingEditModalProps> = ({
  open,
  onClose,
  onboardingId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<VendorOnboardingFormData>({
    name: '',
    pan: '',
    pan_card_file: null,
    aadhaar_card_file: null,
  });

  // Fetch vendor onboarding data when modal opens
  useEffect(() => {
    if (open && onboardingId) {
      fetchVendorOnboardingData();
    }
  }, [open, onboardingId]);

  const fetchVendorOnboardingData = async () => {
    try {
      setFetching(true);
      const response = await getVendorOnboarding();
      // Find the specific onboarding record by ID
      const onboardingRecord = response.data?.find((item: any) => item.id === onboardingId);
      
      if (onboardingRecord) {
        setFormData({
          name: onboardingRecord.name || '',
          pan: onboardingRecord.pan || '',
          pan_card_file: null, // Files need to be re-uploaded
          aadhaar_card_file: null, // Files need to be re-uploaded
        });
      }
    } catch (error) {
      toast.error('Failed to fetch vendor onboarding details');
      onClose();
    } finally {
      setFetching(false);
    }
  };

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

    // Basic validation
    if (!formData.name.trim() || !formData.pan.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate required files are present
    const requiredFiles = ['pan_card_file', 'aadhaar_card_file'];
    const missingFiles = requiredFiles.filter(file => !formData[file as keyof VendorOnboardingFormData]);
    
    if (missingFiles.length > 0) {
      toast.error('Please upload all required documents');
      return;
    }

    setLoading(true);

    try {
      // Create FormData object
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append('name', formData.name.trim());
      submitFormData.append('pan', formData.pan.trim());

      // Add file fields
      if (formData.pan_card_file) {
        submitFormData.append('pan_card_file', formData.pan_card_file);
      }
      if (formData.aadhaar_card_file) {
        submitFormData.append('aadhaar_card_file', formData.aadhaar_card_file);
      }

      await updateVendorOnboarding(onboardingId, submitFormData);
      
      toast.success('Vendor onboarding updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update vendor onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
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
              disabled={loading}
            />
            <label htmlFor={id} style={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  component="span"
                  disabled={loading}
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
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Edit Vendor Onboarding
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {fetching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
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
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="PAN Number"
                    name="pan"
                    value={formData.pan}
                    onChange={handleInputChange}
                    required
                    InputLabelProps={{ sx: { fontWeight: 600 } }}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FileInput
                    label="PAN Card"
                    id="pan-card-edit"
                    name="pan_card_file"
                    value={formData.pan_card_file}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FileInput
                    label="Aadhaar Card"
                    id="aadhaar-card-edit"
                    name="aadhaar_card_file"
                    value={formData.aadhaar_card_file}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading || fetching}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading || fetching}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {loading ? 'Updating...' : 'Update Vendor Onboarding'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VendorOnboardingEditModal;
