import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import SidebarLayout from 'layouts/SidebarLayout';

const VehicleDetails = () => {
  const { vehicleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const vehicle = location.state?.vehicle;

  if (!vehicle) {
    return (
      <SidebarLayout>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Vehicle Not Found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/vehicle')}
            sx={{ mt: 2 }}
          >
            Back to Vehicle List
          </Button>
        </Box>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Vehicle Details
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/vehicle')}
          >
            Back to Vehicle List
          </Button>
        </Box>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Vehicle Number
              </Typography>
              <Typography variant="body1">{vehicle.vehicleNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Model
              </Typography>
              <Typography variant="body1">{vehicle.model}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1">{vehicle.status}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Capacity
              </Typography>
              <Typography variant="body1">{vehicle.capacity} kg</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Chassis Number
              </Typography>
              <Typography variant="body1">{vehicle.chassisNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Trip Count
              </Typography>
              <Typography variant="body1">{vehicle.tripCount}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Latest Odometer Reading
              </Typography>
              <Typography variant="body1">{vehicle.latestOdometerReading} km</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Remarks
              </Typography>
              <Typography variant="body1">{vehicle.remarks}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </SidebarLayout>
  );
};

export default VehicleDetails;
