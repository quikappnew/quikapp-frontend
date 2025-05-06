import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper, Link as MuiLink, Button, Stack, Divider, Grid, Chip } from '@mui/material';
import SidebarLayout from 'layouts/SidebarLayout';
import { getVendorOnboardingById, updateVendorOnboarding } from 'services/api';

function getAbsoluteUrl(url: string) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return 'https://' + url;
}

function getStatusColor(status: string) {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
    case 'COMPLETED':
      return 'success';
    case 'REJECTED':
      return 'error';
    case 'INITIATED':
      return 'warning';
    default:
      return 'default';
  }
}

const VendorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchVendor();
    // eslint-disable-next-line
  }, [id]);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const response = await getVendorOnboardingById(id!);
      setVendor(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vendor details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleApprove = async () => {
    try {
      await updateVendorOnboarding(id!, { status: 'COMPLETED' });
      alert('Vendor approved successfully!');
      fetchVendor();
      navigate('/vendor/list');
    } catch (err) {
      alert('Failed to approve vendor.');
    }
  };

  const handleReject = async () => {
    try {
      await updateVendorOnboarding(id!, { status: 'REJECTED' });
      alert('Vendor rejected successfully!');
      fetchVendor();
      navigate(-1);
    } catch (err) {
      alert('Failed to reject vendor.');
    }
  };

  return (
    <SidebarLayout>
      <Box sx={{ maxWidth: 700, mx: 'auto', mt: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight={600}>
            Vendor Details
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleBack}>
            Back
          </Button>
        </Stack>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
        ) : vendor ? (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={500} mb={2} color="primary.main">
              {vendor.name}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography color="text.secondary"><b>GST:</b> {vendor.gst}</Typography>
                <Typography color="text.secondary"><b>PAN:</b> {vendor.pan}</Typography>
                <Typography color="text.secondary"><b>SPOC Name:</b> {vendor.spoc_name}</Typography>
                <Typography color="text.secondary"><b>SPOC Phone:</b> {vendor.spoc_phone}</Typography>
                <Typography color="text.secondary"><b>SPOC Email:</b> {vendor.spoc_email}</Typography>
                <Box mt={1} mb={1}>
                  <Chip
                    label={vendor.status ? vendor.status.toUpperCase() : '-'}
                    color={getStatusColor(vendor.status)}
                    variant="filled"
                    sx={{ fontWeight: 600, letterSpacing: 1 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography color="text.secondary">
                  <b>Cancelled Cheque:</b> {vendor.cancelled_cheque && (
                    <a
                      href={getAbsoluteUrl(vendor.cancelled_cheque)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}
                    >
                      View
                    </a>
                  )}
                </Typography>
                <Typography color="text.secondary">
                  <b>GST Certificate:</b> {vendor.gst_certificate && (
                    <MuiLink href={getAbsoluteUrl(vendor.gst_certificate)} target="_blank" rel="noopener noreferrer" color="secondary">
                      View
                    </MuiLink>
                  )}
                </Typography>
                <Typography color="text.secondary">
                  <b>PAN Card:</b> {vendor.pan_card && (
                    <MuiLink href={getAbsoluteUrl(vendor.pan_card)} target="_blank" rel="noopener noreferrer" color="secondary">
                      View
                    </MuiLink>
                  )}
                </Typography>
                <Typography color="text.secondary">
                  <b>Address Proof:</b> {vendor.address_proof && (
                    <MuiLink href={getAbsoluteUrl(vendor.address_proof)} target="_blank" rel="noopener noreferrer" color="secondary">
                      View
                    </MuiLink>
                  )}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography color="text.secondary"><b>Verification Notes:</b> {vendor.verification_notes || '-'}</Typography>
                <Typography color="text.secondary"><b>Verified By:</b> {vendor.verified_by || '-'}</Typography>
                <Typography color="text.secondary"><b>Completed At:</b> {vendor.completed_at || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography color="text.secondary"><b>Created At:</b>   {vendor.created_at ? new Date(vendor.created_at).toLocaleString() : '-'}</Typography>
                <Typography color="text.secondary"><b>Updated At:</b> {vendor.updated_at ? new Date(vendor.updated_at).toLocaleString() : '-'}</Typography>
              </Grid>
            </Grid>
            <Stack direction="row" spacing={2} mt={4} justifyContent="flex-end">
              <Button variant="contained" color="success" onClick={handleApprove} disabled={vendor.status && vendor.status.toUpperCase() === 'COMPLETED'}>
                Approve
              </Button>
              <Button variant="contained" color="error" onClick={handleReject} disabled={vendor.status && vendor.status.toUpperCase() === 'REJECTED'}>
                Reject
              </Button>
            </Stack>
          </Paper>
        ) : null}
      </Box>
    </SidebarLayout>
  );
};

export default VendorDetails; 