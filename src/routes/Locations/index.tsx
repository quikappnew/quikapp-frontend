import { Box, Button, Grid } from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import { useState } from 'react';
import LocationModal from './locationModal';
import BasicCard from 'components/Card';
import DataTable from 'components/DataTable';
import ConfirmationModal from './confrimationModal';
import ConfirmButton from 'components/ConfirmButton';
import { getRandomColor } from 'utils/randomColorGenerator';

const Locations = () => {
  const client = 'Sowmya';
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const list = [
    {
      count: 4,
      description: 'Total Number Clients',
    },
    {
      count: 10,
      description: 'TotalNumber of Trips',
    },
  ];
  const handleOpenConfirmationModal = (locationName: string) => {
    // Implement the logic to view trips for the selected client
    console.log(`Viewing trips for ${locationName}`);
  };

  const columns = [
    { label: 'Location Name', fieldName: 'locationName', width: 200 },
    { label: 'District', fieldName: 'district', width: 150 },
    { label: 'State', fieldName: 'state', width: 150 },
    { label: 'Pin Code', fieldName: 'pinCode', width: 200 },
    { label: 'Action', fieldName: 'action', width: 150 },
  ];

  const data = [
    {
      id: 1,
      locationName: 'Location 1',
      district: 'District 1',
      state: 'State 1',
      pinCode: '123456',
    },
    {
      id: 2,
      locationName: 'Location 2',
      district: 'District 2',
      state: 'State 2',
      pinCode: '123456',
    },
    {
      id: 3,
      locationName: 'Location 3',
      district: 'District 3',
      state: 'State 3',
      pinCode: '123456',
    },
    {
      id: 4,
      locationName: 'Location 4',
      district: 'District 4',
      state: 'State 4',
      pinCode: '123456',
    },
  ].map(item => ({
    ...item,
    action: (
      <ConfirmButton
        onConfirm={async () => {
          // Add your delete logic here
          console.log('Deleting location:', item.locationName);
          // Call the actual delete function here
          handleOpenConfirmationModal(item.locationName); // You might want to remove this if the modal handles everything
          return Promise.resolve();
        }}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${item.locationName}?`}
        buttonText="Delete"
        color="error"
        variant="contained"
      />
    ),
  }));

  return (
    <SidebarLayout>
      {/* <Navbar title="Client" subTitle="Client" /> */}
      <h2 style={{ marginBottom: '20px' }}>Welcome {client}</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{ marginBottom: '20px' }}
      >
        Add Location
      </Button>
      <Box display="flex" justifyContent="space-between">
        <Grid container spacing={2}>
          {list.map(item => (
            <Grid item xs={12} md={6} lg={6} key={item.count}>
              <BasicCard key={item.count} count={item.count} description={item.description} bgColor={getRandomColor()} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <DataTable
        data={data}
        columns={columns}
        searchFields={['locationName', 'district', 'state', 'pinCode']}
      />
      <LocationModal open={modalOpen} onClose={handleClose} />
      <ConfirmationModal />
    </SidebarLayout>
  );
};
export default Locations;
