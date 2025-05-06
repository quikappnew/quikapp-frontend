import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import DataTable from 'components/DataTable';
import { getVendorOnboarding } from 'services/api';
import { useNavigate } from 'react-router-dom';
import type { Vendor } from 'services/api';

const VendorOnBoardingList: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { label: 'Vendor Name', fieldName: 'name', width: 200 },
    { label: 'SPOC Name', fieldName: 'spoc_name', width: 150 },
    { label: 'SPOC Email', fieldName: 'spoc_email', width: 150 },
    { label: 'Status', fieldName: 'status', width: 150, type: 'STATUS' as const },
    { label: 'Action', fieldName: 'action', width: 120 },
  ];

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await getVendorOnboarding();
      setVendors(
        (response.data || []).map((vendor: Vendor) => ({
          ...vendor,
          action: (
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={e => {
                e.stopPropagation();
                navigate(`/vendor/onboarding/${vendor.id}`);
              }}
            >
              View
            </Button>
          ),
        }))
      );
      setError(null);
    } catch (err) {
      setError('Failed to fetch vendor onboarding list. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
        <Typography variant="h5" gutterBottom>
          Vendor Onboarding List
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : (
          <DataTable
            data={vendors}
            columns={columns}
            searchFields={['name', 'gst', 'pan', 'spoc_name']}
          />
        )}
    </SidebarLayout>
  );
};

export default VendorOnBoardingList;