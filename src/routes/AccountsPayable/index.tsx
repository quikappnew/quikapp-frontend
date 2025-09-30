import { Box, Button, Card, Grid, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Paper } from "@mui/material";
import { useState, FC, useEffect, useCallback } from "react";
import DataTable from "components/DataTable";
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { 
  getPayments, 
  getOrdersAnalytics,
  getTripsAnalytics,
  getVendorsAnalytics,
  getOutstandingBalances,
  deletePayment 
} from 'services/api';
import type { Payment } from 'types/api';
import { PaymentModeEnum, PaymentTypeEnum } from 'types/api';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import ConfirmButton from 'components/ConfirmButton';

interface ExtendedPayment extends Payment {
  action?: React.ReactNode;
}

const AccountsPayable: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<ExtendedPayment[]>([]);
  const [ordersAnalytics, setOrdersAnalytics] = useState<any>(null);
  const [tripsAnalytics, setTripsAnalytics] = useState<any>(null);
  const [vendorsAnalytics, setVendorsAnalytics] = useState<any>(null);
  const [outstandingBalances, setOutstandingBalances] = useState<any>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    mode: '',
    vendorId: '',
    tripId: '',
    startDate: '',
    endDate: ''
  });

  const handleViewPayment = useCallback((paymentId: string) => {
    navigate(`/payments/${paymentId}/view`);
  }, [navigate]);

  const handleEditPayment = useCallback((paymentId: string) => {
    navigate(`/payments/${paymentId}/edit`);
  }, [navigate]);

  const handleDeletePayment = useCallback(async (paymentId: string) => {
    try {
      await deletePayment(paymentId);
      toast.success('Payment deleted successfully');
      // Refresh data by updating filters to trigger useEffect
      setFilters(prev => ({ ...prev }));
    } catch (error) {
      toast.error('Failed to delete payment');
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPayments({
        search: filters.search || undefined,
        type: filters.type || undefined,
        mode: filters.mode || undefined,
        vendorId: filters.vendorId || undefined,
        tripId: filters.tripId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      });
      
      const paymentsWithActions = response.data.map(payment => ({
        ...payment,
        action: (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="View Details">
              <IconButton 
                size="small" 
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewPayment(payment.id);
                }}
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Payment">
              <IconButton 
                size="small" 
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditPayment(payment.id);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Payment">
              <ConfirmButton
                onConfirm={() => handleDeletePayment(payment.id)}
                title="Delete Payment"
                description="Are you sure you want to delete this payment? This action cannot be undone."
                buttonText=""
                color="error"
                variant="text"
              />
            </Tooltip>
          </Box>
        ),
      }));
      setPayments(paymentsWithActions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  }, [filters, handleViewPayment, handleEditPayment, handleDeletePayment]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [ordersRes, tripsRes, vendorsRes, outstandingRes] = await Promise.all([
        getOrdersAnalytics({
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          page: 1,
          pageSize: 10
        }),
        getTripsAnalytics({
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          page: 1,
          pageSize: 10
        }),
        getVendorsAnalytics({
          page: 1,
          pageSize: 10
        }),
        getOutstandingBalances({
          page: 1,
          pageSize: 10
        })
      ]);

      setOrdersAnalytics(ordersRes.data);
      setTripsAnalytics(tripsRes.data);
      setVendorsAnalytics(vendorsRes.data);
      setOutstandingBalances(outstandingRes.data);
    } catch (err) {

    }
  }, [filters]);

  useEffect(() => {
    fetchPayments();
    fetchAnalytics();
  }, [fetchPayments, fetchAnalytics]);




  const columns = [
    { label: 'Trip Ref ID', fieldName: 'tripReferenceId', width: 150, type: 'STRING' as const },
    { label: 'Vendor', fieldName: 'vendorName', width: 150, type: 'STRING' as const },
    { label: 'Type', fieldName: 'type', width: 100, type: 'STATUS' as const },
    { label: 'Mode', fieldName: 'mode', width: 120, type: 'STRING' as const },
    { label: 'Amount', fieldName: 'amount', width: 120, type: 'CURRENCY' as const },
    { label: 'UTR Number', fieldName: 'utrNumber', width: 150, type: 'STRING' as const },
    { label: 'Transaction Date', fieldName: 'transactionDate', width: 150, type: 'DATE' as const },
    { label: 'Status', fieldName: 'status', width: 100, type: 'STATUS' as const },
    { label: 'Description', fieldName: 'description', width: 200, type: 'STRING' as const },
    { label: 'Created', fieldName: 'createdAt', width: 150, type: 'DATE' as const },
    { label: 'Actions', fieldName: 'action', width: 150, type: 'STRING' as const },
  ];

  const handleFilterApply = () => {
    setFilterDialogOpen(false);
    fetchPayments();
    fetchAnalytics();
  };

  const handleFilterReset = () => {
    setFilters({
      search: '',
      type: '',
      mode: '',
      vendorId: '',
      tripId: '',
      startDate: '',
      endDate: ''
    });
    setFilterDialogOpen(false);
  };

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
        Error loading payments: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Analytics Cards */}
      {ordersAnalytics && tripsAnalytics && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {payments.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Payments
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <PaymentIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                ₹{payments.reduce((sum, payment) => sum + (payment.amount || 0), 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Amount
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {outstandingBalances?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Outstanding Items
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {vendorsAnalytics?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Vendors
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, background: "#fff" }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
            Payment Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setFilterDialogOpen(true)}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => {/* TODO: Implement export */}}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/payments/create')}
            >
              Log Payment
            </Button>
          </Box>
        </Box>

        <DataTable 
          data={payments} 
          columns={columns}
          searchFields={['tripReferenceId', 'vendorName', 'utrNumber', 'description']}
        />
      </Card>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Filter Payments</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by trip ref, vendor, UTR number..."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  label="Payment Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {Object.values(PaymentTypeEnum).map((type) => (
                    <MenuItem key={type as string} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  value={filters.mode}
                  onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
                  label="Payment Mode"
                >
                  <MenuItem value="">All Modes</MenuItem>
                  {Object.values(PaymentModeEnum).map((mode) => (
                    <MenuItem key={mode as string} value={mode}>
                      {mode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vendor ID"
                value={filters.vendorId}
                onChange={(e) => setFilters({ ...filters, vendorId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Trip ID"
                value={filters.tripId}
                onChange={(e) => setFilters({ ...filters, tripId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterReset}>Reset</Button>
          <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleFilterApply} variant="contained">Apply Filters</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountsPayable;
