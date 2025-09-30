import { Box, Button, Card, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Divider, Alert } from "@mui/material";
import { useState, FC, useEffect, useCallback } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import SidebarLayout from 'layouts/SidebarLayout';
import { 
  getTripById,
  updateTripWithAudit,
  getVendors,
  getVehicles,
  getOrders
} from 'services/api';
import type { Trip, UpdateTripData } from 'types/api';
import { PaymentStatusEnum } from 'services/api';
import { 
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const EditTrip: FC = () => {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    reference_id: '',
    vendor_id: '',
    order_id: '',
    vehicle_id: '',
    vendor_price: '',
    payment_status: PaymentStatusEnum.PENDING,
    special_instructions: '',
    internal_notes: ''
  });

  // Dropdown options
  const [vendors, setVendors] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const fetchTripDetails = useCallback(async () => {
    if (!tripId) return;
    
    try {
      setLoading(true);
      const tripResponse = await getTripById(tripId);
      setTrip(tripResponse);
      
      // Populate form with current trip data
      setFormData({
        reference_id: tripResponse.referenceId || '',
        vendor_id: tripResponse.vendorId || '',
        order_id: (tripResponse as any).order_id || '',
        vehicle_id: tripResponse.vehicleId || '',
        vendor_price: tripResponse.totalAmount?.toString() || '0',
        payment_status: tripResponse.payment_status || PaymentStatusEnum.PENDING,
        special_instructions: tripResponse.specialInstructions || '',
        internal_notes: tripResponse.internalNotes || ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trip details');
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  const fetchDropdownData = async () => {
    try {
      const [vendorsResponse, vehiclesResponse, ordersResponse] = await Promise.all([
        getVendors(),
        getVehicles(),
        getOrders()
      ]);
      
      setVendors(vendorsResponse.data || []);
      setVehicles(vehiclesResponse.data || []);
      setOrders(ordersResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch dropdown data:', error);
    }
  };

  useEffect(() => {
    fetchTripDetails();
    fetchDropdownData();
  }, [fetchTripDetails]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!tripId) return;

    try {
      setSaving(true);
      
      const updateData: UpdateTripData = {
        referenceId: formData.reference_id,
        vendorId: formData.vendor_id,
        vehicleId: formData.vehicle_id,
        totalAmount: parseFloat(formData.vendor_price) || 0,
        specialInstructions: formData.special_instructions,
        internalNotes: formData.internal_notes,
        // Add other fields as needed based on UpdateTripData interface
      };

      await updateTripWithAudit(tripId, updateData);
      toast.success('Trip updated successfully');
      navigate(`/trips/${tripId}/view`);
    } catch (error) {
      toast.error('Failed to update trip');
      console.error('Update error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <Alert severity="error">
          Error loading trip: {error}
        </Alert>
      </SidebarLayout>
    );
  }

  if (!trip) {
    return (
      <SidebarLayout>
        <Alert severity="info">
          Trip not found
        </Alert>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Box sx={{ p: 3 }}>
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, background: "#fff" }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ borderRadius: 2 }}
              >
                Back
              </Button>
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  Edit Trip
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {trip.referenceId || 'N/A'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/trips/${tripId}/view`)}
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={saving}
                sx={{ borderRadius: 2 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Form */}
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Reference ID"
                value={formData.reference_id}
                onChange={(e) => handleInputChange('reference_id', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vendor Price"
                type="number"
                value={formData.vendor_price}
                onChange={(e) => handleInputChange('vendor_price', e.target.value)}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={formData.payment_status}
                  onChange={(e) => handleInputChange('payment_status', e.target.value)}
                  label="Payment Status"
                >
                  <MenuItem value={PaymentStatusEnum.PENDING}>Pending</MenuItem>
                  <MenuItem value={PaymentStatusEnum.PAID}>Paid</MenuItem>
                  <MenuItem value={PaymentStatusEnum.PARTIALLY_PAID}>Partially Paid</MenuItem>
                  <MenuItem value={PaymentStatusEnum.OVERDUE}>Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Assignment Details */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
                Assignment Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Vendor</InputLabel>
                <Select
                  value={formData.vendor_id}
                  onChange={(e) => handleInputChange('vendor_id', e.target.value)}
                  label="Vendor"
                >
                  {vendors.map((vendor) => (
                    <MenuItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Vehicle</InputLabel>
                <Select
                  value={formData.vehicle_id}
                  onChange={(e) => handleInputChange('vehicle_id', e.target.value)}
                  label="Vehicle"
                >
                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicle_number || vehicle.vehicleNumber}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Order</InputLabel>
                <Select
                  value={formData.order_id}
                  onChange={(e) => handleInputChange('order_id', e.target.value)}
                  label="Order"
                >
                  {orders.map((order) => (
                    <MenuItem key={order.id} value={order.id}>
                      {order.order_id} - {order.client_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Notes */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
                Notes & Instructions
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Special Instructions"
                value={formData.special_instructions}
                onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                placeholder="Enter any special instructions for this trip..."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Internal Notes"
                value={formData.internal_notes}
                onChange={(e) => handleInputChange('internal_notes', e.target.value)}
                placeholder="Enter internal notes (not visible to vendor/client)..."
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/trips/${tripId}/view`)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={saving}
              sx={{ borderRadius: 2 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Card>
      </Box>
    </SidebarLayout>
  );
};

export default EditTrip;
