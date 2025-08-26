import { Box, Button, Card, Grid, TextField, Typography, Paper, LinearProgress, Tabs, Tab } from "@mui/material";
import { useState, FC, useEffect } from "react";
import DataTable from "components/DataTable";
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { 
  getOrdersAnalytics,
  getTripsAnalytics,
  getVendorsAnalytics,
  getVendorPaymentSummary,
  getTripFinancials,
  getOutstandingBalances,
  getTrends,
  exportReport
} from 'services/api';
import type {
  VendorPaymentSummary,
  TripFinancialSummary,
  OutstandingBalance,
  TrendData
} from 'types/api';
import { 
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Payment as PaymentIcon,
  Warning as WarningIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Reports: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  // Analytics Data
  const [ordersAnalytics, setOrdersAnalytics] = useState<any>(null);
  const [tripsAnalytics, setTripsAnalytics] = useState<any>(null);
  const [vendorsAnalytics, setVendorsAnalytics] = useState<any>(null);
  const [vendorSummary, setVendorSummary] = useState<VendorPaymentSummary[]>([]);
  const [tripSummary, setTripSummary] = useState<TripFinancialSummary[]>([]);
  const [outstandingBalances, setOutstandingBalances] = useState<OutstandingBalance[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch all analytics data
      const [ordersRes, tripsRes, vendorsRes, vendorRes, tripRes, outstandingRes, trendsRes] = await Promise.all([
        getOrdersAnalytics({
          startDate: dateRange.startDate || undefined,
          endDate: dateRange.endDate || undefined,
          page: 1,
          pageSize: 10
        }),
        getTripsAnalytics({
          startDate: dateRange.startDate || undefined,
          endDate: dateRange.endDate || undefined,
          page: 1,
          pageSize: 10
        }),
        getVendorsAnalytics({
          page: 1,
          pageSize: 10
        }),
        getVendorPaymentSummary({
          page: 1,
          pageSize: 10
        }),
        getTripFinancials({
          page: 1,
          pageSize: 10
        }),
        getOutstandingBalances({
          page: 1,
          pageSize: 10
        }),
        getTrends({
          period: 'monthly',
          startDate: dateRange.startDate || undefined,
          endDate: dateRange.endDate || undefined
        })
      ]);

      setOrdersAnalytics(ordersRes.data);
      setTripsAnalytics(tripsRes.data);
      setVendorsAnalytics(vendorsRes.data);
      setVendorSummary(vendorRes.data);
      setTripSummary(tripRes.data);
      setOutstandingBalances(outstandingRes.data);
      setTrends(trendsRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const handleExport = async (type: 'payments' | 'trips' | 'vendors' | 'outstanding', format: 'pdf' | 'excel' | 'csv') => {
    try {
      const blob = await exportReport(format, {
        type,
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`${type} report exported successfully`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  const vendorColumns = [
    { label: 'Vendor Name', fieldName: 'vendorName', width: 200, type: 'STRING' as const },
    { label: 'Total Trips', fieldName: 'totalTrips', width: 120, type: 'NUMBER' as const },
    { label: 'Total Payable', fieldName: 'totalPayable', width: 150, type: 'CURRENCY' as const },
    { label: 'Total Paid', fieldName: 'totalPaid', width: 150, type: 'CURRENCY' as const },
    { label: 'Outstanding', fieldName: 'outstandingAmount', width: 150, type: 'CURRENCY' as const },
    { label: 'Completion %', fieldName: 'completionPercentage', width: 120, type: 'NUMBER' as const },
    { label: 'Last Payment', fieldName: 'lastPaymentDate', width: 150, type: 'DATE' as const },
  ];

  const tripColumns = [
    { label: 'Trip Ref ID', fieldName: 'referenceId', width: 150, type: 'STRING' as const },
    { label: 'Vendor', fieldName: 'vendorName', width: 150, type: 'STRING' as const },
    { label: 'Total Amount', fieldName: 'totalAmount', width: 150, type: 'CURRENCY' as const },
    { label: 'Paid Amount', fieldName: 'paidAmount', width: 150, type: 'CURRENCY' as const },
    { label: 'Outstanding', fieldName: 'outstandingAmount', width: 150, type: 'CURRENCY' as const },
    { label: 'Completion %', fieldName: 'completionPercentage', width: 120, type: 'NUMBER' as const },
  ];

  const outstandingColumns = [
    { label: 'Vendor Name', fieldName: 'vendorName', width: 200, type: 'STRING' as const },
    { label: 'Outstanding Amount', fieldName: 'totalOutstanding', width: 150, type: 'CURRENCY' as const },
    { label: 'Trip Count', fieldName: 'tripCount', width: 120, type: 'NUMBER' as const },
    { label: 'Oldest Outstanding', fieldName: 'oldestOutstandingDate', width: 150, type: 'DATE' as const },
    { label: 'Recent Payment', fieldName: 'recentPaymentDate', width: 150, type: 'DATE' as const },
  ];

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
        Error loading analytics: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Export Options */}
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, background: "#fff", mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
            Analytics & Reporting
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="End Date"
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => handleExport('payments', 'excel')}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Overview Cards */}
        {ordersAnalytics && tripsAnalytics && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {ordersAnalytics.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <PaymentIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {tripsAnalytics.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Trips
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {vendorsAnalytics.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Vendors
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {outstandingBalances.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Outstanding Items
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Card>

      {/* Tabs for different reports */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, background: "#fff" }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Vendor Summary" icon={<BarChartIcon />} />
            <Tab label="Trip Financials" icon={<PieChartIcon />} />
            <Tab label="Outstanding Balances" icon={<WarningIcon />} />
            <Tab label="Trends" icon={<TimelineIcon />} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Vendor Payment Summary</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" onClick={() => handleExport('vendors', 'excel')}>Export Excel</Button>
              <Button size="small" onClick={() => handleExport('vendors', 'pdf')}>Export PDF</Button>
            </Box>
          </Box>
          <DataTable 
            data={vendorSummary} 
            columns={vendorColumns}
            searchFields={['vendorName']}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Trip Financial Summary</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" onClick={() => handleExport('trips', 'excel')}>Export Excel</Button>
              <Button size="small" onClick={() => handleExport('trips', 'pdf')}>Export PDF</Button>
            </Box>
          </Box>
          <DataTable 
            data={tripSummary} 
            columns={tripColumns}
            searchFields={['referenceId', 'vendorName']}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Outstanding Balances</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" onClick={() => handleExport('outstanding', 'excel')}>Export Excel</Button>
              <Button size="small" onClick={() => handleExport('outstanding', 'pdf')}>Export PDF</Button>
            </Box>
          </Box>
          <DataTable 
            data={outstandingBalances} 
            columns={outstandingColumns}
            searchFields={['vendorName']}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Payment Trends</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" onClick={() => handleExport('payments', 'excel')}>Export Excel</Button>
              <Button size="small" onClick={() => handleExport('payments', 'pdf')}>Export PDF</Button>
            </Box>
          </Box>
          <Grid container spacing={3}>
            {trends.map((trend, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary">
                    {trend.period}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    ₹{trend.revenue?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trend.payments} payments • {trend.trips} trips
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default Reports;
