import React, { useState, useEffect, FC } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Chip
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { createPayment, getTripById } from 'services/api';
import type { CreatePaymentData, Trip, PaymentTypeEnum, PaymentModeEnum } from 'types/api';

const CreatePayment: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('tripId');

  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreatePaymentData>({
    tripId: tripId || '',
    type: 'ADVANCE' as PaymentTypeEnum,
    mode: 'BANK_TRANSFER' as PaymentModeEnum,
    amount: 0,
    utrNumber: '',
    transactionDate: dayjs().format('YYYY-MM-DD'),
    description: '',
    notes: ''
  });

  useEffect(() => {
    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const tripData = await getTripById(tripId!);
      setTrip(tripData);
    } catch (err) {
      setError('Failed to fetch trip details');

    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tripId || !formData.amount || formData.amount <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await createPayment(formData);
      toast.success('Payment created successfully');
      navigate(-1); // Go back to previous page
    } catch (err) {
      toast.error('Failed to create payment');

    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreatePaymentData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading && !trip) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: "#fff", maxWidth: 800, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ 
              backgroundColor: '#f0f0f0', 
              '&:hover': { backgroundColor: '#e0e0e0' } 
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Create Payment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add a new payment record
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Trip Information */}
        {trip && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Trip Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Reference ID</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {trip.referenceId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Route</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {trip.fromLocation} → {trip.toLocation}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Vendor</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {trip.vendorName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  ₹{trip.totalAmount?.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  label="Payment Type"
                >
                  <MenuItem value="ADVANCE">Advance</MenuItem>
                  <MenuItem value="FINAL">Final</MenuItem>
                  <MenuItem value="PARTIAL">Partial</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  value={formData.mode}
                  onChange={(e) => handleInputChange('mode', e.target.value)}
                  label="Payment Mode"
                >
                  <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="NEFT">NEFT</MenuItem>
                  <MenuItem value="RTGS">RTGS</MenuItem>
                  <MenuItem value="IMPS">IMPS</MenuItem>
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="CHEQUE">Cheque</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount (₹)"
                type="text"
                value={formData.amount || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  const numValue = parseFloat(value) || 0;
                  handleInputChange('amount', numValue);
                }}
                required
                placeholder="Enter amount"
                inputProps={{
                  inputMode: 'decimal',
                  pattern: '[0-9]*[.]?[0-9]*'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Transaction Date"
                type="date"
                value={formData.transactionDate}
                onChange={(e) => handleInputChange('transactionDate', e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="UTR Number"
                value={formData.utrNumber}
                onChange={(e) => handleInputChange('utrNumber', e.target.value)}
                placeholder="Enter UTR/Transaction ID"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Payment description"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes"
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Create Payment'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  );
};

export default CreatePayment;
