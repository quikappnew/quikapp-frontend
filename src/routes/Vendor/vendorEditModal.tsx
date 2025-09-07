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
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateVendor, getVendor, type Vendor } from '../../services/api';

interface VendorEditModalProps {
  open: boolean;
  onClose: () => void;
  vendorId: string;
  onSuccess: () => void;
}

interface VendorFormData {
  name: string;
  pan: string;
  spoc_name: string;
}

const VendorEditModal: React.FC<VendorEditModalProps> = ({
  open,
  onClose,
  vendorId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    pan: '',
    spoc_name: '',
  });

  // Fetch vendor data when modal opens
  useEffect(() => {
    if (open && vendorId) {
      fetchVendorData();
    }
  }, [open, vendorId]);

  const fetchVendorData = async () => {
    try {
      setFetching(true);
      const response = await getVendor(vendorId);
      const vendor: Vendor = response.data;
      
      setFormData({
        name: vendor.name || '',
        pan: vendor.pan || '',
        spoc_name: vendor.spoc_name || '',
      });
    } catch (error) {
      toast.error('Failed to fetch vendor details');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.pan.trim() || !formData.spoc_name.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await updateVendor(vendorId, {
        name: formData.name.trim(),
        pan: formData.pan.trim(),
        spoc_name: formData.spoc_name.trim(),
      });
      
      toast.success('Vendor updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update vendor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
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
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Edit Vendor
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {fetching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Vendor Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                margin="normal"
                InputLabelProps={{ sx: { fontWeight: 600 } }}
                disabled={loading}
              />
              
              <TextField
                fullWidth
                label="PAN Number"
                name="pan"
                value={formData.pan}
                onChange={handleInputChange}
                required
                margin="normal"
                InputLabelProps={{ sx: { fontWeight: 600 } }}
                disabled={loading}
              />
              
              <TextField
                fullWidth
                label="SPOC Name"
                name="spoc_name"
                value={formData.spoc_name}
                onChange={handleInputChange}
                required
                margin="normal"
                InputLabelProps={{ sx: { fontWeight: 600 } }}
                disabled={loading}
              />
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
            {loading ? 'Updating...' : 'Update Vendor'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VendorEditModal;
