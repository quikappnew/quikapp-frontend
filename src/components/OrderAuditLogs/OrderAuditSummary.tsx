import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Person as PersonIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { getOrderAuditSummary, type OrderAuditSummaryResponse } from 'services/api';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

interface OrderAuditSummaryProps {
  orderId: string;
}

const OrderAuditSummary: React.FC<OrderAuditSummaryProps> = ({ orderId }) => {
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<OrderAuditSummaryResponse['data'] | null>(null);
  const [error, setError] = useState('');

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getOrderAuditSummary(orderId);
      
      if (response.success) {
        setSummaryData(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch audit summary:', err);
      setError('Failed to load audit summary');
      toast.error('Failed to load audit summary');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchSummary();
    }
  }, [orderId, fetchSummary]);

  if (loading) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!summaryData) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Alert severity="info">No audit data available for this order.</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <TimelineIcon color="primary" />
          Audit Summary
        </Typography>

        <Grid container spacing={3}>
          {/* Summary Statistics */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Change Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
                    <Typography variant="h4" color="primary.main" fontWeight={700}>
                      {summaryData.summary.total_changes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Changes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                    <Typography variant="h4" color="success.main" fontWeight={700}>
                      {Object.keys(summaryData.summary.users_breakdown).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Users Involved
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Actions Breakdown */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Actions Breakdown
              </Typography>
              {Object.entries(summaryData.summary.actions_breakdown).map(([action, count]) => (
                <Box key={action} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip 
                    label={action} 
                    size="small" 
                    color={action === 'Created' ? 'success' : action === 'Updated' ? 'primary' : 'error'}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    {count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Users Breakdown & Timeline */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Users Activity
              </Typography>
              {Object.entries(summaryData.summary.users_breakdown).map(([username, count]) => (
                <Box key={username} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {username}
                  </Typography>
                  <Chip label={`${count} changes`} size="small" variant="outlined" />
                </Box>
              ))}
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Timeline
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  First Change: {dayjs(summaryData.summary.first_change).format('MMM DD, YYYY HH:mm')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Change: {dayjs(summaryData.summary.last_change).format('MMM DD, YYYY HH:mm')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Recent Changes */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Recent Changes
            </Typography>
            <List>
              {summaryData.recent_changes.map((change, index) => (
                <ListItem key={change.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EditIcon fontSize="small" color="action" />
                        <Typography variant="body2" fontWeight={600}>
                          {change.action} by {change.user}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dayjs(change.created_at).format('MMM DD, YYYY HH:mm')}
                        </Typography>
                      </Box>
                    }
                    secondary={change.changes_summary}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrderAuditSummary;
