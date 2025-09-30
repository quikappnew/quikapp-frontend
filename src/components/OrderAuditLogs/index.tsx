import { 
  Box, 
  Card, 
  Typography, 
  Avatar, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Alert
} from "@mui/material";
import { useState, FC, useEffect, useCallback } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { 
  History as HistoryIcon
} from '@mui/icons-material';
import { 
  getOrderAuditLogs,
  type OrderAuditLog
} from 'services/api';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

interface OrderAuditLogsProps {
  orderId: string;
  orderReferenceId?: string;
}

const OrderAuditLogs: FC<OrderAuditLogsProps> = ({ orderId, orderReferenceId }) => {
  const [loading, setLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<OrderAuditLog[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    page_size: 20
  });
  
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrderAuditLogs({
        order_id: orderId,
        page: currentPage,
        page_size: pagination.page_size
      });

      if (response.success) {
        setAuditLogs(response.data.audit_logs);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [orderId, currentPage, pagination.page_size]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Card sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="primary" />
            Change History
          </Typography>
        </Box>

        {auditLogs.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="info">
              No changes recorded for this order.
            </Alert>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Changes Made</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                          {log.user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {log.user.full_name || log.user.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {log.user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {log.action_display}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {log.changes_summary}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {dayjs(log.created_at).format('DD MMM YYYY')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(log.created_at).format('HH:mm')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Pagination
              count={pagination.total_pages}
              page={pagination.current_page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default OrderAuditLogs;
