import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress, Card } from '@mui/material';
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
      setError('Failed to fetch vendors. Please try again.');
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ p: 3 }}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            background: '#fff',
          }}
        >
          <h4 className="text-xl font-bold mb-2 text-gray-500"> Vendors</h4>

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
        </Card>
      </Box>
    </SidebarLayout>
  );
};

export default Vendor;
