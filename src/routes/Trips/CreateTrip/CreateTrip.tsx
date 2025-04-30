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
  from_location_id: string;
  to_location_id: string;
  client_id: string;
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
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { control, register, handleSubmit, formState: { errors } } = useForm<TripFormData>();

  useEffect(() => {
    fetchVendors();
    fetchLocations();
    fetchClients();
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

  const fetchLocations = async () => {
    try {
      setIsLoadingLocations(true);
      const response = await getLocationList();
      if (response?.data) {
        const locationData = response.data;
        setLocations(locationData.map((loc: any) => ({
          id: loc.id.toString(),
          name_of_city: loc.name_of_city
        })));
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
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
        console.log("clientData",clientData);
        setClients(clientData.map((client: any) => ({
          id: client.id.toString(),
          name: client.name,
        })));
      } else {
        setClients([]);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setIsLoadingClients(false);
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
          <label className="block text-sm font-medium text-gray-700">From Location</label>
          <Controller
            name="from_location_id"
            control={control}
            rules={{ required: 'From Location is required' }}
            render={({ field: { onChange, value } }) => (
              <Select<LocationOption>
                options={locationOptions}
                value={locationOptions.find((option) => option.value === value)}
                onChange={(option) => onChange(option?.value)}
                isLoading={isLoadingLocations}
                className="mt-1"
                placeholder="Search and select from location..."
                isClearable
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '42px',
                    borderColor: '#D1D5DB',
                    '&:hover': {
                      borderColor: '#9CA3AF'
                    }
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: '#6B7280'
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999
                  })
                }}
              />
            )}
          />
          {errors.from_location_id && <p className="text-red-500 text-sm">{errors.from_location_id.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">To Location</label>
          <Controller
            name="to_location_id"
            control={control}
            rules={{ required: 'To Location is required' }}
            render={({ field: { onChange, value } }) => (
              <Select<LocationOption>
                options={locationOptions}
                value={locationOptions.find((option) => option.value === value)}
                onChange={(option) => onChange(option?.value)}
                isLoading={isLoadingLocations}
                className="mt-1"
                placeholder="Search and select to location..."
                isClearable
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '42px',
                    borderColor: '#D1D5DB',
                    '&:hover': {
                      borderColor: '#9CA3AF'
                    }
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: '#6B7280'
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999
                  })
                }}
              />
            )}
          />
          {errors.to_location_id && <p className="text-red-500 text-sm">{errors.to_location_id.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Client</label>
          <Controller
            name="client_id"
            control={control}
            rules={{ required: 'Client is required' }}
            render={({ field: { onChange, value } }) => (
              <Select<ClientOption>
                options={clientOptions}
                value={clientOptions.find((option) => option.value === value)}
                onChange={(option) => onChange(option?.value)}
                isLoading={isLoadingClients}
                className="mt-1"
                placeholder="Search and select client..."
                isClearable
                classNamePrefix="react-select"
                formatOptionLabel={(option: ClientOption) => (
                  <div>
                    <div>{option.label}</div>
                  </div>
                )}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '42px',
                    borderColor: '#D1D5DB',
                    '&:hover': {
                      borderColor: '#9CA3AF'
                    }
                  }),
                  option: (base) => ({
                    ...base,
                    padding: '8px 12px'
                  })
                }}
              />
            )}
          />
          {errors.client_id && <p className="text-red-500 text-sm">{errors.client_id.message}</p>}
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