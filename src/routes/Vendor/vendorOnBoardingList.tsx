import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, Paper, InputBase, IconButton, Card } from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import DataTable from 'components/DataTable';
import { getVendorOnboarding } from 'services/api';
import { useNavigate } from 'react-router-dom';
import type { Vendor } from 'services/api';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';


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
            <>
              <IconButton
                sx={{ color: "#72787e" }}
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/vendor/onboarding/${vendor.id}`);
                }}
              >
                <VisibilityIcon />
              </IconButton>
              {/* <IconButton
                color="warning"
                sx={{ color: "#f9a825", ml: 1 }}
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/vendor/onboarding/${vendor.id}/edit`);
                }}
              >
                <EditIcon />
              </IconButton> */}
            </>
          ),
        }))
      );
      setError(null);
    } catch (err) {
      setError('Failed to fetch vendor onboarding list. Please try again.');

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
            background: "#fff",

          }}
        >
          <h4 className="text-xl font-bold mb-3 text-gray-500"> Vendor Onboarding List</h4>
     
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

export default VendorOnBoardingList;