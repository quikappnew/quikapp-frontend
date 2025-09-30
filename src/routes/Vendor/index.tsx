import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, Card, IconButton, Tooltip } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import SidebarLayout from 'layouts/SidebarLayout';
import DataTable from 'components/DataTable';
import { getVendors } from 'services/api';
import { useNavigate } from 'react-router-dom';
import type { APIVendorResponse } from 'services/api';
import debounce from 'utils/debounce';
import VendorEditModal from './vendorEditModal';

const Vendor = () => {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<APIVendorResponse['data']>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0); // zero-based for UI
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');

  const handleEditVendor = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedVendorId('');
  };

  const handleEditSuccess = () => {
    fetchVendors(); // Refresh the vendor list
  };

  const columns = [
    { label: 'Vendor', fieldName: 'name', width: 200 },
    { label: 'GST', fieldName: 'gst', width: 150 },
    { label: 'PAN ', fieldName: 'pan', width: 150 },
    { label: 'SPOC', fieldName: 'spoc_name', width: 150 },
    { label: 'Email', fieldName: 'spoc_email', width: 130 },
    { label: 'Phone', fieldName: 'spoc_phone', width: 130 },
    { label: 'Alternate', fieldName: 'alternate_contact_number', width: 100 },
    { 
      label: 'Actions', 
      fieldName: 'actions', 
      width: 100,
      render: (row: any) => (
        <Tooltip title="Edit Vendor">
          <IconButton
            size="small"
            onClick={() => handleEditVendor(row.id)}
            sx={{ color: 'primary.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )
    },
  ];

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getVendors({
        search: search || undefined,
        page: page + 1, // backend is 1-based
        page_size: rowsPerPage,
      });
      setVendors(response.data || []);
      setTotal(response.count ?? (response.data?.length || 0));
      setError(null);
    } catch (err) {
      setError('Failed to fetch vendors. Please try again.');

    } finally {
      setLoading(false);
    }
  }, [search, page, rowsPerPage]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const debouncedSetSearch = useMemo(() => debounce((value: string) => {
    setPage(0);
    setSearch(value);
  }, 400), []);

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

          {/* External search input for server-side search */}
          <Box sx={{ mb: 2 }}>
            <input
              type="text"
              placeholder="Search vendors..."
              onChange={(e) => debouncedSetSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            />
          </Box>

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
              pagination={{
                page: page,
                rowsPerPage: rowsPerPage,
                totalRows: total,
                onPageChange: (newPage) => setPage(newPage),
                onRowsPerPageChange: (newRowsPerPage) => { setRowsPerPage(newRowsPerPage); setPage(0); },
                serverSide: true,
              }}
            />
          )}
        </Card>
      </Box>
      
      <VendorEditModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        vendorId={selectedVendorId}
        onSuccess={handleEditSuccess}
      />
    </SidebarLayout>
  );
};

export default Vendor;
