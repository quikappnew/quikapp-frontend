import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  DirectionsCar as DirectionsCarIcon,
  Business as BusinessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { getAvailableVehicles } from 'services/api';

interface Vehicle {
  id: string;
  vehicle_number: string;
  truck_length: string;
  truck_length_value: string;
  vehicle_owner: string;
  vendor_name: string | null;
  vendor_id: string | null;
}

interface AvailableVehiclesProps {
  onVehicleSelect?: (vehicle: Vehicle) => void;
  selectedVehicleId?: string;
  showAsDialog?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const AvailableVehicles: React.FC<AvailableVehiclesProps> = ({
  onVehicleSelect,
  selectedVehicleId,
  showAsDialog = false,
  open = false,
  onClose
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableVehicles = async () => {
    try {
      setLoading(true);
      const response = await getAvailableVehicles();
      if (response.success) {
        setVehicles(response.data.vehicles);
      } else {
        setError('Failed to fetch available vehicles');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch available vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showAsDialog && open) {
      fetchAvailableVehicles();
    } else if (!showAsDialog) {
      fetchAvailableVehicles();
    }
  }, [showAsDialog, open]);

  const handleVehicleClick = (vehicle: Vehicle) => {
    if (onVehicleSelect) {
      onVehicleSelect(vehicle);
    }
    if (showAsDialog && onClose) {
      onClose();
    }
  };

  const VehicleContent = () => (
    <Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : vehicles.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No available vehicles found
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {vehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <Card
                sx={{
                  p: 2,
                  cursor: onVehicleSelect ? 'pointer' : 'default',
                  border: selectedVehicleId === vehicle.id ? '2px solid' : '1px solid',
                  borderColor: selectedVehicleId === vehicle.id ? 'primary.main' : 'grey.300',
                  backgroundColor: selectedVehicleId === vehicle.id ? 'primary.50' : 'background.paper',
                  '&:hover': onVehicleSelect ? {
                    boxShadow: 3,
                    borderColor: 'primary.main'
                  } : {}
                }}
                onClick={() => handleVehicleClick(vehicle)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <DirectionsCarIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {vehicle.vehicle_number}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Truck Length
                  </Typography>
                  <Chip 
                    label={vehicle.truck_length} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Owner
                  </Typography>
                  <Chip 
                    label={vehicle.vehicle_owner === 'OWN_VEHICLE' ? 'Own Vehicle' : 'Rented'} 
                    size="small" 
                    color={vehicle.vehicle_owner === 'OWN_VEHICLE' ? 'success' : 'warning'}
                  />
                </Box>

                {vehicle.vendor_name && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {vehicle.vendor_name}
                    </Typography>
                  </Box>
                )}

                {onVehicleSelect && (
                  <Button
                    variant={selectedVehicleId === vehicle.id ? "contained" : "outlined"}
                    size="small"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVehicleClick(vehicle);
                    }}
                  >
                    {selectedVehicleId === vehicle.id ? 'Selected' : 'Select Vehicle'}
                  </Button>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  if (showAsDialog) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DirectionsCarIcon color="primary" />
          Available Vehicles
        </DialogTitle>
        <DialogContent>
          <VehicleContent />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <DirectionsCarIcon color="primary" />
        Available Vehicles
      </Typography>
      <VehicleContent />
    </Card>
  );
};

export default AvailableVehicles;
