import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, IconButton, Card, Tooltip } from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import DataTable from 'components/DataTable';
import { getVendorOnboarding } from 'services/api';
import { useNavigate } from 'react-router-dom';
import type { Vendor } from 'services/api';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import VendorOnboardingEditModal from './vendorOnboardingEditModal';


const VendorOnBoardingList: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOnboardingId, setSelectedOnboardingId] = useState<string>('');

  const handleEditOnboarding = (onboardingId: string) => {
    setSelectedOnboardingId(onboardingId);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedOnboardingId('');
  };

  const handleEditSuccess = () => {
    fetchVendors(); // Refresh the vendor onboarding list
  };

  const columns = [
    { label: 'Vendor Name', fieldName: 'name', width: 200 },
    { label: 'SPOC Name', fieldName: 'spoc_name', width: 150 },
    { label: 'SPOC Email', fieldName: 'spoc_email', width: 150 },
    { label: 'Status', fieldName: 'status', width: 150, type: 'STATUS' as const },
    { label: 'Action', fieldName: 'action', width: 120 },
  ];

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getVendorOnboarding();
      setVendors(
        (response.data || []).map((vendor: Vendor) => ({
          ...vendor,
          action: (
            <>
              <Tooltip title="View Details">
                <IconButton
                  sx={{ color: "#72787e" }}
                  onClick={e => {
                    e.stopPropagation();
                    navigate(`/vendor/onboarding/${vendor.id}`);
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Onboarding">
                <IconButton
                  sx={{ color: "#f9a825", ml: 1 }}
                  onClick={e => {
                    e.stopPropagation();
                    handleEditOnboarding(vendor.id);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
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
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

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
      
      <VendorOnboardingEditModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        onboardingId={selectedOnboardingId}
        onSuccess={handleEditSuccess}
      />
    </SidebarLayout>
  );
};

export default VendorOnBoardingList;