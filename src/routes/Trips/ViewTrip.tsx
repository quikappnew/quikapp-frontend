import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Paper, Typography, Grid, Divider } from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';

const ViewTrip: FC = () => {
  const { tripId } = useParams<{ tripId: string }>();

  // Mock data - replace with actual API call
  const tripDetails = {
    tripName: 'Test Trip',
    tripNumber: 'Trip123',
    tripStatus: 'Active',
    createdAt: '2021-01-01',
    source: 'Mumbai',
    destination: 'Delhi',
    driver: {
      name: 'John Doe',
      phone: '+91 9876543210',
      licenseNumber: 'DL123456',
    },
    vehicle: {
      number: 'MH01AB1234',
      type: 'Truck',
      capacity: '10 tons',
    },
  };

  return (
    <SidebarLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Trip Details
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Trip Name
              </Typography>
              <Typography variant="body1">{tripDetails.tripName}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Trip Number
              </Typography>
              <Typography variant="body1">{tripDetails.tripNumber}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1">{tripDetails.tripStatus}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">{tripDetails.createdAt}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Route Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Source
              </Typography>
              <Typography variant="body1">{tripDetails.source}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Destination
              </Typography>
              <Typography variant="body1">{tripDetails.destination}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Driver Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Driver Name
              </Typography>
              <Typography variant="body1">{tripDetails.driver.name}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone Number
              </Typography>
              <Typography variant="body1">{tripDetails.driver.phone}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                License Number
              </Typography>
              <Typography variant="body1">{tripDetails.driver.licenseNumber}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Vehicle Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Vehicle Number
              </Typography>
              <Typography variant="body1">{tripDetails.vehicle.number}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Vehicle Type
              </Typography>
              <Typography variant="body1">{tripDetails.vehicle.type}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Capacity
              </Typography>
              <Typography variant="body1">{tripDetails.vehicle.capacity}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </SidebarLayout>
  );
};

export default ViewTrip; 