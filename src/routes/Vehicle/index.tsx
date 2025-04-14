import { Box, Button, Grid } from '@mui/material';
import Navbar from 'components/Navbar';
import SidebarLayout from 'layouts/SidebarLayout';
import { useState, useMemo } from 'react';
import VehicleModal from './vehicalModal';
import BasicCard from 'components/Card';
import DataTable from 'components/DataTable';
import { getRandomColor } from 'utils/randomColorGenerator';
import { useNavigate } from 'react-router-dom';

const initialList = [
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

const Vehicle = () => {
  const client = 'Sowmya';
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const listWithColors = useMemo(() => {
    return initialList.map(item => ({
      ...item,
      bgColor: getRandomColor(),
    }));
  }, []);

  const handleViewDetails = (vehicle: any) => {
    navigate(`/vehicle/${vehicle.id}`, { state: { vehicle } });
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
      vehicleNumber: 'AP39AB1234',
      status: 'Active',
      model: 'Tata Ace',
      chassisNumber: 'CHAS123XYZ',
      tripCount: 15,
      latestOdometerReading: 12500,
      capacity: 1000,
    },
    {
      id: 2,
      vehicleNumber: 'TS07CD5678',
      status: 'Inactive',
      model: 'Ashok Leyland Dost',
      chassisNumber: 'CHAS456ABC',
      tripCount: 8,
      latestOdometerReading: 8800,
      capacity: 1250,
    },
    {
      id: 3,
      vehicleNumber: 'KA01EF9012',
      status: 'Maintenance',
      model: 'Mahindra Bolero Pickup',
      chassisNumber: 'CHAS789DEF',
      tripCount: 22,
      latestOdometerReading: 21300,
      capacity: 1500,
    },
    {
      id: 4,
      vehicleNumber: 'TN22GH3456',
      status: 'Active',
      model: 'Tata Intra V30',
      chassisNumber: 'CHAS101GHI',
      tripCount: 11,
      latestOdometerReading: 15100,
      capacity: 1300,
    },
  ].map(item => ({
    ...item,
    action: (
      <Button
        variant="contained"
        color="info"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleViewDetails(item);
        }}
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
      <Box display="flex" justifyContent="space-between" marginBottom="20px">
        <Grid container spacing={2}>
          {listWithColors.map(item => (
            <Grid item xs={12} md={6} lg={3} key={item.description}>
              <BasicCard
                key={item.description}
                count={item.count}
                description={item.description}
                bgColor={item.bgColor}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <DataTable
        data={data}
        columns={columns}
        searchFields={['vehicleNumber', 'model', 'status', 'chassisNumber']}
      />
      <VehicleModal open={modalOpen} onClose={handleClose} />
    </SidebarLayout>
  );
};
export default Vehicle;
