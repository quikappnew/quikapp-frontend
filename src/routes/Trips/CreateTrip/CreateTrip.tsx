import SidebarLayout from 'layouts/SidebarLayout';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {  getVendors, getLocationList, getVendor, getOrders, getClients, createTrip } from 'services/api';
import { toast } from 'react-toastify';
import { Card, CardContent, Typography, Box, Button, Grid } from '@mui/material';

interface Vendor {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name_of_city: string;
  // Add other fields if needed
}

interface Client {
  id: string;
  name: string;
  gst?: string;
  spoc_name?: string;
}

interface VendorOption {
  value: string;
  label: string;
}

interface LocationOption {
  value: string;
  label: string;
}

interface ClientOption {
  value: string;
  label: string;
}

interface TripFormData {
  vendor_id: string;
  order: string;
  reference_id: string;
  payment_status: string;
}

const CreateTrip: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<{ id: string; order_id: string }[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { control, register, handleSubmit, formState: { errors } } = useForm<TripFormData>();

  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
    fetchOrders();
  }, []);

  const fetchVendors = async () => {
    try {
      setIsLoadingVendors(true);
      const response = await getVendors();
      setVendors(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vendors. Please try again.');
      console.error('Error fetching vendors:', err);
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await getOrders();
      setOrders(response.data || []);
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const onSubmit = async (data: TripFormData) => {
    try {
       const response = await createTrip(data);
       console.log(response);
       toast.success('Trip created successfully');
       navigate('/trips');
      
      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      // Handle success
      console.log('Trip created successfully');
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  const vendorOptions: VendorOption[] = vendors.map(vendor => ({
    value: vendor.id,
    label: vendor.name
  }));

  const locationOptions: LocationOption[] = locations.map(location => ({
    value: location.id,
    label: location.name_of_city
  }));

  const clientOptions: ClientOption[] = clients.map(client => ({
    value: client.id,
    label: client.name,
  }));

  const orderOptions = orders.map(order => ({ value: order.id, label: order.order_id }));

  return (
    <SidebarLayout>
      <Box className="flex justify-center items-center min-h-screen bg-gray-50">
        <Card sx={{ width: '100%', maxWidth: 600, borderRadius: 4, boxShadow: 6, p: 2 }}>
          <CardContent>
            <Typography variant="h4" fontWeight={700} color="text.primary" mb={4} align="center">
              Create New Trip
            </Typography>
            {error && (
              <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300 shadow">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <label className="block text-base font-medium text-gray-800 mb-2">Vendor</label>
                  <Controller
                    name="vendor_id"
                    control={control}
                    rules={{ required: 'Vendor is required' }}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        options={vendorOptions}
                        value={vendorOptions.find(option => option.value === value) || null}
                        onChange={option => onChange(option ? option.value : '')}
                        isLoading={isLoadingVendors}
                        classNamePrefix="react-select"
                        placeholder="Search and select vendor..."
                        isClearable
                      />
                    )}
                  />
                  {errors.vendor_id && <p className="text-red-500 text-sm mt-1">{errors.vendor_id.message}</p>}
                </Grid>
                <Grid item xs={12}>
                  <label className="block text-base font-medium text-gray-800 mb-2">Order</label>
                  <Controller
                    name="order"
                    control={control}
                    rules={{ required: 'Order is required' }}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        options={orderOptions}
                        value={orderOptions.find(option => option.value === value) || null}
                        onChange={option => onChange(option ? option.value : '')}
                        isLoading={isLoadingOrders}
                        classNamePrefix="react-select"
                        placeholder="Search and select order..."
                        isClearable
                      />
                    )}
                  />
                  {errors.order && <p className="text-red-500 text-sm mt-1">{errors.order.message}</p>}
                </Grid>
                <Grid item xs={12}>
                  <label className="block text-base font-medium text-gray-800 mb-2">Reference ID</label>
                  <input
                    type="text"
                    {...register('reference_id', { required: 'Reference ID is required' })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  {errors.reference_id && <p className="text-red-500 text-sm mt-1">{errors.reference_id.message}</p>}
                </Grid>
                <Grid item xs={12}>
                  <label className="block text-base font-medium text-gray-800 mb-2">Payment Status</label>
                  <select
                    {...register('payment_status', { required: 'Payment Status is required' })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                  {errors.payment_status && <p className="text-red-500 text-sm mt-1">{errors.payment_status.message}</p>}
                </Grid>
                <Grid item xs={12}>
                <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              Create Trip
            </button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </SidebarLayout>
  );
};

export default CreateTrip;