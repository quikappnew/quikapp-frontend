import { Box, Grid, Paper, Typography } from '@mui/material';
import { FC } from 'react';

interface TripStatus {
  loading: number;
  scheduled: number;
  inTransit: number;
  unloading: number;
  completed: number;
  cancelled: number;
  paid: number;
  history: number;
}

interface TripStatusOverviewProps {
  statusCounts: TripStatus;
}

const TripStatusOverview: FC<TripStatusOverviewProps> = ({ statusCounts }) => {
  const statusItems = [
    { label: 'Loading', value: statusCounts.loading },
    { label: 'Scheduled', value: statusCounts.scheduled },
    { label: 'In Transit', value: statusCounts.inTransit },
    { label: 'Unloading', value: statusCounts.unloading },
    { label: 'Completed', value: statusCounts.completed },
    { label: 'Cancelled', value: statusCounts.cancelled },
    { label: 'Paid', value: statusCounts.paid },
    { label: 'History', value: statusCounts.history },
  ];

  return (
    <Paper 
      sx={{ 
        p: 3,
        mb: 3,
        borderRadius: 2,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3,
          fontWeight: 500,
          color: '#1a1a1a',
          borderBottom: '1px solid #eee',
          pb: 2
        }}
      >
        Trip Status Overview
      </Typography>
      <Grid container spacing={4}>
        {statusItems.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                bgcolor: '#fff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                  mb: 1,
                  fontWeight: 600,
                  color: '#2196f3'
                }}
              >
                {item.value}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  color: '#666',
                  fontWeight: 500
                }}
              >
                {item.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default TripStatusOverview;