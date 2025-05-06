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
  Chip,
} from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import { getOnboardedVehicles } from 'services/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const statusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'DOCUMENTS_SUBMITTED':
      return 'warning';
    default:
      return 'default';
  }
};

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
      <Box sx={{ p: { xs: 1, sm: 3 }, background: '#f7f7f9', minHeight: '100vh' }}>
        <Typography variant="h5"  mb={4}>
          Onboarded Vehicles
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
            <CardContent>
              <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ background: '#f0f4f8' }}>
                      <TableCell sx={{ fontWeight: 700 }}>Vehicle Number</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Owner</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Vendor</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Created At</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No vehicles onboarded yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      vehicles.map((vehicle: any) => (
                        <TableRow
                          key={vehicle.id}
                          hover
                          sx={{
                            transition: 'background 0.2s',
                            '&:hover': { background: '#f5faff' },
                          }}
                        >
                          <TableCell>{vehicle.vehicle_number}</TableCell>
                          <TableCell>{vehicle.vehicle_owner_display}</TableCell>
                          <TableCell>{vehicle.vendor_name || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={vehicle.status}
                              color={statusColor(vehicle.status)}
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.6rem',
                                px: 1.5,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {vehicle.created_at
                              ? dayjs(vehicle.created_at).format('YYYY-MM-DD HH:mm')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="info"
                              size="small"
                              sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2,
                                boxShadow: 1,
                                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                                color: '#fff',
                                '&:hover': {
                                  background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)',
                                },
                              }}
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