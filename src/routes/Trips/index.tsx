import { Box, Button, Card, Grid, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { useState, FC, useEffect, useCallback } from "react";
import DataTable from "components/DataTable";
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import SidebarLayout from 'layouts/SidebarLayout';
import { 
  getTripsWithFilters, 
  deleteTrip,
  exportReport,
  exportTripsCSV
} from 'services/api';
import type { Trip } from 'types/api';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Visibility as ViewIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import ConfirmButton from 'components/ConfirmButton';

interface ExtendedTrip extends Trip {
  action?: React.ReactNode;
}

const Trips: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trips, setTrips] = useState<ExtendedTrip[]>([]);

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('excel');
  const [exporting, setExporting] = useState(false);
  const [csvExportDialogOpen, setCsvExportDialogOpen] = useState(false);
  const [csvExportDates, setCsvExportDates] = useState({
    date_from: '',
    date_to: ''
  });
  const [csvExporting, setCsvExporting] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    vendor: '',
    client: '',
    payment_status: '',
    startDate: '',
    endDate: ''
  });
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalRows: 0
  });

  const handleViewTrip = useCallback((tripId: string) => {
    navigate(`/trips/${tripId}/view`);
  }, [navigate]);

  const handleEditTrip = useCallback((tripId: string) => {
    navigate(`/trips/${tripId}/edit`);
  }, [navigate]);

  const handleDeleteTrip = useCallback(async (tripId: string) => {
    try {
      await deleteTrip(tripId);
      toast.success('Trip deleted successfully');
      // Trigger a refresh by updating a state that fetchTrips depends on
      setPagination(prev => ({ ...prev, page: prev.page }));
    } catch (error) {
      toast.error('Failed to delete trip');
    }
  }, []);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);

      
      const response = await getTripsWithFilters({
        page: pagination.page + 1, // API uses 1-based pagination
        page_size: pagination.rowsPerPage,
        search: filters.search || undefined,
        status: filters.status || undefined,
        vendor: filters.vendor || undefined,
        client: filters.client || undefined,
        payment_status: filters.payment_status || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      });
      

      
      const tripsWithActions = response.data.map(trip => ({
        ...trip,
        action: (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="View Details">
              <IconButton 
                size="small" 
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewTrip(trip.id);
                }}
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Trip">
              <IconButton 
                size="small" 
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditTrip(trip.id);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <ConfirmButton
              onConfirm={() => handleDeleteTrip(trip.id)}
              title="Delete Trip"
              description="Are you sure you want to delete this trip? This action cannot be undone."
              buttonText=""
              color="error"
              variant="text"
            />
          </Box>
        ),
      }));
      setTrips(tripsWithActions);
      
      // Update pagination with total count from API response
      
      // Extract total count from pagination object
      let totalCount = 0;
      if (response.pagination && response.pagination.total_count !== undefined) {
        totalCount = response.pagination.total_count;
      } else if (response.data && Array.isArray(response.data)) {
        // Fallback: if no total is provided, use the current data length
        totalCount = response.data.length;
      }
      

      setPagination(prev => ({ ...prev, totalRows: totalCount }));
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.rowsPerPage, filters, handleViewTrip, handleEditTrip, handleDeleteTrip]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);


  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportReport(exportFormat, {
        type: 'trips',
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        vendorId: filters.vendor || undefined
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `trips-export-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Trips exported successfully as ${exportFormat.toUpperCase()}`);
      setExportDialogOpen(false);
    } catch (error) {
      toast.error('Failed to export trips');
    } finally {
      setExporting(false);
    }
  };

  // Date validation helper functions
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const validateDateRange = (dateFrom: string, dateTo: string) => {
    if (!dateFrom || !dateTo) {
      return { isValid: false, message: 'Both dates are required' };
    }

    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    // Check if dates are in the future
    if (fromDate > today || toDate > today) {
      return { isValid: false, message: 'Future dates are not allowed' };
    }

    // Check if from date is after to date
    if (fromDate > toDate) {
      return { isValid: false, message: 'Start date cannot be after end date' };
    }

    // Check if date range is more than 30 days (1 month)
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) {
      return { isValid: false, message: 'Date range cannot exceed 30 days (1 month)' };
    }

    return { isValid: true, message: '' };
  };

  const handleCsvExport = async () => {
    const validation = validateDateRange(csvExportDates.date_from, csvExportDates.date_to);
    
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    try {
      setCsvExporting(true);
      const blob = await exportTripsCSV({
        date_from: csvExportDates.date_from,
        date_to: csvExportDates.date_to
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `trips_export_${csvExportDates.date_from}_to_${csvExportDates.date_to}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Trips CSV exported successfully');
      setCsvExportDialogOpen(false);
      // Reset dates
      setCsvExportDates({ date_from: '', date_to: '' });
    } catch (error) {
      toast.error('Failed to export trips CSV');
    } finally {
      setCsvExporting(false);
    }
  };



  const columns = [
    { label: 'Reference ID', fieldName: 'referenceId', width: 150, type: 'STRING' as const },
    { label: 'Status', fieldName: 'status', width: 120, type: 'TRIP_STATUS' as const },
    { label: 'From', fieldName: 'fromLocation', width: 150, type: 'STRING' as const },
    { label: 'To', fieldName: 'toLocation', width: 150, type: 'STRING' as const },
    { label: 'Vendor', fieldName: 'vendorName', width: 150, type: 'STRING' as const },
    { label: 'Client', fieldName: 'clientName', width: 150, type: 'STRING' as const },
    { label: 'Vehicle', fieldName: 'vehicleNumber', width: 120, type: 'STRING' as const },
    { label: 'Total Amount', fieldName: 'totalAmount', width: 120, type: 'CURRENCY' as const },
    { label: 'Payment Status', fieldName: 'payment_status', width: 120, type: 'PAYMENT_STATUS' as const },
    { label: 'Created', fieldName: 'createdAt', width: 150, type: 'DATE' as const },
    { label: 'Actions', fieldName: 'action', width: 150, type: 'STRING' as const },
  ];

  const handleFilterApply = () => {
    // Reset to first page when applying filters
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handleFilterReset = () => {
    setFilters({
      search: '',
      status: '',
      vendor: '',
      client: '',
      payment_status: '',
      startDate: '',
      endDate: ''
    });
    // Reset to first page when resetting filters
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (newPage: number) => {
    
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    
    setPagination(prev => ({ ...prev, page: 0, rowsPerPage: newRowsPerPage }));
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
        Error loading trips: {error}
      </Alert>
    );
  }

  return (
    <SidebarLayout>
      <Box sx={{ p: 3 }}>
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, background: "#fff" }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              Trip Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => setCsvExportDialogOpen(true)}
                sx={{ color: 'success.main', borderColor: 'success.main' }}
              >
                Export Report
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/trips/create')}
              >
                Create Trip
              </Button>
            </Box>
          </Box>

          {/* Filters Section */}
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Search"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search trips..."
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    label="Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="Initiated">Initiated</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Vendor"
                  value={filters.vendor}
                  onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
                  placeholder="Vendor name or ID"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Client"
                  value={filters.client}
                  onChange={(e) => setFilters({ ...filters, client: e.target.value })}
                  placeholder="Client name or ID"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    value={filters.payment_status}
                    onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })}
                    label="Payment Status"
                  >
                    <MenuItem value="">All Payment Statuses</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Start Date"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="End Date"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleFilterApply}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleFilterReset}
                  >
                    Reset
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <DataTable 
            data={trips} 
            columns={columns}
            searchFields={['referenceId', 'fromLocation', 'toLocation', 'vendorName', 'clientName', 'vehicleNumber']}
            pagination={{
              page: pagination.page,
              rowsPerPage: pagination.rowsPerPage,
              totalRows: pagination.totalRows,
              onPageChange: handlePageChange,
              onRowsPerPageChange: handleRowsPerPageChange,
              serverSide: true
            }}
          />
        </Card>



      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Trips Report</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Export Format</InputLabel>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as 'pdf' | 'excel' | 'csv')}
                label="Export Format"
              >
                <MenuItem value="excel">Excel (.xlsx)</MenuItem>
                <MenuItem value="csv">CSV (.csv)</MenuItem>
                <MenuItem value="pdf">PDF (.pdf)</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              The export will include all trips with current filters applied.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleExport} 
            variant="contained" 
            disabled={exporting}
            startIcon={exporting ? <CircularProgress size={16} /> : <DownloadIcon />}
          >
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* CSV Export Dialog with Date Range */}
      <Dialog open={csvExportDialogOpen} onClose={() => setCsvExportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Trips CSV</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Select a date range to export trips data. Maximum 30 days (1 month) allowed, no future dates.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={csvExportDates.date_from}
                onChange={(e) => setCsvExportDates({ ...csvExportDates, date_from: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: getTodayDate() }}
              />
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={csvExportDates.date_to}
                onChange={(e) => setCsvExportDates({ ...csvExportDates, date_to: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: getTodayDate() }}
              />
            </Box>

            {csvExportDates.date_from && csvExportDates.date_to && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Selected range: {csvExportDates.date_from} to {csvExportDates.date_to}
                </Typography>
                {(() => {
                  const validation = validateDateRange(csvExportDates.date_from, csvExportDates.date_to);
                  return !validation.isValid ? (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                      ⚠️ {validation.message}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                      ✓ Valid date range
                    </Typography>
                  );
                })()}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCsvExportDialogOpen(false);
            setCsvExportDates({ date_from: '', date_to: '' });
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleCsvExport} 
            variant="contained" 
            disabled={csvExporting || !csvExportDates.date_from || !csvExportDates.date_to}
            startIcon={csvExporting ? <CircularProgress size={16} /> : <DownloadIcon />}
            color="success"
          >
            {csvExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </SidebarLayout>
  );
};

export default Trips;
