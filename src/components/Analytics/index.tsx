import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';

interface AnalyticsProps {
  ordersData?: any[];
  tripsData?: any[];
  dateRange?: { start: string; end: string };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics: React.FC<AnalyticsProps> = ({ ordersData = [], tripsData = [], dateRange }) => {
  // Process orders data for charts
  const processOrdersData = () => {
    if (!ordersData.length) return [];
    
    // Group by date
    const groupedByDate = ordersData.reduce((acc, order) => {
      const date = order.order_date || order.created_at?.split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, orders: 0, revenue: 0, trips: 0 };
      }
      acc[date].orders += 1;
      acc[date].revenue += order.order_pricing || 0;
      acc[date].trips += order.order_status?.trip_count || 0;
      return acc;
    }, {});

    return Object.values(groupedByDate).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Process status data for pie chart
  const processStatusData = () => {
    if (!ordersData.length) return [];
    
    const statusCount = ordersData.reduce((acc, order) => {
      const status = order.order_status?.has_trips ? 'Converted to Trip' : 'Pending Trip Creation';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  };

  // Process client data for bar chart
  const processClientData = () => {
    if (!ordersData.length) return [];
    
    const clientCount = ordersData.reduce((acc, order) => {
      const client = order.client_name || 'Unknown';
      acc[client] = (acc[client] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(clientCount)
      .map(([name, value]) => ({ name, orders: value }))
      .sort((a, b) => (b.orders as number) - (a.orders as number))
      .slice(0, 5); // Top 5 clients
  };

  const chartData = processOrdersData();
  const statusData = processStatusData();
  const clientData = processClientData();

  return (
    <Grid container spacing={3}>
      {/* Orders Over Time */}
      <Grid item xs={12} lg={8}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Orders & Revenue Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="orders"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Orders"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Revenue (₹)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Order Status Distribution */}
      <Grid item xs={12} lg={4}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Order Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Clients */}
      <Grid item xs={12} lg={6}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Top Clients by Orders
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Trip Conversion Rate */}
      <Grid item xs={12} lg={6}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Trip Conversion Rate
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="trips"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Trips Created"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Summary Stats */}
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Analytics Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary" fontWeight={600}>
                    {ordersData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main" fontWeight={600}>
                    ₹{ordersData.reduce((sum, order) => sum + (order.order_pricing || 0), 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="info.main" fontWeight={600}>
                    {ordersData.filter(order => order.order_status?.has_trips).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Converted to Trips
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main" fontWeight={600}>
                    {ordersData.filter(order => !order.order_status?.has_trips).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Conversion
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Analytics;
