import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import DataTable from 'components/DataTable';
import { getVendors } from 'services/api';
import { useNavigate } from 'react-router-dom';
import type { APIVendorResponse } from 'services/api';

const Vendor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<APIVendorResponse['data']>([]);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { label: 'Vendor Name', fieldName: 'name', width: 200 },
    { label: 'GST Number', fieldName: 'gst', width: 150 },
    { label: 'PAN Number', fieldName: 'pan', width: 150 },
    { label: 'SPOC Name', fieldName: 'spoc_name', width: 150 }
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
      setError('Failed to fetch vendors. Please try again.');
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = () => {
    navigate('/vendor/onboarding');
  };

  return (
    <SidebarLayout>
      {/* <Box sx={{ p: 3 }}> */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Typography variant="h5">
            Vendors
          </Typography>
          {/* <Button 
            variant="contained" 
            color="primary"
            onClick={handleAddVendor}
          >
            Add Vendor
          </Button> */}
        </div>

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
      {/* </Box> */}
    </SidebarLayout>
  );
};

export default Vendor;
