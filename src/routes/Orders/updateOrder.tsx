import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrder, getClients, getLocationList, OrderData } from 'services/api';
import SidebarLayout from 'layouts/SidebarLayout';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';

export default function UpdateOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [clientOptions, setClientOptions] = useState<any[]>([]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<OrderData>();

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch options first
        const [locRes, cliRes] = await Promise.all([getLocationList(), getClients()]);
        const locOpts = (locRes?.data || []).map((loc: any) => ({
          value: loc.id.toString(),
          label: loc.name_of_city
        }));
        const cliOpts = (cliRes?.data || []).map((client: any) => ({
          value: client.id.toString(),
          label: client.name
        }));
        setLocationOptions(locOpts);
        setClientOptions(cliOpts);

        // Now fetch the order
        const response = await getOrderById(id!);
        const data = response.data;

        reset({
          order_id: data.order_id,
          order_date: data.order_date,
          order_pricing: data.order_pricing,
          from_location_id: data.from_location ? data.from_location.toString() : '',
          to_location_id: data.to_location ? data.to_location.toString() : '',
          client_id: data.client ? data.client.toString() : '',
        });
      } catch (err: any) {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    loadAll();
    // eslint-disable-next-line
  }, [id]);

  const onSubmit: SubmitHandler<OrderData> = async (data) => {
    setSuccessMessage('');
    setError('');
    try {
      await updateOrder(id!, data);
      setSuccessMessage('Order updated successfully!');
      setTimeout(() => navigate('/orders/get-orders'), 1500);
    } catch (err: any) {
      setError('Failed to update order');
    }
  };

  return (
    <SidebarLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Update Order</h2>
          {successMessage && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300 shadow">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300 shadow">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-lg text-gray-500">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-800 mb-2">Order Pricing</label>
                <Controller
                  name="order_pricing"
                  control={control}
                  rules={{ required: 'Order pricing is required' }}
                  render={({ field }) => (
                    <input
                      type="number"
                      {...field}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  )}
                />
                {errors.order_pricing && (
                  <p className="text-red-500 text-sm mt-1">{errors.order_pricing.message}</p>
                )}
              </div>
              <div>
                <label className="block text-base font-medium text-gray-800 mb-2">From Location</label>
                <Controller
                  name="from_location_id"
                  control={control}
                  rules={{ required: 'From Location is required' }}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      options={locationOptions}
                      value={locationOptions.find(option => option.value === value) || null}
                      onChange={option => onChange(option ? option.value : '')}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select from location..."
                      isClearable
                    />
                  )}
                />
                {errors.from_location_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.from_location_id.message}</p>
                )}
              </div>
              <div>
                <label className="block text-base font-medium text-gray-800 mb-2">To Location</label>
                <Controller
                  name="to_location_id"
                  control={control}
                  rules={{ required: 'To Location is required' }}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      options={locationOptions}
                      value={locationOptions.find(option => option.value === value) || null}
                      onChange={option => onChange(option ? option.value : '')}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select to location..."
                      isClearable
                    />
                  )}
                />
                {errors.to_location_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.to_location_id.message}</p>
                )}
              </div>
              <div>
                <label className="block text-base font-medium text-gray-800 mb-2">Client</label>
                <Controller
                  name="client_id"
                  control={control}
                  rules={{ required: 'Client is required' }}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      options={clientOptions}
                      value={clientOptions.find(option => option.value === value) || null}
                      onChange={option => onChange(option ? option.value : '')}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select client..."
                      isClearable
                    />
                  )}
                />
                {errors.client_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.client_id.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                Update Order
              </button>
            </form>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}