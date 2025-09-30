import { Box, Button, Card, Grid, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Typography, Paper, LinearProgress, TextField, Tabs, Tab, Divider } from "@mui/material";
import { useState, FC, useEffect, useCallback } from "react";
import DataTable from "components/DataTable";
import TripAuditLogs from "components/TripAuditLogs";
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { 
  getTripById,
  getPaymentsByTrip,
  updateTripStatus,
  getOrderById,
  getTripStatusChoices,
  addTripStatus,
  getTripStatusHistory
} from 'services/api';
import type {
  Payment,
  Trip
} from 'types/api';
import {
  TripStatusEnum
} from 'types/api';
import { 
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Payment as PaymentIcon,
  LocalShipping as LocalShippingIcon,
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Schedule as ScheduleIcon,
  AttachMoney as AttachMoneyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pause as PauseIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  DirectionsCar as DirectionsCarIcon,
  AccountCircle as AccountCircleIcon,
  History as HistoryIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const TripDetails: FC = () => {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [order, setOrder] = useState<any>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<number | ''>('');
  const [statusNotes, setStatusNotes] = useState<string>('');
  const [statusChoices, setStatusChoices] = useState<Array<{value: number; label: string}>>([]);
  const [statusHistory, setStatusHistory] = useState<Array<{
    id: string;
    status: number;
    status_label: string;
    notes: string;
    created_at: string;
  }>>([]);
  const [vehicleInfo, setVehicleInfo] = useState<{
    id: string;
    vehicle_number: string;
    truck_length: string;
    vehicle_owner: string;
    vendor_name: string | null;
  } | null>(null);
  
  // Tab state for different sections
  const [currentTab, setCurrentTab] = useState(0);

  const fetchTripDetails = useCallback(async () => {
    if (!tripId) return;
    
    try {
      setLoading(true);
      const [tripResponse, paymentsResponse] = await Promise.all([
        getTripById(tripId),
        getPaymentsByTrip(tripId)
      ]);
      

      
      setTrip(tripResponse);
      
      // Handle payments response - extract payment logs
      let paymentsData: any[] = [];
      
      if (paymentsResponse && typeof paymentsResponse === 'object' && 'data' in paymentsResponse && (paymentsResponse as any).data) {
        const responseData = (paymentsResponse as any).data;
        
        // Extract payment logs from the API response
        if (responseData.payment_logs && Array.isArray(responseData.payment_logs)) {
          paymentsData = responseData.payment_logs;
        }
      } else if (Array.isArray(paymentsResponse)) {
        paymentsData = paymentsResponse;
      } else if (paymentsResponse && typeof paymentsResponse === 'object' && 'data' in paymentsResponse && Array.isArray((paymentsResponse as any).data)) {
        paymentsData = (paymentsResponse as any).data;
      }
      
      setPayments(paymentsData);
      
      // Fetch order details if order_id is available
      const orderId = (tripResponse as any).order_id;
      if (orderId) {
        try {
          const orderResponse = await getOrderById(orderId);
    
          setOrder(orderResponse.data);
        } catch (orderErr) {
  
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trip details');
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  const fetchStatusChoices = async () => {
    try {
      const response = await getTripStatusChoices();
      if (response.success) {
        setStatusChoices(response.data.status_choices);
      }
    } catch (error) {
      console.error('Failed to fetch status choices:', error);
      // Fallback to hardcoded status choices if API fails
      setStatusChoices([
        { value: 0, label: 'Initiated' },
        { value: 1, label: 'Loading' },
        { value: 2, label: 'Waiting for load' },
        { value: 3, label: 'Intrans' },
        { value: 4, label: 'In Transit' },
        { value: 5, label: 'Unloading' },
        { value: 6, label: 'Waiting for unloading' },
        { value: 7, label: 'Vehicle unloaded' },
        { value: 8, label: 'Completed' }
      ]);
    }
  };

  const fetchStatusHistory = useCallback(async () => {
    if (!tripId) return;
    try {
      const response = await getTripStatusHistory(tripId);
      if (response.success) {
        setStatusHistory(response.data.statuses);
        setVehicleInfo(response.data.vehicle);
      }
    } catch (error) {
      console.error('Failed to fetch status history:', error);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTripDetails();
    fetchStatusChoices();
    fetchStatusHistory();
  }, [fetchTripDetails, fetchStatusHistory]);

  const handleStatusUpdate = async () => {
    if (!tripId || newStatus === '') return;

    setLoading(true);
    try {
      // Try the new API first
      const response = await addTripStatus(tripId, newStatus as number, statusNotes);
      if (response.success) {
        toast.success('Trip status updated successfully');
        setStatusDialogOpen(false);
        setNewStatus('');
        setStatusNotes('');
        // Refresh data
        fetchTripDetails();
        fetchStatusHistory();
      }
    } catch (error) {
      console.error('New API failed, trying fallback:', error);
      
      // Fallback to old API if new one fails
      try {
        // Map numeric status to enum for old API
        const statusMapping: { [key: number]: TripStatusEnum } = {
          0: TripStatusEnum.SCHEDULED,
          1: TripStatusEnum.ONGOING,
          2: TripStatusEnum.ONGOING,
          3: TripStatusEnum.ONGOING,
          4: TripStatusEnum.ONGOING,
          5: TripStatusEnum.ONGOING,
          6: TripStatusEnum.ONGOING,
          7: TripStatusEnum.ONGOING,
          8: TripStatusEnum.COMPLETED
        };
        
        const mappedStatus = statusMapping[newStatus as number] || TripStatusEnum.SCHEDULED;
        await updateTripStatus(tripId, mappedStatus);
        toast.success('Trip status updated successfully');
        setStatusDialogOpen(false);
        setNewStatus('');
        setStatusNotes('');
        fetchTripDetails();
      } catch (fallbackError) {
        console.error('Both APIs failed:', fallbackError);
        toast.error('Failed to update trip status');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentCreated = () => {
    // Refresh trip details to get updated payment information
    fetchTripDetails();
  };

  const getStatusIcon = (status: TripStatusEnum) => {
    switch (status) {
      case TripStatusEnum.SCHEDULED:
        return <ScheduleIcon />;
      case TripStatusEnum.ONGOING:
        return <LocalShippingIcon />;
      case TripStatusEnum.COMPLETED:
        return <CheckCircleIcon />;
      case TripStatusEnum.CANCELLED:
        return <CancelIcon />;
      case TripStatusEnum.DELAYED:
        return <PauseIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const getStatusColor = (status: TripStatusEnum) => {
    switch (status) {
      case TripStatusEnum.SCHEDULED:
        return 'default';
      case TripStatusEnum.ONGOING:
        return 'primary';
      case TripStatusEnum.COMPLETED:
        return 'success';
      case TripStatusEnum.CANCELLED:
        return 'error';
      case TripStatusEnum.DELAYED:
        return 'warning';
      default:
        return 'default';
    }
  };

  const paymentColumns = [
    { label: 'Type', fieldName: 'type', width: 100, type: 'STATUS' as const },
    { label: 'Mode', fieldName: 'mode', width: 120, type: 'STRING' as const },
    { label: 'Amount', fieldName: 'amount', width: 120, type: 'CURRENCY' as const },
    { label: 'UTR Number', fieldName: 'utrNumber', width: 150, type: 'STRING' as const },
    { label: 'Transaction Date', fieldName: 'transactionDate', width: 150, type: 'DATE' as const },
    { label: 'Status', fieldName: 'status', width: 100, type: 'STATUS' as const },
    { label: 'Notes', fieldName: 'notes', width: 200, type: 'STRING' as const },
  ];

  // Calculate financial data from payment history
  const totalAmount = order?.order_pricing ? parseFloat(order.order_pricing) : 
                     (trip?.totalAmount ? parseFloat(trip.totalAmount.toString()) : 0);
  
  // Calculate total paid amount from payment history
  const paidAmount = payments.reduce((sum, payment) => {
    const amount = typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount;
    return sum + (amount || 0);
  }, 0);
  
  // Calculate outstanding amount
  const outstandingAmount = totalAmount - paidAmount;
  
  // Calculate completion percentage
  const completionPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading trip details: {error}
      </Alert>
    );
  }

  if (!trip) {
    return (
      <Alert severity="info">
        Trip not found
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: "#fff", mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => navigate(-1)}
              sx={{ 
                backgroundColor: '#f0f0f0', 
                '&:hover': { backgroundColor: '#e0e0e0' } 
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Trip Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {trip.referenceId || (trip as any).reference_id || 'N/A'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setStatusDialogOpen(true)}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Update Status
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/trips/${tripId}/edit`)}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Edit Trip
            </Button>
          </Box>
        </Box>

        {/* Status and Key Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Chip 
            icon={getStatusIcon(trip.status || (trip as any).latest_status)} 
            label={trip.status || (trip as any).latest_status || 'N/A'} 
            color={getStatusColor(trip.status || (trip as any).latest_status)}
            sx={{ fontSize: '1rem', padding: '8px 16px' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              Scheduled: {dayjs(trip.scheduledDate).format('DD MMM YYYY, HH:mm')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {order?.from_location_name || trip.fromLocation || (trip as any).from_location_name || 'N/A'} → {order?.to_location_name || trip.toLocation || (trip as any).to_location_name || 'N/A'}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Trip Details */}
        <Grid item xs={12} lg={8}>
          {/* Trip Information Card */}
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: "#fff", mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
              <LocalShippingIcon color="primary" />
              Trip Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Reference ID</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{trip.referenceId || (trip as any).reference_id || 'N/A'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Distance</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{(trip.distance || (trip as any).distance || 0)} km</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Duration</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{(trip.duration || (trip as any).duration || 0)} hours</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Created</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{dayjs(trip.createdAt).format('DD MMM YYYY')}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>

          {/* Assignment Details Card */}
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: "#fff", mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
              <PersonIcon color="primary" />
              Assignment Details
            </Typography>
            <Grid container spacing={3}>
              {/* Vendor Section */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2, height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon color="primary" />
                    Vendor Information
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {trip.vendorName || (trip as any).vendor_name || 'N/A'}
                  </Typography>
                  {trip.vendor && (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">SPOC</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{trip.vendor.spoc_name}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Contact</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon fontSize="small" />
                          {trip.vendor.spoc_phone || trip.vendor.alternate_contact_number || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon fontSize="small" />
                          {trip.vendor.spoc_email || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">GST</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{trip.vendor.gst}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">PAN</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{trip.vendor.pan}</Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Grid>

              {/* Client & Vehicle Section */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2, height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountCircleIcon color="primary" />
                    Client & Vehicle
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">Client</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {order?.client_name || trip.clientName || (trip as any).client_name || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">Driver</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {trip.driverName || (trip as any).driver_name || 'N/A'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Vehicle</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DirectionsCarIcon fontSize="small" />
                      {vehicleInfo?.vehicle_number || trip.vehicleNumber || (trip as any).vehicle_number || 'N/A'}
                    </Typography>
                    {vehicleInfo && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Length: {vehicleInfo.truck_length} | Owner: {vehicleInfo.vehicle_owner}
                          {vehicleInfo.vendor_name && ` | Vendor: ${vehicleInfo.vendor_name}`}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>

          {/* Notes Section */}
          {(trip.specialInstructions || trip.internalNotes) && (
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: "#fff", mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Notes & Instructions
              </Typography>
              <Grid container spacing={3}>
                {trip.specialInstructions && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 2, border: '1px solid #ffb74d' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#e65100' }}>
                        Special Instructions
                      </Typography>
                      <Typography variant="body2">{trip.specialInstructions}</Typography>
                    </Box>
                  </Grid>
                )}
                {trip.internalNotes && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: 2, border: '1px solid #42a5f5' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#1565c0' }}>
                        Internal Notes
                      </Typography>
                      <Typography variant="body2">{trip.internalNotes}</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Card>
          )}

          {/* Payment History */}
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: "#fff", mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                <PaymentIcon color="primary" />
                Payment History
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  navigate(`/payments/create?tripId=${tripId}`);
                  // Add a listener for when user returns from payment creation
                  const handleReturn = () => {
                    handlePaymentCreated();
                    window.removeEventListener('focus', handleReturn);
                  };
                  window.addEventListener('focus', handleReturn);
                }}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Add Payment
              </Button>
            </Box>
            
            <DataTable 
              data={payments} 
              columns={paymentColumns}
              searchFields={['utrNumber', 'notes']}
            />
          </Card>

          {/* Tabbed Content for History and Audit Logs */}
          <Card sx={{ borderRadius: 3, boxShadow: 2, background: "#fff" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={currentTab} 
                onChange={(event, newValue) => setCurrentTab(newValue)}
                sx={{ px: 3 }}
              >
                <Tab 
                  label="Status History" 
                  icon={<HistoryIcon />}
                  iconPosition="start"
                />
                <Tab 
                  label="Audit Trail" 
                  icon={<AssignmentIcon />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {/* Status History Tab */}
            {currentTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                  <HistoryIcon color="primary" />
                  Status History
                </Typography>
                
                {statusHistory.length > 0 ? (
                  <Box>
                    {statusHistory.map((status, index) => (
                      <Box key={status.id} sx={{ mb: 2 }}>
                        <Paper 
                          elevation={1} 
                          sx={{ 
                            p: 3, 
                            borderLeft: '4px solid',
                            borderLeftColor: index === 0 ? 'primary.main' : 'grey.300',
                            backgroundColor: index === 0 ? 'primary.50' : 'grey.50'
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: index === 0 ? 'primary.main' : 'text.primary' }}>
                              {status.status_label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {dayjs(status.created_at).format('DD MMM YYYY, HH:mm')}
                            </Typography>
                          </Box>
                          {status.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {status.notes}
                            </Typography>
                          )}
                        </Paper>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No status history available
                  </Typography>
                )}
              </Box>
            )}

            {/* Audit Trail Tab */}
            {currentTab === 1 && (
              <Box sx={{ p: 3 }}>
                {tripId && (
                  <TripAuditLogs 
                    tripId={tripId} 
                    tripReferenceId={trip?.referenceId || (trip as any)?.reference_id}
                  />
                )}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Right Column - Financial Summary */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, background: "#fff", position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
              <AttachMoneyIcon color="primary" />
              Financial Summary
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  ₹{totalAmount.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Paid Amount</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                  ₹{paidAmount.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Outstanding</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                  ₹{outstandingAmount.toLocaleString()}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Completion</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {completionPercentage.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={completionPercentage} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    }
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Quick Actions */}
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  navigate(`/payments/create?tripId=${tripId}`);
                  // Add a listener for when user returns from payment creation
                  const handleReturn = () => {
                    handlePaymentCreated();
                    window.removeEventListener('focus', handleReturn);
                  };
                  window.addEventListener('focus', handleReturn);
                }}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Record Payment
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setStatusDialogOpen(true)}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Update Status
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Trip Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as number)}
              label="New Status"
            >
              {statusChoices.map((choice) => (
                <MenuItem key={choice.value} value={choice.value}>
                  {choice.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes (Optional)"
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            placeholder="Add any additional notes about this status update..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setStatusDialogOpen(false);
            setNewStatus('');
            setStatusNotes('');
          }}>Cancel</Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained" 
            disabled={newStatus === '' || loading}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TripDetails; 