import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import DataTable from 'components/DataTable';
import { getVendors } from 'services/api';
import { useNavigate } from 'react-router-dom';
import type { Vendor } from 'services/api';

const VendorOnBoardingList: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { label: 'Vendor Name', fieldName: 'name', width: 200 },
    { label: 'GST Number', fieldName: 'gst', width: 150 },
    { label: 'PAN Number', fieldName: 'pan', width: 150 },
    { label: 'SPOC Name', fieldName: 'spoc_name', width: 150 },
  ];

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await getVendors();
      setVendors(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vendor onboarding list. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (vendor: Vendor) => {
    navigate(`/vendor/onboarding/${vendor.id}`);
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
            onClick={handleRowClick}
          />
        )}
    </SidebarLayout>
  );
};

export default VendorOnBoardingList;