import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Divider, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface LocationState {
  location: any;
}

const LocationDetails: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const { state } = useLocation() as { state: LocationState };
  const location = state?.location;
  const navigate = useNavigate();

  const DetailRow = ({ label, value }: { label: string; value: string | undefined }) => (
    <Grid container spacing={2} sx={{ py: 1.5 }}>
      <Grid item xs={12} sm={3}>
        <Typography color="textSecondary" variant="subtitle1" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Typography variant="body1">
          {value || '-'}
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 'lg', margin: '0 auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/locations')}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Locations
      </Button>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
          Location Details
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ py: 2 }}>
          {/* <DetailRow label="ID" value={locationId} /> */}
          <DetailRow label="Name" value={location?.name_of_city} />
          <DetailRow label="Nodal Location" value={location?.nodal_location} />
          <DetailRow label="District" value={location?.district} />
          <DetailRow label="State" value={location?.state} />
          <DetailRow label="Pincode" value={location?.pincode} />
        </Box>
      </Paper>
    </Box>
  );
};

export default LocationDetails; 