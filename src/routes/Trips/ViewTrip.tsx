import { FC } from 'react';
import { useParams } from 'react-router-dom';
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