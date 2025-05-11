import React, { useEffect, useState } from 'react';
import { getOrders, Order } from 'services/api';
import SidebarLayout from 'layouts/SidebarLayout';
import DataTable from 'components/DataTable';
import { useNavigate } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';



export default function GetOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

const columns = [
//   { label: 'Order ID', fieldName: 'order_id', width: 100 },
  { label: 'Order Date', fieldName: 'created_at', width: 120 },
  { label: 'Pricing', fieldName: 'order_pricing', width: 100 },
  { label: 'From Location', fieldName: 'from_location_name', width: 180 },
  { label: 'To Location', fieldName: 'to_location_name', width: 180 },
  { label: 'Client', fieldName: 'client_name', width: 120 },
  { label: 'Actions', fieldName: 'actions', width: 180 },
];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getOrders();
      setOrders(
        (response.data || []).map((order: any) => ({
          ...order,
          created_at: new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
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
            </div>
          ),
        }))
      );
    } catch (err: any) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="flex  min-h-screen bg-gray-50">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold mb-2 text-gray-500">Orders</h2>
          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300 shadow">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-lg text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable
                data={orders}
                columns={columns}
                searchFields={['order_id', 'order_date', 'from_location_name', 'to_location_name', 'client_name']}
              />
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}