import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, Order } from 'services/api';
import SidebarLayout from 'layouts/SidebarLayout';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    } catch (err: any) {
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
        <Card sx={{ width: '100%', maxWidth: 600, borderRadius: 4, boxShadow: 6 }}>
          <CardContent>
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
            <Divider sx={{ mb: 3 }} />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                <CircularProgress color="primary" sx={{ mb: 2 }} />
                <Typography color="text.secondary">Loading...</Typography>
              </Box>
            ) : order ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
                  <Typography variant="body1" color="text.primary">{order.order_id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Order Date</Typography>
                  <Typography variant="body1" color="text.primary">{order.order_date || <span style={{ color: '#aaa' }}>N/A</span>}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Pricing</Typography>
                  <Typography variant="body1" color="text.primary">{order.order_pricing}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Client</Typography>
                  <Typography variant="body1" color="text.primary">{order.client_name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">From Location</Typography>
                  <Typography variant="body1" color="text.primary">{order.from_location_name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">To Location</Typography>
                  <Typography variant="body1" color="text.primary">{order.to_location_name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                  <Typography variant="body1" color="text.primary">{order.created_at}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Updated At</Typography>
                  <Typography variant="body1" color="text.primary">{order.updated_at}</Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                No order found.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </SidebarLayout>
  );
}