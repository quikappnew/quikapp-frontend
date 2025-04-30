import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { getLocationList, getVendors, getClients } from 'services/api';

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
  reference_id: string;
  payment_status: string;
  initial_status: string;
  initial_notes: string;
}

const CreateTrip: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { control, register, handleSubmit, formState: { errors } } = useForm<TripFormData>();

  useEffect(() => {
    fetchVendors();
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



  const onSubmit = async (data: TripFormData) => {
    try {
      const response = await fetch('/api/v2/core/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Trip</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Vendor</label>
          <Controller
            name="vendor_id"
            control={control}
            rules={{ required: 'Vendor is required' }}
            render={({ field: { onChange, value } }) => (
              <Select<VendorOption>
                options={vendorOptions}
                value={vendorOptions.find((option) => option.value === value)}
                onChange={(option) => onChange(option?.value)}
                isLoading={isLoadingVendors}
                className="mt-1"
                placeholder="Search and select vendor..."
                isClearable
                classNamePrefix="react-select"
              />
            )}
          />
          {errors.vendor_id && <p className="text-red-500 text-sm">{errors.vendor_id.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reference ID</label>
          <input
            type="text"
            {...register('reference_id', { required: 'Reference ID is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.reference_id && <p className="text-red-500 text-sm">{errors.reference_id.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Status</label>
          <select
            {...register('payment_status', { required: 'Payment Status is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="FAILED">FAILED</option>
          </select>
          {errors.payment_status && <p className="text-red-500 text-sm">{errors.payment_status.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Initial Status</label>
          <select
            {...register('initial_status', { required: 'Initial Status is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="CREATED">CREATED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
          {errors.initial_status && <p className="text-red-500 text-sm">{errors.initial_status.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Initial Notes</label>
          <textarea
            {...register('initial_notes')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
          {errors.initial_notes && <p className="text-red-500 text-sm">{errors.initial_notes.message}</p>}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Trip
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;