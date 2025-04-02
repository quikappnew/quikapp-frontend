import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import TripDetails from './TripDetails';


const ViewTrip: FC = () => {
  const { tripId } = useParams<{ tripId: string }>();

  // Mock data - replace with actual API call
  const tripData = {
    tripNumber: 'Rp00000544',
    referenceId: '116PXG227',
    fromLocation: {
      city: 'MPNA Pune',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '410501'
    },
    toLocation: {
      city: 'SBCZ Bengaluru',
      district: 'Bengaluru',
      state: 'Karnataka',
      pincode: '562149'
    },
    createdBy: 'meena',
    createdDate: 'April 2, 2025, 1:34 p.m.',
    haltingDays: 'No halting days recorded',
    comments: []
  };

  return (
    <SidebarLayout>
      <Box sx={{ p: 3 }}>
        <TripDetails {...tripData} />
      </Box>
    </SidebarLayout>
  );
};

export default ViewTrip; 