import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
} from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import { getOnboardedVehicles } from 'services/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const VehicleOnboardingList = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await getOnboardedVehicles();
        setVehicles(response.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch onboarded vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <SidebarLayout>
      <Box p={3}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Onboarded Vehicles
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehicle Number</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No vehicles onboarded yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      vehicles.map((vehicle: any) => (
                        <TableRow key={vehicle.id}>
                          <TableCell>{vehicle.vehicle_number}</TableCell>
                          <TableCell>{vehicle.vehicle_owner_display}</TableCell>
                          <TableCell>{vehicle.vendor_name || '-'}</TableCell>
                          <TableCell>
                            <Typography
                              color={vehicle.status === 'COMPLETED' ? 'success.main' : 'warning.main'}
                              fontWeight={600}
                            >
                              {vehicle.status}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {vehicle.created_at
                              ? dayjs(vehicle.created_at).format('YYYY-MM-DD HH:mm')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate(`/vehicle-onboarding/${vehicle.id}`)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </SidebarLayout>
  );
};

export default VehicleOnboardingList;