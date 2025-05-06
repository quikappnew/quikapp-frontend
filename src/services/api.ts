import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getToken } from 'utils/auth';
import type {
  ApiError as ApiErrorInterface,
  CategoryEnum,
  IdentityCardStatusEnum,
  Document as DocumentType,
  PaginatedResponse,
  User,
  Province,
  UserStatusEnum,
  Address,
  IdentityCard,
  DocumentTypeEnum
} from 'types/api';
import { VerifyOTPResponse } from 'routes/Login/types';
import { TokenService } from './tokenService';

const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export class ApiError extends Error implements ApiErrorInterface {
  public status: string;
  public code: number;

  constructor(message: string, status: string = 'error', code: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }

  static fromAxiosError(error: any, defaultMessage: string): ApiError {
    if (axios.isAxiosError(error)) {
      const status = error.response?.data?.status || error.response?.statusText || 'error';
      const code = error.response?.data?.code || error.response?.status || 500;
      return new ApiError(
        error.response?.data?.message || defaultMessage,
        status,
        code
      );
    }
    return new ApiError(defaultMessage);
  }
}

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = TokenService.getToken();

    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      TokenService.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface GetUsersParams {
  limit?: number;
  cursor?: string;
  filters?: {
    status?: string;
    category?: string;
    province?: string;
  };
}

export const getUsers = async (params: GetUsersParams = {}): Promise<PaginatedResponse<User>> => {
  try {
    const response = await api.get('/users', { params });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch users');
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to delete user');
  }
};

interface CreateUserData {
  provinceId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  provinceOfOrigin?: string;
  category: string;
  photo?: File;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export const createUser = async (data: CreateUserData): Promise<User> => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'address' && value) {
        Object.entries(value).forEach(([addressKey, addressValue]) => {
          if (addressValue) {
            formData.append(`address.${addressKey}`, addressValue.toString());
          }
        });
      } else if (key === 'photo' && value) {
        formData.append('photo', value);
      } else if (value) {
        formData.append(key, value);
      }
    });

    const response = await api.post('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to create user');
  }
};

export const getProvinces = async (): Promise<Province[]> => {
  try {
    const response = await api.get('/provinces');
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch provinces');
  }
};

export const getUser = async (id: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch user');
  }
};

interface UpdateUserData {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  category: string;
  provinceOfOrigin?: string;
  photo?: File;
}

export const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'photo' && value instanceof File) {
        formData.append('photo', value);
      } else if (value) {
        formData.append(key, value);
      }
    });

    const response = await api.patch(`/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to update user');
  }
};

export const updateUserStatus = async (id: string, status: UserStatusEnum): Promise<User> => {
  try {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to update user status');
  }
};

interface UpdateAddressData {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const updateAddress = async (id: string, data: UpdateAddressData): Promise<Address> => {
  try {
    const response = await api.patch(`/addresses/${id}`, data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to update address');
  }
};

export const getIdentityCards = async (userId: string): Promise<IdentityCard[]> => {
  try {
    const response = await api.get(`/users/${userId}/identity-cards`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch identity cards');
  }
};

interface CreateIdentityCardData {
  cardNumber?: string;
  issueDate?: string;
  expiryDate?: string;
}

export const createIdentityCard = async (userId: string, data: CreateIdentityCardData): Promise<IdentityCard> => {
  try {
    const response = await api.post(`/users/${userId}/identity-cards`, data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to create identity card');
  }
};

export const getDocuments = async (userId: string): Promise<DocumentType[]> => {
  try {
    const response = await api.get(`/users/${userId}/documents`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch documents');
  }
};

interface CreateDocumentData {
  name: string;
  description?: string;
  type: DocumentTypeEnum;
  file: File;
}

export const createDocument = async (userId: string, data: CreateDocumentData): Promise<Document> => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) {
      formData.append('description', data.description);
    }
    formData.append('type', data.type);
    formData.append('file', data.file);

    const response = await api.post(`/users/${userId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to create document');
  }
};

export const getIdentityCard = async (id: string): Promise<IdentityCard> => {
  try {
    const response = await api.get<IdentityCard>(`/identity-cards/${id}`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch identity card');
  }
};

export const getIdentityCardInformation = async (id: string): Promise<IdentityCard> => {
  try {
    const response = await api.get<IdentityCard>(`/identity-cards/${id}/information`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch identity card information');
  }
};

export const updateIdentityCardStatus = async (id: string, status: IdentityCardStatusEnum): Promise<void> => {
  try {
    await api.patch(`/identity-cards/${id}/status`, { status });
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to update identity card status');
  }
};

export const getIdentityCardScanLogs = async (id: string): Promise<any[]> => {
  try {
    const response = await api.get<any[]>(`/identity-cards/${id}/scan-logs`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch identity card scan logs');
  }
};

export const getIdentityCardDocuments = async (id: string): Promise<DocumentType[]> => {
  try {
    const response = await api.get<DocumentType[]>(`/identity-cards/${id}/documents`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch identity card documents');
  }
};

export const getIdentityCardPublic = async (id: string): Promise<IdentityCard> => {
  try {
    const response = await api.get<IdentityCard>(`/identity-cards/${id}/public`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch public identity card');
  }
};

export const login = async (phone_number: string): Promise<any> => {
  try {
    const response = await api.post<User>('/api/v2/users/request_otp/', { phone_number });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to login');
  }
};

export interface PrintSession {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  province: {
    id: string;
    name: string;
  };
  identityCards: Array<{
    id: string;
    cardNumber: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      gender: string;
      dateOfBirth: string;
      category: CategoryEnum;
      province: {
        id: string;
        name: string;
      };
      nationality: string;
      provinceOfOrigin: string;
      photo: string;
      address: {
        line1: string;
        city: string;
      };
    };
    qrCode: string;
    codeLink: string;
    status: string;
    issueDate: string;
    expiryDate: string;
    updatedAt: string;
    createdAt: string;
  }>;
}

export enum PrintSessionStatusEnum {
  Pending = 'PENDING',
  Printed = 'PRINTED',
  Cancelled = 'CANCELLED',
}

export const getPrintSession = async (id: string): Promise<PrintSession> => {
  try {
    const response = await api.get<PrintSession>(`/print-sessions/${id}`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch print session');
  }
};

export const markPrintSessionAsPrinted = async (id: string): Promise<void> => {
  try {
    await api.post(`/print-sessions/${id}/mark-as-printed`);
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to mark print session as printed');
  }
};

export const markPrintSessionAsCancelled = async (id: string): Promise<void> => {
  try {
    await api.post(`/print-sessions/${id}/mark-as-cancelled`);
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to mark print session as cancelled');
  }
};

interface RegisterData {
  phone_number: string;
  full_name: string;
  // email?: string;
}

export const register = async (data: RegisterData): Promise<any> => {
  try {
    const response = await api.post('/api/v2/users/register/', data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Registration failed');
  }
};

interface VerifyOTPData {
  phone_number: string;
  otp: string;
}

export const verifyOTP = async (data: VerifyOTPData): Promise< VerifyOTPResponse> => {
  const response = await api.post('/api/v2/users/verify_otp/', data);
  return response.data;
  };

export default api; 

export const vendorOnboarding = async (formData: FormData): Promise<any> => {
  try {
    const response = await api.post('/api/v2/core/vendor-onboarding/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to onboard vendor');
  }
};

export interface Vendor {
  id: string;
  name: string;
  gst: string;
  pan: string;
  spoc_name: string;
  created_at: string;
}

export interface APIVendorResponse {
  success: boolean;
  data: Vendor[];
}

export const getVendorOnboarding = async (): Promise<APIVendorResponse> => {
  try {
    const response = await api.get('/api/v2/core/vendor-onboarding/');
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch vendors');
  }
};
export const getVendors = async (): Promise<APIVendorResponse> => {
  try {
    const response = await api.get('/api/v2/core/vendors/');
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch vendors');
  }
};

export const getVendor = async (id: string): Promise<{ success: boolean; data: Vendor }> => {
  try {
    const response = await api.get(`/api/v2/core/vendors/${id}/`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch vendor details');
  }
};

export const approveVendor = async (id: string): Promise<any> => {
  try {
    const response = await api.post(`/api/v2/core/vendors/${id}/approve/`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to approve vendor');
  }
};

export const rejectVendor = async (id: string): Promise<any> => {
  try {
    const response = await api.post(`/api/v2/core/vendors/${id}/reject/`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to reject vendor');
  }
};

export const getVendorOnboardingList = async (): Promise<any> => {
  try {
    const response = await api.get('/api/v2/core/vendor-onboarding/');
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch vendor onboarding list');
  }
};  

export const getLocationList = async (): Promise<{ success: boolean; data: Location[] }> => {
  try {
    const response = await api.get('api/v2/core/locations/');
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch location list');
  }
};

export const addLocation = async (location: Location): Promise<any> => {
  try {
    const response = await api.post('api/v2/core/locations/', location);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to add location');
  }
};
interface Location {
  name_of_city: string;
  district: string;
  state: string;
  pincode: string;
  soft_delete: boolean;
  created_at: string;
}

export const deleteLocation = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`api/v2/core/locations/${id}/`);   
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to delete location');  
  }
};

interface Client {
  name: string;
  gst: string;
  pan: string;
  spoc_name: string;
  contact_number: string;
  contact_email: string;
}

export const addClient = async (client: Client): Promise<any> => {
  try {
    const response = await api.post('api/v2/core/clients/', client);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to add client');
  }
};

export const getClients = async (): Promise<any> => {
  try {
    const response = await api.get('/api/v2/core/clients/');
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch clients');
  }
};

export const getClientDetails = async (id: string): Promise<{ success: boolean; data: Client }> => {
  try {
    const response = await api.get(`/api/v2/core/clients/${id}/`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch client details');
  }
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<any> => {
  try {
    const response = await api.put(`/api/v2/core/clients/${id}/`, client);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to update client');
  }
};

//vehicle onboarding
interface Vehicle {
  client: string;
  vehicle_number: string;
  vehicle_type: string;
  vehicle_model: string;
  vehicle_color: string;
  vehicle_image: File;
  vehicle_registration_certificate: File;
  vehicle_insurance_certificate: File;
  vehicle_fitment_certificate: File;
}

export const vehicleOnboarding = async (formData: FormData): Promise<any> => {
  try {
    const response = await api.post('/api/v2/core/vehicle-onboarding/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, 'Failed to onboard vehicle');
    }
  };

  export const getOnboardedVehicles = async (): Promise<any> => {
    try {
      const response = await api.get('/api/v2/core/vehicle-onboarding/');
      return response.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, 'Failed to fetch onboarded vehicles');
    }
  };

  export const getVehicleOnboardingDetails = async (id: string): Promise<any> => {
    try {
      const response = await api.get(`/api/v2/core/vehicle-onboarding/${id}/`);
      return response.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, 'Failed to fetch vehicle details');
    }
  };

  export const updateVehicleOnboarding = async (id: string, data: FormData): Promise<any> => {
    try {
      const response = await api.put(`/api/v2/core/vehicle-onboarding/${id}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, 'Failed to update vehicle onboarding');
    }
  };

  export const getVehicles = async (): Promise<any> => {
    try {
      const response = await api.get('/api/v2/core/vehicles/');
      return response.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, 'Failed to fetch vehicles');
    }
  };

  export const getVehicleById = async (id: string): Promise<any> => {
    try {
      const response = await api.get(`/api/v2/core/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, 'Failed to fetch vehicle details');
    }
  };

export interface OrderData {
  order_id: string;
  order_date: string;
  order_pricing: number;
  from_location_id: string;
  to_location_id: string;
  client_id: string;
}

export interface Order {
  id: string;
  order_id: string;
  order_date: string;
  order_pricing: number;
  from_location: string;
  from_location_name: string;
  to_location: string;
  to_location_name: string;
  client: string;
  client_name: string;
  created_at: string;
  updated_at: string;
}

export const createOrder = async (orderData: OrderData) => {
  const response = await api.post('/api/v2/core/orders/', orderData);
  return response.data;
};

export const getOrders = async (): Promise<{ success: boolean; data: Order[] }> => {
  const response = await api.get('/api/v2/core/orders/');
  return response.data;
};
export const getOrderById = async (id: string): Promise<{ success: boolean; data: Order }> => {
  const response = await api.get(`/api/v2/core/orders/${id}`);
  return response.data;
};

export const updateOrder = async (orderId: string, data: OrderData) => {
  const response = await api.put(`/api/v2/core/orders/${orderId}/`, data, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};

//trip
export enum PaymentStatusEnum {
    PENDING = 0,
    PAID = 1,
    PARTIALLY_PAID = 2,
    OVERDUE = 3
}

interface Trip {
    vendor_id: string;
    order: string;
    reference_id: string;
    payment_status: PaymentStatusEnum;
}

export const createTrip = async (tripData: Trip) => {
  const response = await api.post('/api/v2/core/trips/', tripData);
  return response.data;
};

export interface TripDetails {
    id: string;
    vendor_name: string;
    from_location_name: string;
    to_location_name: string;
    reference_id: string;
    client_name: string;
    payment_status: number;
    latest_status: string;
    created_at: string;
}

export interface APITripResponse {
    success: boolean;
    data: TripDetails[];
}

export const getTrips = async (): Promise<APITripResponse> => {
    try {
        const response = await api.get('/api/v2/core/trips/');
        return response.data;
    } catch (error) {
        throw ApiError.fromAxiosError(error, 'Failed to fetch trips');
    }
};

export const logoutUser = async (): Promise<void> => {
  await api.post('/api/v2/users/logout/');
};

export const getVendorOnboardingById = async (id: string) => {
  try {
    const response = await api.get(`/api/v2/core/vendor-onboarding/${id}`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch vendor details');
  }
};

export const updateVendorOnboarding = async (id: string, data: any) => {
  try {
    const response = await api.put(`/api/v2/core/vendor-onboarding/${id}/`, data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to update vendor onboarding');
  }
};



