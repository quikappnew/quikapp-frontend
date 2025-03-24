import { Box, Button, Grid } from '@mui/material';
import Navbar from 'components/Navbar';
import SidebarLayout from 'layouts/SidebarLayout';
import { useState } from 'react';
import VehicleModal from './vehicalModal';
import BasicCard from 'components/Card';
import DataTable from 'components/DataTable';
const Vehicle = () => {
  const client = 'Sowmya';
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const list = [
    {
      count: 4,
      description: 'Total Vehicles',
    },
    {
      count: 10,
      description: 'Own fleet',
    },
    {
      count: 20,
      description: 'Maret fleet',
    },
    {
      count: 10,
      description: 'Active fleet',
    },
  ];
  const handleViewTrips = (vehicleNumber: string) => {
    // Implement the logic to view trips for the selected client
    console.log(`Viewing trips for ${vehicleNumber}`);
  };

  const columns = [
    { label: 'Vehicle Number', fieldName: 'vehicleNumber', width: 200 },
    { label: 'Model', fieldName: 'model', width: 150 },
    { label: 'Status', fieldName: 'status', width: 150 },
    { label: 'Capacity', fieldName: 'capacity', width: 150 },
    { label: 'Chassis Number', fieldName: 'chassisNumber', width: 150 },
    { label: 'Trip Count', fieldName: 'tripCount', width: 150 },
    { label: 'Latest Odometer Reading', fieldName: 'latestOdometerReading', width: 150 },
    { label: 'Action', fieldName: 'action', width: 150 },
  ];

  const data = [
    {
      id: 1,
      vehicleNumber: 'Test Client',
      status: 'Active',
      model: 'GST123',
      chassisNumber: 'PAN123',
      tripCount: 'John Doe',
      latestOdometerReading: 'John Doe',
      capacity: 1000,
    },
    {
      id: 2,
      vehicleNumber: 'Test Client1',
      status: 'Active',
      model: 'GST123',
      chassisNumber: 'PAN123',
      tripCount: 'John Doe',
      latestOdometerReading: 'John Doe',
      capacity: 1000,
    },
    {
      id: 3,
      vehicleNumber: 'Test Client2',
      status: 'Active',
      model: 'GST123',
      chassisNumber: 'PAN123',
      tripCount: 'John Doe',
      latestOdometerReading: 'John Doe',
      capacity: 1000,
    },
    {
      id: 4,
      vehicleNumber: 'Test Client3',
      status: 'Active',
      model: 'GST123',
      chassisNumber: 'PAN123',
      tripCount: 'John Doe',
      latestOdometerReading: 'John Doe',
      capacity: 1000,
    },
  ].map(item => ({
    ...item,
    action: (
      <Button
        variant="contained"
        color="info"
        size="small"
        onClick={() => handleViewTrips(item.vehicleNumber)}
      >
        View Details
      </Button>
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
        Add Vehicle
      </Button>
      <Box display="flex" justifyContent="space-between">
        <Grid container spacing={2}>
          {list.map(item => (
            <Grid item xs={12} md={6} lg={6} key={item.count}>
              <BasicCard key={item.count} count={item.count} description={item.description} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <DataTable data={data} columns={columns} />
      <VehicleModal open={modalOpen} onClose={handleClose} />
    </SidebarLayout>
  );
};
export default Vehicle;
