import { Box, Button, Card, Grid, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { useState, FC, useEffect } from "react";
import DataTable from "components/DataTable";
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import SidebarLayout from 'layouts/SidebarLayout';
import { 
  getTripsWithFilters, 
  updateTripStatus,
  deleteTrip,
  exportReport
} from 'services/api';
import type { Trip } from 'types/api';
import { TripStatusEnum } from 'types/api';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Visibility as ViewIcon,
  FilterList as FilterIcon,
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

  const fetchTrips = async () => {
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
  };

  useEffect(() => {
    fetchTrips();
  }, [filters, pagination.page, pagination.rowsPerPage]);

  const handleViewTrip = (tripId: string) => {
    navigate(`/trips/${tripId}/view`);
  };

  const handleEditTrip = (tripId: string) => {
    navigate(`/trips/${tripId}/edit`);
  };

  const handleDeleteTrip = async (tripId: string) => {
    try {
      await deleteTrip(tripId);
      toast.success('Trip deleted successfully');
      fetchTrips();
    } catch (error) {
      toast.error('Failed to delete trip');
    }
  };

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



  const columns = [
    { label: 'Reference ID', fieldName: 'referenceId', width: 150, type: 'STRING' as const },
    { label: 'Status', fieldName: 'status', width: 120, type: 'STATUS' as const },
    { label: 'From', fieldName: 'fromLocation', width: 150, type: 'STRING' as const },
    { label: 'To', fieldName: 'toLocation', width: 150, type: 'STRING' as const },
    { label: 'Vendor', fieldName: 'vendorName', width: 150, type: 'STRING' as const },
    { label: 'Client', fieldName: 'clientName', width: 150, type: 'STRING' as const },
    { label: 'Vehicle', fieldName: 'vehicleNumber', width: 120, type: 'STRING' as const },
    { label: 'Total Amount', fieldName: 'totalAmount', width: 120, type: 'CURRENCY' as const },
    { label: 'Payment Status', fieldName: 'payment_status', width: 120, type: 'NUMBER' as const },
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
                onClick={() => setExportDialogOpen(true)}
              >
                Export
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
            searchFields={['reference_id', 'from_location_name', 'to_location_name', 'vendor_name', 'client_name', 'vehicle_number']}
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
        <DialogTitle>Export Trips</DialogTitle>
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
      </Box>
    </SidebarLayout>
  );
};

export default Trips;
