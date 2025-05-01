import SidebarLayout from 'layouts/SidebarLayout';
import React, { useEffect, useState } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';
import { createOrder, getClients, getLocationList, OrderData } from 'services/api';

interface LocationOption {
  value: string;
  label: string;
}

interface ClientOption {
  value: string;
  label: string;
}

export default function CreateOrder() {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<OrderData>({
    defaultValues: {
      order_id: '',
      order_date: new Date().toISOString().split('T')[0],
      order_pricing: 0,
      from_location_id: '',
      to_location_id: '',
      client_id: ''
    }
  });

  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchLocations();
    fetchClients();
  }, []);

  const fetchLocations = async () => {
    try {
      setIsLoadingLocations(true);
      const response = await getLocationList();
      if (response?.data) {
        const locationData = response.data;
        setLocationOptions(locationData.map((loc: any) => ({
          value: loc.id.toString(),
          label: loc.name_of_city
        })));
      }
    } catch (error) {
      setErrorMessage('Failed to fetch locations.');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const fetchClients = async () => {
    try {
      setIsLoadingClients(true);
      const response = await getClients();
      if (response?.data) {
        const clientData = response.data;
        setClientOptions(clientData.map((client: any) => ({
          value: client.id.toString(),
          label: client.name
        })));
      }
    } catch (error) {
      setErrorMessage('Failed to fetch clients.');
    } finally {
      setIsLoadingClients(false);
    }
  };

  const onSubmit: SubmitHandler<OrderData> = async (data) => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await createOrder(data);
      setSuccessMessage('Order created successfully!');
      reset();
    } catch (error: any) {
      setErrorMessage(error?.message || 'Failed to create order.');
    }
  };

  return (
    <SidebarLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
          <h4 className="text-xl font-bold mb-8 text-gray-500">Create Order</h4>
          {successMessage && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300 shadow">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300 shadow">
              {errorMessage}
            </div>
          )}
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
                    isLoading={isLoadingLocations}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Search and select from location..."
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
                    isLoading={isLoadingLocations}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Search and select to location..."
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
                    isLoading={isLoadingClients}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Search and select client..."
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
              Create Order
            </button>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
} 