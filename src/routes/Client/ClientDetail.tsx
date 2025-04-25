import { Box, Card, CardContent, Typography, Grid, CircularProgress, Button, TextField } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getClientDetails, updateClient } from 'services/api';
import SidebarLayout from 'layouts/SidebarLayout';
import ErrorMessage from 'components/ErrorMessage';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadClientDetails = async () => {
      try {
        setLoading(true);
        const response = await getClientDetails(id!);
        setClient(response.data);
        setEditedClient(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load client details');
      } finally {
        setLoading(false);
      }
    };

    loadClientDetails();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedClient(client);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateClient(id!, editedClient);
      setClient(editedClient);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update client');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedClient({ ...editedClient, [field]: event.target.value });
  };

  if (loading) {
    return (
      <SidebarLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <ErrorMessage error={{ message: error }} />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Client Details</Typography>
          <Box>
            {isEditing ? (
              <>
                <Button onClick={handleCancel} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={handleEdit}>
                Edit
              </Button>
            )}
          </Box>
        </Box>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  Client Name
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editedClient?.name || ''}
                    onChange={handleChange('name')}
                  />
                ) : (
                  <Typography variant="body1">{client?.name}</Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  GST Number
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editedClient?.gst || ''}
                    onChange={handleChange('gst')}
                  />
                ) : (
                  <Typography variant="body1">{client?.gst}</Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  PAN Number
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editedClient?.pan || ''}
                    onChange={handleChange('pan')}
                  />
                ) : (
                  <Typography variant="body1">{client?.pan}</Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  SPOC Name
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editedClient?.spoc_name || ''}
                    onChange={handleChange('spoc_name')}
                  />
                ) : (
                  <Typography variant="body1">{client?.spoc_name}</Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  Contact Number
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editedClient?.contact_number || ''}
                    onChange={handleChange('contact_number')}
                  />
                ) : (
                  <Typography variant="body1">{client?.contact_number}</Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="textSecondary">
                  Contact Email
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    value={editedClient?.contact_email || ''}
                    onChange={handleChange('contact_email')}
                  />
                ) : (
                  <Typography variant="body1">{client?.contact_email}</Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </SidebarLayout>
  );
};

export default ClientDetail; 