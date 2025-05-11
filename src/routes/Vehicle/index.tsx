import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, CircularProgress, Typography, Card } from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import DataTable from 'components/DataTable';
import { getVehicles } from 'services/api';
import { useNavigate } from 'react-router-dom';

const columns = [
  { label: 'Vehicle Number', fieldName: 'vehicle_number', width: 200 },
  { label: 'Owner', fieldName: 'vehicle_owner_display', width: 150 },
  { label: 'Vendor', fieldName: 'vendor_name', width: 150 },
  { label: 'Truck Length', fieldName: 'truck_length_feet', width: 150 },
  { label: 'Created At', fieldName: 'created_at', width: 200 },
  { label: 'Action', fieldName: 'action', width: 150 },
];

const Vehicle = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await getVehicles();
        setVehicles(
          (response.data || []).map((item: any) => ({
            ...item,
            action: (
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate(`/vehicle/${item.id}`)}
              >
                View Details
              </Button>
            ),
          }))
        );
      } catch (err: any) {
        setError(err.message || 'Failed to fetch vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [navigate]);

  return (
    <SidebarLayout>
       <Box sx={{ p: 3 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            background: "#fff",

          }}
        >
        <h4 className="text-xl font-bold mb-3 text-gray-500"> Vehicles</h4>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <DataTable
            data={vehicles}
            columns={columns}
            searchFields={['vehicle_number', 'vehicle_owner_display', 'vendor_name']}
          />
        )}
        </Card>
      </Box>
    </SidebarLayout>
  );
};

export default Vehicle;