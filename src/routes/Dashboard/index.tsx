import React, { useEffect, useState } from 'react';
import Navbar from "components/Navbar";
import SidebarLayout from "layouts/SidebarLayout";
import { 
  getOrdersAnalytics, 
  getTripsAnalytics, 
  getVendorsAnalytics, 
  getVendorPaymentSummary,
  getTripFinancials,
  getOutstandingBalances
} from 'services/api';
import Analytics from 'components/Analytics';
import { 
  Box, 
  Button,
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  CircularProgress,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,

} from '@mui/material';
import { 
  TrendingUp, 
  LocalShipping, 
  Assignment,
  Payment,
  CheckCircle,
  Schedule,
  Cancel,
  Pause,
  AttachMoney,
  People,
  Business,
  Receipt,
  Timeline,
} from '@mui/icons-material';
import { TripStatusEnum } from 'types/api';
import { PaymentStatusEnum } from 'services/api';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [ordersData, setOrdersData] = useState<any[]>([]);
    const [tripsData, setTripsData] = useState<any[]>([]);
    const [vendorsData, setVendorsData] = useState<any[]>([]);
    const [vendorSummary, setVendorSummary] = useState<any[]>([]);
    const [tripSummary, setTripSummary] = useState<any[]>([]);
    const [outstandingBalances, setOutstandingBalances] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleRetry = () => {
        fetchDashboardData();
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');
        
        try {
            // Fetch all analytics data from the new endpoints
            const [
                ordersResponse, 
                tripsResponse, 
                vendorsResponse,
                vendorSummaryResponse,
                tripSummaryResponse,
                outstandingResponse
            ] = await Promise.all([
                getOrdersAnalytics({ page: 1, pageSize: 100 }).catch(() => ({ data: [] })),
                getTripsAnalytics({ page: 1, pageSize: 100 }).catch(() => ({ data: [] })),
                getVendorsAnalytics({ page: 1, pageSize: 100 }).catch(() => ({ data: [] })),
                getVendorPaymentSummary({ page: 1, pageSize: 5 }).catch(() => ({ data: [] })),
                getTripFinancials({ page: 1, pageSize: 5 }).catch(() => ({ data: [] })),
                getOutstandingBalances({ page: 1, pageSize: 5 }).catch(() => ({ data: [] }))
            ]);

            setOrdersData(ordersResponse.data || []);
            setTripsData(tripsResponse.data || []);
            setVendorsData(vendorsResponse.data || []);
            setVendorSummary(vendorSummaryResponse.data || []);
            setTripSummary(tripSummaryResponse.data || []);
            setOutstandingBalances(outstandingResponse.data || []);

        } catch (err: any) {

            setError('Failed to fetch dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const totalOrders = ordersData.length || 0;
        const totalRevenue = ordersData.reduce((sum, order) => sum + (order.order_pricing || 0), 0);
        const convertedOrders = ordersData.filter(order => order.order_status?.has_trips).length || 0;
        const pendingOrders = totalOrders - convertedOrders;
        const totalTrips = tripsData.length || 0;
        const totalVendors = vendorsData.length || 0;

        // Trip status breakdown
        const tripStatusCounts = {
            scheduled: tripsData.filter(trip => trip.status === TripStatusEnum.SCHEDULED || trip.latest_status === 'SCHEDULED').length || 0,
            ongoing: tripsData.filter(trip => trip.status === TripStatusEnum.ONGOING || trip.latest_status === 'ONGOING').length || 0,
            completed: tripsData.filter(trip => trip.status === TripStatusEnum.COMPLETED || trip.latest_status === 'COMPLETED').length || 0,
            cancelled: tripsData.filter(trip => trip.status === TripStatusEnum.CANCELLED || trip.latest_status === 'CANCELLED').length || 0,
            delayed: tripsData.filter(trip => trip.status === TripStatusEnum.DELAYED || trip.latest_status === 'DELAYED').length || 0
        };

        // Payment status breakdown
        const paymentStatusCounts = {
            pending: tripsData.filter(trip => trip.payment_status === PaymentStatusEnum.PENDING).length || 0,
            paid: tripsData.filter(trip => trip.payment_status === PaymentStatusEnum.PAID).length || 0,
            partiallyPaid: tripsData.filter(trip => trip.payment_status === PaymentStatusEnum.PARTIALLY_PAID).length || 0,
            overdue: tripsData.filter(trip => trip.payment_status === PaymentStatusEnum.OVERDUE).length || 0
        };

        return {
            totalOrders,
            totalRevenue,
            convertedOrders,
            pendingOrders,
            totalTrips,
            totalVendors,
            tripStatusCounts,
            paymentStatusCounts
        };
    };

    const stats = calculateStats();

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SCHEDULED':
            case 'scheduled':
                return <Schedule color="info" />;
            case 'ONGOING':
            case 'ongoing':
                return <LocalShipping color="primary" />;
            case 'COMPLETED':
            case 'completed':
                return <CheckCircle color="success" />;
            case 'CANCELLED':
            case 'cancelled':
                return <Cancel color="error" />;
            case 'DELAYED':
            case 'delayed':
                return <Pause color="warning" />;
            default:
                return <Schedule color="info" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SCHEDULED':
            case 'scheduled':
                return 'info';
            case 'ONGOING':
            case 'ongoing':
                return 'primary';
            case 'COMPLETED':
            case 'completed':
                return 'success';
            case 'CANCELLED':
            case 'cancelled':
                return 'error';
            case 'DELAYED':
            case 'delayed':
                return 'warning';
            default:
                return 'info';
        }
    };

    const StatCard = ({ title, value, icon, color, subtitle }: any) => (
        <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h4" fontWeight={600} color={`${color}.main`}>
                            {value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ 
                        p: 1, 
                        borderRadius: 2, 
                        backgroundColor: `${color}.light`,
                        color: `${color}.main`
                    }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    const AnalyticsCard = ({ title, children, icon }: any) => (
        <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {icon}
                    <Typography variant="h6" fontWeight={600}>
                        {title}
                    </Typography>
                </Box>
                {children}
            </CardContent>
        </Card>
    );

    return (
        <SidebarLayout>
            <Navbar title="Dashboard" subTitle="Analytics Overview" />
            
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="error" variant="h6" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={handleRetry}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        Retry
                    </Button>
                </Box>
            ) : (
                <Box sx={{ p: 3 }}>
                    {/* Summary Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Total Orders"
                                value={stats.totalOrders}
                                icon={<Assignment sx={{ fontSize: 30 }} />}
                                color="primary"
                                subtitle={`${stats.convertedOrders} converted to trips`}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Total Revenue"
                                value={`₹${stats.totalRevenue.toLocaleString()}`}
                                icon={<TrendingUp sx={{ fontSize: 30 }} />}
                                color="success"
                                subtitle={`${stats.pendingOrders} pending orders`}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Active Trips"
                                value={stats.totalTrips}
                                icon={<LocalShipping sx={{ fontSize: 30 }} />}
                                color="info"
                                subtitle={`${stats.tripStatusCounts.ongoing} ongoing`}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Active Vendors"
                                value={stats.totalVendors}
                                icon={<Business sx={{ fontSize: 30 }} />}
                                color="warning"
                                subtitle={`${stats.paymentStatusCounts.overdue} overdue payments`}
                            />
                        </Grid>
                    </Grid>

                    {/* Main Content Grid */}
                    <Grid container spacing={3}>
                        {/* Left Column - Main Analytics */}
                        <Grid item xs={12} lg={8}>


                            {/* Payment Status Overview */}
                            <Box sx={{ mt: 3 }}>
                                <AnalyticsCard title="Payment Status Overview" icon={<Payment color="primary" />}>
                                    {stats.totalTrips > 0 ? (
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} sm={3}>
                                                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff3e0', borderRadius: 2 }}>
                                                    <Typography variant="h6" fontWeight={600} color="warning.main">
                                                        {stats.paymentStatusCounts.pending}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Pending
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e8f5e8', borderRadius: 2 }}>
                                                    <Typography variant="h6" fontWeight={600} color="success.main">
                                                        {stats.paymentStatusCounts.paid}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Paid
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
                                                    <Typography variant="h6" fontWeight={600} color="info.main">
                                                        {stats.paymentStatusCounts.partiallyPaid}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Partial
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#ffebee', borderRadius: 2 }}>
                                                    <Typography variant="h6" fontWeight={600} color="error.main">
                                                        {stats.paymentStatusCounts.overdue}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Overdue
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <Payment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                                No payment data
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Payment status data will appear here when trips are created
                                            </Typography>
                                        </Box>
                                    )}
                                </AnalyticsCard>
                            </Box>

                            {/* Analytics Charts */}
                            <Box sx={{ mt: 3 }}>
                                <Analytics 
                                    ordersData={ordersData}
                                    tripsData={tripsData}
                                />
                            </Box>
                        </Grid>

                        {/* Right Column - Sidebar Analytics */}
                        <Grid item xs={12} lg={4}>


                            {/* Recent Trip Financials */}
                            <Box sx={{ mt: 3 }}>
                                <AnalyticsCard title="Recent Trip Financials" icon={<AttachMoney color="primary" />}>
                                    <List dense>
                                        {tripSummary.length > 0 ? (
                                            tripSummary.slice(0, 5).map((trip, index) => (
                                                <ListItem key={index} sx={{ px: 0 }}>
                                                    <ListItemIcon>
                                                        <Receipt color="primary" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={trip.referenceId || 'TRIP-001'}
                                                        secondary={`₹${trip.outstandingAmount?.toLocaleString() || 0} outstanding`}
                                                    />
                                                    <Chip 
                                                        label={`${trip.completionPercentage?.toFixed(1) || 0}%`}
                                                        size="small"
                                                        color={trip.completionPercentage >= 100 ? "success" : "warning"}
                                                    />
                                                </ListItem>
                                            ))
                                        ) : (
                                            <ListItem sx={{ px: 0 }}>
                                                <ListItemText
                                                    primary="No recent trips"
                                                    secondary="Trip financial data will appear here"
                                                    sx={{ textAlign: 'center', color: 'text.secondary' }}
                                                />
                                            </ListItem>
                                        )}
                                    </List>
                                </AnalyticsCard>
                            </Box>

                            {/* Vendor Payment Summary */}
                            <Box sx={{ mt: 3 }}>
                                <AnalyticsCard title="Vendor Payment Summary" icon={<People color="primary" />}>
                                    <List dense>
                                        {vendorSummary.length > 0 ? (
                                            vendorSummary.slice(0, 5).map((vendor, index) => (
                                                <ListItem key={index} sx={{ px: 0 }}>
                                                    <ListItemIcon>
                                                        <Business color="primary" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={vendor.vendorName || 'Unknown Vendor'}
                                                        secondary={`${vendor.totalTrips || 0} trips`}
                                                    />
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography variant="body2" color="success.main">
                                                            ₹{vendor.totalPaid?.toLocaleString() || 0}
                                                        </Typography>
                                                        <Typography variant="caption" color="error.main">
                                                            ₹{vendor.outstandingAmount?.toLocaleString() || 0}
                                                        </Typography>
                                                    </Box>
                                                </ListItem>
                                            ))
                                        ) : (
                                            <ListItem sx={{ px: 0 }}>
                                                <ListItemText
                                                    primary="No vendor data"
                                                    secondary="Vendor payment summaries will appear here"
                                                    sx={{ textAlign: 'center', color: 'text.secondary' }}
                                                />
                                            </ListItem>
                                        )}
                                    </List>
                                </AnalyticsCard>
                            </Box>

                            {/* Quick Stats */}
                            <Box sx={{ mt: 3 }}>
                                <AnalyticsCard title="Quick Stats" icon={<Timeline color="primary" />}>
                                    <Box sx={{ space: 2 }}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Conversion Rate
                                            </Typography>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={(stats.convertedOrders / stats.totalOrders) * 100} 
                                                sx={{ height: 8, borderRadius: 4 }}
                                            />
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                {((stats.convertedOrders / stats.totalOrders) * 100).toFixed(1)}%
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Trip Completion
                                            </Typography>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={(stats.tripStatusCounts.completed / stats.totalTrips) * 100} 
                                                sx={{ height: 8, borderRadius: 4 }}
                                                color="success"
                                            />
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                {((stats.tripStatusCounts.completed / stats.totalTrips) * 100).toFixed(1)}%
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Payment Collection
                                            </Typography>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={(stats.paymentStatusCounts.paid / stats.totalTrips) * 100} 
                                                sx={{ height: 8, borderRadius: 4 }}
                                                color="info"
                                            />
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                {((stats.paymentStatusCounts.paid / stats.totalTrips) * 100).toFixed(1)}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                </AnalyticsCard>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </SidebarLayout>
    );
};

export default Dashboard;
