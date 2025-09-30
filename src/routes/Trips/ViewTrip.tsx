import { FC } from 'react';
import SidebarLayout from 'layouts/SidebarLayout';
import TripDetails from './TripDetails';

const ViewTrip: FC = () => {

  return (
    <SidebarLayout>
      <TripDetails />
    </SidebarLayout>
  );
};

export default ViewTrip; 