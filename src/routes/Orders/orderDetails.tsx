import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, Order, getTrips } from 'services/api';
import SidebarLayout from 'layouts/SidebarLayout';
import OrderAuditLogs from 'components/OrderAuditLogs';
import OrderAuditSummary from 'components/OrderAuditLogs/OrderAuditSummary';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import dayjs from 'dayjs';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trips, setTrips] = useState<any[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getOrderById(id!);
  
      setOrder(response.data);
      
      // Fetch trips if order has trips
      if (response.data.order_status?.has_trips) {
        await fetchTrips();
      }
    } catch (err: any) {
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrips = async () => {
    setTripsLoading(true);
    try {
      const response = await getTrips();
      // Filter trips for this specific order
      const orderTrips = response.data.filter((trip: any) => trip.order_id === id);
      setTrips(orderTrips);
    } catch (err: any) {

    } finally {
      setTripsLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Order Details
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/orders/get-orders')}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Back to List
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
              <CircularProgress color="primary" sx={{ mb: 2 }} />
              <Typography color="text.secondary">Loading...</Typography>
            </Box>
          ) : order ? (
            <Grid container spacing={3}>
              {/* Order Information */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                      Order Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
                        <Typography variant="body1" fontWeight={500}>{order.order_id}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Order Date</Typography>
                        <Typography variant="body1">{order.order_date || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Pricing</Typography>
                        <Typography variant="body1" fontWeight={500} color="primary.main">
                          ₹{order.order_pricing?.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Client</Typography>
                        <Typography variant="body1">{order.client_name}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">From Location</Typography>
                        <Typography variant="body1">{order.from_location_name}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">To Location</Typography>
                        <Typography variant="body1">{order.to_location_name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                        <Typography variant="body1">{dayjs(order.created_at).format('MMM DD, YYYY HH:mm')}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Updated At</Typography>
                        <Typography variant="body1">{order.updated_at ? dayjs(order.updated_at).format('MMM DD, YYYY HH:mm') : 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Order Status & Creator */}
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                      Status & Creator
                    </Typography>
                    
                    {/* Order Status */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Trip Status
                      </Typography>
                      {order.order_status?.has_trips ? (
                        <Box>
                          <Chip 
                            label={order.order_status.status} 
                            color="success" 
                            variant="filled"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {order.order_status.trip_count} trip{order.order_status.trip_count !== 1 ? 's' : ''} created
                          </Typography>
                        </Box>
                      ) : (
                        <Chip 
                          label={order.order_status?.status || 'Pending Trip Creation'} 
                          color="warning" 
                          variant="filled"
                        />
                      )}
                    </Box>

                                         {/* Creator Information */}
                     <Box>
                       <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                         Created By
                       </Typography>
                      {order.order_created_by ? (
                        <>
                          <Typography variant="body1" fontWeight={500}>
                            {order.order_created_by?.full_name || order.order_created_by?.username || 'Unknown User'}
                          </Typography>
                          {order.order_created_by?.phone_number && (
                            <Typography variant="body2" color="text.secondary">
                              {order.order_created_by.phone_number}
                            </Typography>
                          )}
                          {order.order_created_by?.id && (
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mt: 0.5 }}>
                              ID: {order.order_created_by.id}
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          Creator information not available
                        </Typography>
                      )}
                     </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Trip Details */}
              {order.order_status?.has_trips && (
                <Grid item xs={12}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                        Trip Details
                      </Typography>
                      {tripsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                          <CircularProgress size={24} />
                        </Box>
                      ) : trips.length > 0 ? (
                        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                                <TableCell>Reference ID</TableCell>
                                <TableCell>Vendor</TableCell>
                                <TableCell>From</TableCell>
                                <TableCell>To</TableCell>
                                <TableCell>Payment Status</TableCell>
                                <TableCell>Latest Status</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {trips.map((trip) => (
                                <TableRow key={trip.id}>
                                  <TableCell>{trip.reference_id}</TableCell>
                                  <TableCell>{trip.vendor_name}</TableCell>
                                  <TableCell>{trip.from_location_name}</TableCell>
                                  <TableCell>{trip.to_location_name}</TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={trip.payment_status === 0 ? 'Pending' : trip.payment_status === 1 ? 'Paid' : 'Partially Paid'}
                                      color={trip.payment_status === 1 ? 'success' : trip.payment_status === 0 ? 'warning' : 'info'}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>{trip.latest_status}</TableCell>
                                  <TableCell>{dayjs(trip.created_at).format('MMM DD, YYYY')}</TableCell>
                                  <TableCell>
                                    <Button
                                      size="small"
                                      startIcon={<VisibilityOutlinedIcon />}
                                      onClick={() => navigate(`/trips/${trip.id}`)}
                                    >
                                      View
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                          No trips found for this order.
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Order Audit Summary */}
              <Grid item xs={12}>
                <OrderAuditSummary orderId={order.id} />
              </Grid>

              {/* Order Audit Logs */}
              <Grid item xs={12}>
                <OrderAuditLogs 
                  orderId={order.id} 
                  orderReferenceId={order.order_id}
                />
              </Grid>
            </Grid>
          ) : (
            <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
              No order found.
            </Typography>
          )}
        </Box>
      </Box>
    </SidebarLayout>
  );
}