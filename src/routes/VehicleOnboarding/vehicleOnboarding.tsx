import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Card,
  TableCell,
} from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import { getOnboardedVehicles } from 'services/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import DataTable from 'components/DataTable';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const statusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'DOCUMENTS_SUBMITTED':
      return 'warning';
    default:
      return 'default';
  }
};

const VehicleOnboardingList = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await getOnboardedVehicles();
        // add action column
        setVehicles(
          (response.data || []).map(vehicle => ({
            ...vehicle,
            action: (
              <>
                <IconButton
                  sx={{ color: "#72787e" }}
                  onClick={e => {
                    e.stopPropagation();
                    navigate(`/vehicle-onboarding/${vehicle.id}`);
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
                {/* <IconButton
                  color="warning"
                  sx={{ color: "#f9a825", ml: 1 }}
                  onClick={e => {
                    e.stopPropagation();
                    navigate(`/vehicle-onboarding/${vehicle.id}/edit`);
                  }}
                >
                  <EditIcon />
                </IconButton> */}
              </>
            ),
          }))
        );
      } catch (err: any) {
        setError(err.message || 'Failed to fetch onboarded vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const columns = [
    {
      label: 'Vehicle Number',
      fieldName: 'vehicle_number',
      width: 15,
      type: 'STRING' as const,
    },
    {
      label: 'Owner',
      fieldName: 'vehicle_owner_display',
      width: 20,
      type: 'STRING' as const,
    },
    {
      label: 'Vendor',
      fieldName: 'vendor_name',
      width: 15,
      type: 'STRING' as const,
    },
    {
      label: 'Status',
      fieldName: 'status',
      width: 15,
      type: 'STATUS' as const,
    },
    // {
    //   label: 'Created At',
    //   fieldName: 'created_at',
    //   width: 15,
    //   type: 'DATETIME' as const,
    // },
    {
      label: 'Action',
      fieldName: 'action',
      width: 20,
      type: 'STRING' as const,
      render: (row: any) => (
        <Button
          variant="contained"
          color="info"
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            boxShadow: 1,
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)',
            },
          }}
          onClick={() => navigate(`/vehicle-onboarding/${row.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <SidebarLayout>
 <Box sx={{ p: 3 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            background: "#fff",

          }}
        >
      <h4 className="text-xl font-bold mb-3 text-gray-500"> Onboarded Vehicles</h4>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <DataTable
            columns={columns}
            data={vehicles}
            pagination={{
              page: 0,
              rowsPerPage: 10,
              totalRows: vehicles.length,
              onPageChange: () => {},
              onRowsPerPageChange: () => {},
            }}
            searchFields={['vehicle_number', 'vehicle_owner_display', 'vendor_name']}
            onClick={(row) => navigate(`/vehicle-onboarding/${row.id}`)}
          />
        )}
        </Card>
      </Box>  
    </SidebarLayout>
  );
};

export default VehicleOnboardingList;