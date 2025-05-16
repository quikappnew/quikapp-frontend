import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Alert, Grid, Button,  Link as MuiLink, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarLayout from 'layouts/SidebarLayout';
import { getVehicleOnboardingDetails, updateVehicleOnboarding } from 'services/api';
import { getAbsoluteUrl } from 'utils/commonFunctions';
import { toast } from 'react-toastify';


const VehicleDetailsComponent = ({ vehicle, onApprove, onReject }: any) => {
  if (!vehicle) return null;
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={2} color="#ff9800">
          Vehicle Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>Vehicle Number:</Typography> <Typography component="span" sx={{ ml: 1 }}>{vehicle.vehicle_number}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>Chassis Number:</Typography> <Typography component="span" sx={{ ml: 1 }}>{vehicle.chassis_number}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>Owner:</Typography> <Typography component="span" sx={{ ml: 1 }}>{vehicle.vehicle_owner_display}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>Vendor:</Typography> <Typography component="span" sx={{ ml: 1 }}>{vehicle.vendor_name || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>Truck Length:</Typography> <Typography component="span" sx={{ ml: 1 }}>{vehicle.truck_length_display}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>Registration Date:</Typography> <Typography component="span" sx={{ ml: 1 }}>{vehicle.registration_date}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>Fitness Certificate Expiry:</Typography> <Typography component="span" sx={{ ml: 1 }}>{vehicle.fitness_certificate_expiry}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>Tax Expiry Date:</Typography> <Typography component="span" sx={{ ml: 1 }}>{vehicle.tax_expiry_date}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>Insurance Expiry Date:</Typography> <Typography component="span" sx={{ ml: 1 }}>{vehicle.insurance_expiry_date}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>National Permit Validity:</Typography> <Typography component="span" sx={{ ml: 1 }}>{vehicle.national_permit_validity}</Typography>
          </Grid>
          {/* File Links */}
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>Fitness Certificate:</Typography> <MuiLink href={getAbsoluteUrl(vehicle.fitness_certificate)} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 500, color: '#7c3aed' }}>View</MuiLink>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>Tax Certificate:</Typography> <MuiLink href={getAbsoluteUrl(vehicle.tax_certificate)} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 500, color: '#7c3aed' }}>View</MuiLink>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>Insurance:</Typography> <MuiLink href={getAbsoluteUrl(vehicle.insurance)} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 500, color: '#7c3aed' }}>View</MuiLink>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>National Permit:</Typography> <MuiLink href={getAbsoluteUrl(vehicle.national_permit)} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 500, color: '#7c3aed' }}>View</MuiLink>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>RC Documents:</Typography> <MuiLink href={getAbsoluteUrl(vehicle.rc_documents)} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 500, color: '#7c3aed' }}>View</MuiLink>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>PUCC:</Typography> <MuiLink href={getAbsoluteUrl(vehicle.pucc)} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: 500, color: '#7c3aed' }}>View</MuiLink>
          </Grid>
          {/* Status */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Box sx={{ background: '#ff9800', color: '#fff', px: 2, py: 0.5, borderRadius: 3, fontWeight: 600, fontSize: 16, mr: 1 }}>
                {vehicle.status}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="span" sx={{ fontWeight: 700 }}>Created At:</Typography> <Typography component="span" sx={{ ml: 1 }}>{vehicle.created_at}</Typography>
          </Grid>
        </Grid>
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="success" sx={{ background: '#388e3c', fontWeight: 600, px: 4, borderRadius: 2 }} onClick={onApprove} disabled={vehicle.status == 'approved'}>Approve</Button>
          <Button variant="contained" color="error" sx={{ background: '#d32f2f', fontWeight: 600, px: 4, borderRadius: 2 }} onClick={onReject} disabled={vehicle.status == 'rejected'}>Reject</Button>
        </Box>
      </Card>
    </Box>
  );
};

const VehicleDetails = () => {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await getVehicleOnboardingDetails(id!);
        setVehicle(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch vehicle details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleApprove = async () => {
    const formData = new FormData();
    formData.append('status', 'approved');
    const response = await updateVehicleOnboarding(id!, formData);
    console.log(response);
    if (response.success) {
      toast.success('Vehicle approved successfully'); 
      setTimeout(() => {
        navigate('/vehicle');
      }, 3000);
    } else {
      toast.error('Failed to approve!');
    }
  };
  const handleReject = async () => {
    const formData = new FormData();
    formData.append('status', 'rejected');
    const response = await updateVehicleOnboarding(id!, formData);
    if (response.success) {
      toast.success('Vehicle rejected successfully');
      navigate('/vehicle');
    } else {
      toast.error('Failed to reject!');
    }
  };

  return (
    <SidebarLayout>
      <Box p={3}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <VehicleDetailsComponent vehicle={vehicle} onApprove={handleApprove} onReject={handleReject} />
        )}
      </Box>
    </SidebarLayout>
  );
};

export default VehicleDetails;