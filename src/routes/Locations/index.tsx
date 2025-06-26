import { Box, Button, Grid } from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import { useState, useMemo, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import LocationModal from './locationModal';
import BasicCard from 'components/Card';
import DataTable from 'components/DataTable';
import ConfirmationModal from './confrimationModal';
import ConfirmButton from 'components/ConfirmButton';
import { getRandomColor } from 'utils/randomColorGenerator';
import api, { deleteLocation, getLocationList } from 'services/api';
import dayjs from 'dayjs';

export interface Order {
  id: string;
  order_id: string;
  order_date: string;
  order_pricing: number;
  from_location_name: string;
  to_location_name: string;
  client_name: string;
  created_at: string;
}

const Locations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDetailsView = location.pathname.includes('/locations/') && location.pathname !== '/locations';
  const client = 'Sowmya';
  const [locationList, setLocationList] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

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

  useEffect(() => {
    getLocationList().then((res) => {
      setLocationList(res.data);
    });
  }, []);

  

  // Memoize the generated colors
  const cardColors = useMemo(() => {
    return list.map(() => getRandomColor());
  }, []); // Empty dependency array ensures colors are generated only once

  const handleDelete = async (locationName: string, id: string) => {
    try {
      setLoading(id);
      await deleteLocation(id);
      // Refresh the location list after successful deletion
      const response = await getLocationList();
      setLocationList(response.data);
    } catch (error) {
      
    } finally {
      setLoading(null);
    }
  };

  const columns = [
    // { label: 'Nodal Name', fieldName: 'nodalLocationName', width: 200 },
    { label: 'Location Name', fieldName: 'name_of_city', width: 200 },
    { label: 'District', fieldName: 'district', width: 150 },
    { label: 'State', fieldName: 'state', width: 150 },
    { label: 'Pin Code', fieldName: 'pincode', width: 200 },
    { label: 'Created at', fieldName: 'created_at', width: 150 },
    // { label: ' Date', fieldName: 'createdDate', width: 150 },
    { label: 'Action', fieldName: 'action', width: 150 },
  ];

  const data = locationList.map(item => ({
    ...item,
    created_at: dayjs(item.created_at).format('MMMM D, YYYY'),
    action: (
      <ConfirmButton
        onConfirm={async () => {
          await handleDelete(item.name_of_city, item.id);
        }}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${item.name_of_city}?`}
        buttonText="Delete"
        color="error"
        variant="contained"
        loading={loading === item.id}
      />
    ),
  }));

  return (
    <SidebarLayout>
      {!isDetailsView ? (
        <>
          {/* <h2 style={{ marginBottom: '20px' }}>Welcome {client}</h2> */}
          <Button
            variant="contained"
            color="info"
            onClick={handleOpen}
            style={{ marginBottom: '20px' }}
          >
            Add Location
          </Button>
          <Box display="flex" justifyContent="space-between" marginBottom="20px">
            <Grid container spacing={2}>
              {list.map((item, index) => (
                <Grid item xs={12} md={6} lg={6} key={item.count}>
                  <BasicCard key={item.count} count={item.count} description={item.description} bgColor={cardColors[index]} />
                </Grid>
              ))}
            </Grid>
          </Box>
          <DataTable
            data={data}
            columns={columns}
            searchFields={['name_of_city', 'district', 'state', 'pincode']}
            onClick={item => {
              // Only navigate if not clicking the action column
              const { action, ...locationData } = item;
              if (action) return;
              navigate(`/locations/${item.id}`, { state: { location: locationData } });
            }}
          />
          <LocationModal open={modalOpen} onClose={handleClose} />
          <ConfirmationModal />
        </>
      ) : (
        <Outlet />
      )}
    </SidebarLayout>
  );
};
export default Locations;
