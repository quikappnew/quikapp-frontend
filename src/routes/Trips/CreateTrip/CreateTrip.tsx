import SidebarLayout from 'layouts/SidebarLayout';
import React, { useEffect, useState } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';
import { createTrip, getVendors, getOrders, getOnboardedVehicles } from 'services/api';
import type { CreateTripData } from 'types/api';

interface VendorOption {
  value: string;
  label: string;
}

interface OrderOption {
  value: string;
  label: string;
}

interface VehicleOption {
  value: string;
  label: string;
}

interface PaymentStatusOption {
  value: string;
  label: string;
}

export default function CreateTrip() {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<CreateTripData>({
    defaultValues: {
      referenceId: '',
      scheduledDate: new Date().toISOString().slice(0, 16),
      fromLocation: '',
      toLocation: '',
      distance: 0,
      duration: 0,
      specialInstructions: '',
      vehicleId: '',
      driverId: '',
      vendorId: '',
      clientId: '',
      totalAmount: 0,
      internalNotes: ''
    }
  });

  const [vendorOptions, setVendorOptions] = useState<VendorOption[]>([]);
  const [orderOptions, setOrderOptions] = useState<OrderOption[]>([]);
  const [vehicleOptions, setVehicleOptions] = useState<VehicleOption[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const paymentStatusOptions: PaymentStatusOption[] = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
    { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
    { value: 'OVERDUE', label: 'Overdue' }
  ];

  useEffect(() => {
    fetchVendors();
    fetchOrders();
    fetchVehicles();
  }, []);

  const fetchVendors = async () => {
    try {
      setIsLoadingVendors(true);
      const response = await getVendors({ page_size: 100 });
      if (response?.data) {
        const vendorData = response.data;
        setVendorOptions(vendorData.map((vendor: any) => ({
          value: vendor.id.toString(),
          label: vendor.name
        })));
      }
    } catch (error) {
      setErrorMessage('Failed to fetch vendors.');
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await getOrders({ page_size: 100 });
      if (response?.data) {
        const orderData = response.data;
        // Filter out orders that already have trips
        const ordersWithoutTrips = orderData.filter((order: any) => {
          // Check if order has no trips or trip_count is 0
          return !order.order_status?.has_trips && (!order.order_status?.trip_count || order.order_status.trip_count === 0);
        });
        
        setOrderOptions(ordersWithoutTrips.map((order: any) => ({
          value: order.id.toString(),
          label: `${order.order_id} - ${order.client_name}`
        })));
      }
    } catch (error) {
      setErrorMessage('Failed to fetch orders.');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      setIsLoadingVehicles(true);
      const response = await getOnboardedVehicles();
      
      if (response?.data) {
        const vehicleData = response.data;
        
        if (vehicleData.length === 0) {
          setVehicleOptions([]);
          return;
        }
        
        const mappedVehicles = vehicleData.map((vehicle: any) => {
          return {
            value: vehicle.id?.toString() || '',
            label: `${vehicle.vehicle_number || 'N/A'} - ${vehicle.truck_length_feet || 'N/A'}`
          };
        });
        
        setVehicleOptions(mappedVehicles);
      } else {
        setVehicleOptions([]);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch vehicles.');
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  const onSubmit: SubmitHandler<CreateTripData> = async (data) => {
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await createTrip(data);
      setSuccessMessage('Trip created successfully!');
      reset();
    } catch (error: any) {
      setErrorMessage(error?.message || 'Failed to create trip.');
    }
  };

  return (
    <SidebarLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
          <h4 className="text-xl font-bold mb-8 text-gray-500">Create Trip</h4>
          
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
              <label className="block text-base font-medium text-gray-800 mb-2">Vendor</label>
              <Controller
                name="vendorId"
                control={control}
                rules={{ required: 'Vendor is required' }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={vendorOptions}
                    value={vendorOptions.find(option => option.value === value) || null}
                    onChange={option => onChange(option ? option.value : '')}
                    isLoading={isLoadingVendors}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Search and select vendor..."
                    isClearable
                  />
                )}
              />
              {errors.vendorId && (
                <p className="text-red-500 text-sm mt-1">{errors.vendorId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-gray-800 mb-2">Order</label>
              <Controller
                name="clientId"
                control={control}
                rules={{ required: 'Order is required' }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={orderOptions}
                    value={orderOptions.find(option => option.value === value) || null}
                    onChange={option => onChange(option ? option.value : '')}
                    isLoading={isLoadingOrders}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Search and select order..."
                    isClearable
                  />
                )}
              />
              {errors.clientId && (
                <p className="text-red-500 text-sm mt-1">{errors.clientId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-gray-800 mb-2">Vehicle</label>
              <Controller
                name="vehicleId"
                control={control}
                rules={{ required: 'Vehicle is required' }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={vehicleOptions}
                    value={vehicleOptions.find(option => option.value === value) || null}
                    onChange={option => onChange(option ? option.value : '')}
                    isLoading={isLoadingVehicles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Search and select vehicle..."
                    isClearable
                  />
                )}
              />
              {errors.vehicleId && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-gray-800 mb-2">Reference ID</label>
              <Controller
                name="referenceId"
                control={control}
                rules={{ required: 'Reference ID is required' }}
                render={({ field }) => (
                  <input
                    type="text"
                    {...field}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter reference ID"
                  />
                )}
              />
              {errors.referenceId && (
                <p className="text-red-500 text-sm mt-1">{errors.referenceId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-gray-800 mb-2">Payment Status</label>
              <Controller
                name="driverId"
                control={control}
                rules={{ required: 'Payment status is required' }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={paymentStatusOptions}
                    value={paymentStatusOptions.find(option => option.value === value) || null}
                    onChange={option => onChange(option ? option.value : '')}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select payment status..."
                    isClearable
                  />
                )}
              />
              {errors.driverId && (
                <p className="text-red-500 text-sm mt-1">{errors.driverId.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              Create Trip
            </button>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
}