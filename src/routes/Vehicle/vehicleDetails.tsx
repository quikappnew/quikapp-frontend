import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Grid, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import SidebarLayout from 'layouts/SidebarLayout';
import { getVehicleById } from 'services/api';
import dayjs from 'dayjs';

const VehicleDetails = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const response = await getVehicleById(vehicleId!);
        setVehicle(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch vehicle details');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicleId]);

  return (
    <SidebarLayout>
      <Box p={3}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Vehicle Details
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Vehicle Number</Typography>
                  <Typography variant="body1">{vehicle?.vehicle_number}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Owner</Typography>
                  <Typography variant="body1">{vehicle?.vehicle_owner_display}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Vendor</Typography>
                  <Typography variant="body1">{vehicle?.vendor_name || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Truck Length</Typography>
                  <Typography variant="body1">{vehicle?.truck_length_feet || '-'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Created At</Typography>
                  <Typography variant="body1">
                    {vehicle?.created_at ? dayjs(vehicle.created_at).format('YYYY-MM-DD HH:mm') : '-'}
                  </Typography>
                </Grid>
                {/* Add more fields as needed */}
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
    </SidebarLayout>
  );
};

export default VehicleDetails;