import SidebarLayout from 'layouts/SidebarLayout';
import React, { useEffect, useState, useCallback } from 'react';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import Select from 'react-select';
import { createTrip, getVendors, getOrders, getOnboardedVehicles, getAvailableVehicles } from 'services/api';
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
  const [useNewVehicleAPI, setUseNewVehicleAPI] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const paymentStatusOptions: PaymentStatusOption[] = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
    { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
    { value: 'OVERDUE', label: 'Overdue' }
  ];

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

  const fetchVehicles = useCallback(async () => {
    try {
      setIsLoadingVehicles(true);
      
      if (useNewVehicleAPI) {
        // Use new available vehicles API
        const response = await getAvailableVehicles();
        
        if (response.success && response.data.vehicles) {
          const vehicleData = response.data.vehicles;
          
          if (vehicleData.length === 0) {
            setVehicleOptions([]);
            return;
          }
          
          const mappedVehicles = vehicleData.map((vehicle: any) => {
            const ownerLabel = vehicle.vehicle_owner === 'OWN_VEHICLE' ? 'Own' : 'Rented';
            const vendorInfo = vehicle.vendor_name ? ` (${vehicle.vendor_name})` : '';
            return {
              value: vehicle.id?.toString() || '',
              label: `${vehicle.vehicle_number || 'N/A'} - ${vehicle.truck_length || 'N/A'} - ${ownerLabel}${vendorInfo}`
            };
          });
          
          setVehicleOptions(mappedVehicles);
        } else {
          setVehicleOptions([]);
        }
      } else {
        // Use existing onboarded vehicles API
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
      }
    } catch (error) {
      setErrorMessage('Failed to fetch vehicles.');
    } finally {
      setIsLoadingVehicles(false);
    }
  }, [useNewVehicleAPI]);

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

  useEffect(() => {
    fetchVendors();
    fetchOrders();
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-base font-medium text-gray-800">Vehicle</label>
                <button
                  type="button"
                  onClick={() => setUseNewVehicleAPI(!useNewVehicleAPI)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    useNewVehicleAPI 
                      ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  {useNewVehicleAPI ? 'Enhanced View' : 'Standard View'}
                </button>
              </div>
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
                    placeholder={useNewVehicleAPI ? "Search available vehicles..." : "Search and select vehicle..."}
                    isClearable
                  />
                )}
              />
              {errors.vehicleId && (
                <p className="text-red-500 text-sm mt-1">{errors.vehicleId.message}</p>
              )}
              {useNewVehicleAPI && (
                <p className="text-xs text-blue-600 mt-1">
                  Enhanced view shows vehicle ownership and vendor information
                </p>
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