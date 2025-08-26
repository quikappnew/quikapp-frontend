import React, { useEffect, useMemo, useState } from 'react';
import { getOrders, Order, APIOrderResponse } from 'services/api';
import SidebarLayout from 'layouts/SidebarLayout';
import DataTable from 'components/DataTable';
import { useNavigate } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import debounce from 'utils/debounce';
import { Box, Card, Typography, TextField, Grid, Tabs, Tab } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Analytics from 'components/Analytics';



export default function GetOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs().subtract(30, 'day'));
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [activeTab, setActiveTab] = useState(0);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  const navigate = useNavigate();

const columns = [
  { label: 'Order ID', fieldName: 'order_id', width: 150 },
  { label: 'Order Date', fieldName: 'created_at', width: 120 },
  { label: 'Pricing', fieldName: 'order_pricing', width: 100 },
  { label: 'From Location', fieldName: 'from_location_name', width: 180 },
  { label: 'To Location', fieldName: 'to_location_name', width: 180 },
  { label: 'Client', fieldName: 'client_name', width: 120 },
  { label: 'Trip Status', fieldName: 'status', width: 120 },
  { label: 'Created By', fieldName: 'created_by', width: 150 },
  { label: 'Actions', fieldName: 'actions', width: 200 },
];

  useEffect(() => {
    fetchOrders();
  }, [search, page, rowsPerPage, startDate, endDate]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getOrders({ 
        search: search || undefined, 
        page: page + 1, 
        page_size: rowsPerPage,
        start_date: startDate?.format('YYYY-MM-DD'),
        end_date: endDate?.format('YYYY-MM-DD')
      });
      const processedOrders = (response.data || []).map((order: any) => ({
        ...order,
        created_at: new Date(order.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        status: order.order_status?.has_trips ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="text-green-600">✅</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {order.order_status.status}
              </span>
            </div>
            <span className="text-xs text-gray-500 ml-5">
              {order.order_status.trip_count} trip{order.order_status.trip_count !== 1 ? 's' : ''}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-orange-500">⏳</span>
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
              {order.order_status?.status || 'Pending Trip Creation'}
            </span>
          </div>
        ),
        created_by: (
          <div className="flex flex-col">
            <span className="font-medium">
              {order.order_created_by?.full_name || order.order_created_by?.username || 'Unknown User'}
            </span>
            {order.order_created_by?.phone_number && (
              <span className="text-xs text-gray-500">{order.order_created_by.phone_number}</span>
            )}
          </div>
        ),
        actions: (
          <div className="flex gap-2">
            <button
              className="text-blue-600 hover:bg-blue-50 rounded-full p-1 transition"
              title="View Details"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </button>
            <button
              className="text-yellow-600 hover:bg-yellow-50 rounded-full p-1 transition"
              title="Edit"
              onClick={() => navigate(`/orders/update/${order.id}`)}
            >
              <EditOutlinedIcon fontSize="small" />
            </button>
            {order.order_status?.has_trips ? (
              <button
                className="text-green-600 hover:bg-green-50 rounded-full p-1 transition"
                title="View Trips"
                onClick={() => navigate(`/trips?order_id=${order.id}`)}
              >
                <span className="text-sm">🚛</span>
              </button>
            ) : (
              <button
                className="text-purple-600 hover:bg-purple-50 rounded-full p-1 transition"
                title="Create Trip"
                onClick={() => navigate(`/trips/create?order_id=${order.id}`)}
              >
                <span className="text-sm">➕</span>
              </button>
            )}
          </div>
        ),
      }));

      setOrders(processedOrders);
      setAllOrders(response.data || []); // Store raw data for analytics
      setTotal(response.count ?? (response.data?.length || 0));
    } catch (err: any) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const debouncedSetSearch = useMemo(() => debounce((value: string) => {
    setPage(0);
    setSearch(value);
  }, 400), []);

  return (
    <SidebarLayout>
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-full bg-white rounded-2xl shadow-lg p-8 mx-4">
          <h2 className="text-xl font-bold mb-2 text-gray-500">Orders</h2>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="Orders List" />
              <Tab label="Analytics" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <>
              {/* Date Range Filter */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small"
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small"
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>

              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Total Orders</Typography>
                  <Typography variant="h5">{total}</Typography>
                </Card>
                <Card sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">This Page</Typography>
                  <Typography variant="h5">{orders.length}</Typography>
                </Card>
                <Card sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Page</Typography>
                  <Typography variant="h5">{page + 1}</Typography>
                </Card>
                <Card sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Page Size</Typography>
                  <Typography variant="h5">{rowsPerPage}</Typography>
                </Card>
              </div>

              {/* External server-side search */}
              <Box sx={{ mb: 4 }}>
                <input
                  type="text"
                  placeholder="Search orders..."
                  onChange={(e) => debouncedSetSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </Box>
              
              {error && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300 shadow">
                  {error}
                </div>
              )}
              
              {loading ? (
                <div className="text-center text-lg text-gray-500">Loading...</div>
              ) : (
                <div className="w-full">
                  <DataTable
                    data={orders}
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
                </div>
              )}
            </>
          )}

          {activeTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <Analytics 
                ordersData={allOrders}
                dateRange={{
                  start: startDate?.format('YYYY-MM-DD') || '',
                  end: endDate?.format('YYYY-MM-DD') || ''
                }}
              />
            </Box>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}