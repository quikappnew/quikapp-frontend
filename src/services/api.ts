import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
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
  DocumentTypeEnum,
  Trip,
  CreateTripData,
  UpdateTripData,
  Payment,
  CreatePaymentData,
  UpdatePaymentData,
  VendorBankAccount,
  CreateBankAccountData,
  UpdateBankAccountData,
  PaymentAnalytics,
  VendorPaymentSummary,
  TripFinancialSummary,
  OutstandingBalance,
  TrendData,
  TripsResponse,
  PaymentsResponse,
  VendorBankAccountsResponse,
  PaymentAnalyticsResponse,
  VendorPaymentSummaryResponse,
  TripFinancialSummaryResponse,
  OutstandingBalancesResponse,
  TrendsResponse
} from 'types/api';
import { TripStatusEnum, PaymentTypeEnum, PaymentModeEnum } from 'types/api';
import { VerifyOTPResponse } from 'routes/Login/types';
import { TokenService } from './tokenService';

const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND || 'http://localhost:8000/api/v2',
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
        error.response?.data?.message || error.response?.data?.error || defaultMessage,
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      TokenService.removeToken();
      // Clear any stored user data
      localStorage.removeItem('user');
      // Show session expired message before redirecting
      toast.error('Your session has expired. Please login again.');
      // Small delay to ensure toast is visible before redirect
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }

    // Centralized handling for 400 Bad Request
    if (error.response?.status === 400) {
      try {
        const data: any = error.response?.data || {};
        // Prefer explicit backend message fields
        const backendMessage =
          data?.message ||
          data?.details ||
          data?.error ||
          (Array.isArray(data?.errors) ? data.errors.join(', ') : undefined) ||
          'Request failed. Please check your input and try again.';
        toast.error(backendMessage);
      } catch (_) {
        toast.error('Request failed. Please check your input and try again.');
      }
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

export const getUsers = async (params: GetUsersParams = {}): Promise<any> => {
  try {
    // Try both token methods to see which one works
    const token1 = getToken();
    const token2 = TokenService.getToken();



    const token = token2 || token1; // Prefer TokenService token

    if (!token) {
      throw new ApiError('No authentication token found. Please log in again.', 'UNAUTHORIZED', 401);
    }



    const response = await api.post('/api/v2/users/list_users/', {
      auth_token: token,
      ...params
    });


    return response.data;
  } catch (error: any) {

    throw ApiError.fromAxiosError(error, 'Failed to fetch users');
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const token = TokenService.getToken() || getToken();

    if (!token) {
      throw new ApiError('No authentication token found. Please log in again.', 'UNAUTHORIZED', 401);
    }

    await api.post('/api/v2/users/delete_user/', {
      auth_token: token,
      user_id: id
    });
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
  otp?: string;
  password?: string;
  use_password: boolean;
}

export const verifyOTP = async (data: VerifyOTPData): Promise<VerifyOTPResponse> => {
  const response = await api.post('/api/v2/users/verify_otp/', data);
  return response.data;
};

interface ValidateTokenData {
  token: string;
}

interface ValidateTokenResponse {
  valid: boolean;
  user: {
    id: string;
    phone_number: string;
    full_name: string;
    email: string;
    role: number;
  };
}

export const validateToken = async (token: string): Promise<ValidateTokenResponse> => {
  const response = await api.post('/api/v2/users/validate_token/', { token });
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
  spoc_email?: string;
  spoc_phone?: string;
  alternate_contact_number?: string;
}

export interface APIVendorResponse {
  success: boolean;
  data: Vendor[];
  count?: number; // total items
  page?: number; // current page (1-based)
  page_size?: number; // items per page
  next_page?: number | null;
  previous_page?: number | null;
}

export const getVendorOnboarding = async (): Promise<APIVendorResponse> => {
  try {
    const response = await api.get('/api/v2/core/vendor-onboarding/');
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch vendors');
  }
};
export const getVendors = async (
  params?: { search?: string; page?: number; page_size?: number }
): Promise<APIVendorResponse> => {
  try {
    const response = await api.get('/api/v2/core/vendors/', { params });
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

export const createVehicle = async (vehicleData: any): Promise<any> => {
  try {
    const response = await api.post('/api/v2/core/vehicles/', vehicleData);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to create vehicle');
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
  from_location?: string;
  from_location_name: string;
  to_location?: string;
  to_location_name: string;
  client?: string;
  client_name: string;
  created_at: string;
  updated_at?: string;
  order_status?: {
    has_trips: boolean;
    trip_count: number;
    status: string;
  };
  order_created_by?: {
    id?: string;
    username?: string;
    full_name?: string;
    phone_number?: string;
  };
}

export const createOrder = async (orderData: OrderData) => {
  const response = await api.post('/api/v2/core/orders/', orderData);
  return response.data;
};

export interface APIOrderResponse {
  success: boolean;
  data: Order[];
  count?: number;
  page?: number;
  page_size?: number;
  next_page?: number | null;
  previous_page?: number | null;
}

export const getOrders = async (
  params?: {
    search?: string;
    page?: number;
    page_size?: number;
    start_date?: string;
    end_date?: string;
  }
): Promise<APIOrderResponse> => {
  const response = await api.get('/api/v2/core/orders/', { params });
  return response.data;
};

export const getOrdersWithVendorInterests = async (
  params?: {
    search?: string;
    page?: number;
    page_size?: number;
    start_date?: string;
    end_date?: string;
  }
): Promise<any> => {
  const response = await api.get('/api/v2/core/orders/with_vendor_interests/', { params });
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

interface LegacyTrip {
  vendor_id: string;
  order_id: string;
  reference_id: string;
  payment_status: PaymentStatusEnum;
}

export const createLegacyTrip = async (tripData: LegacyTrip) => {
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

// Simple user creation for Super Users
interface CreateSimpleUserData {
  phone_number: string;
  full_name: string;
  email?: string;
  role: number;
  password: string;
  is_active?: boolean;
}

export const createSimpleUser = async (data: CreateSimpleUserData): Promise<any> => {
  try {
    const response = await api.post('/api/v2/users/create_user/', {
      ...data,
      is_active: data.is_active ?? true
    });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to create user');
  }
};

// Get current user information from localStorage
export const getCurrentUser = (): { role: number; id: string; full_name: string; email: string; phone_number: string } | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      // Convert role to number if it's a string
      if (user && typeof user.role === 'string') {
        user.role = parseInt(user.role, 10);
      }
      return user;
    } catch (error) {
      return null;
    }
  }
  return null;
};

// Get just the user role
export const getUserRole = (): number | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

// Validate current token and get fresh user information
export const getCurrentUserByToken = async (): Promise<ValidateTokenResponse | null> => {
  const token = TokenService.getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await validateToken(token);
    return response;
  } catch (error) {
    // Token validation failed - likely expired or forbidden
    return null;
  }
};

// Get full user profile (fetches complete user details from API)
export const getCurrentUserProfile = async (): Promise<User | null> => {
  const currentUser = getCurrentUser();
  if (!currentUser?.id) {
    return null;
  }

  try {
    const fullUserProfile = await getUser(currentUser.id);
    return fullUserProfile;
  } catch (error) {
    return null;
  }
};

// Comprehensive user profile with all available data
export const getComprehensiveUserProfile = async (): Promise<{
  basicInfo: ValidateTokenResponse['user'] | null;
  fullProfile: User | null;
  isValid: boolean;
}> => {
  try {
    // Get basic info from token validation
    const tokenValidation = await getCurrentUserByToken();

    if (!tokenValidation?.valid) {
      return {
        basicInfo: null,
        fullProfile: null,
        isValid: false
      };
    }

    // Get full profile details
    let fullProfile: User | null = null;
    try {
      fullProfile = await getUser(tokenValidation.user.id);
    } catch (error) {
      // Continue with basic info even if full profile fails
    }

    return {
      basicInfo: tokenValidation.user,
      fullProfile,
      isValid: true
    };
  } catch (error) {
    return {
      basicInfo: null,
      fullProfile: null,
      isValid: false
    };
  }
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

// Add Lock interfaces based on API response
export interface Lock {
  id: string;
  phone_number: string;
}

export interface GetLocksResponse {
  success: boolean;
  data: Lock[];
}

// Add getLocks API function
export const getLocks = async (): Promise<GetLocksResponse> => {
  try {
    const response = await api.get<GetLocksResponse>("/api/v2/locks/");
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, "Failed to fetch locks");
  }
};

export interface LockDetails {
  id: string;
  phone_number: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetLockByIdResponse {
  success: boolean;
  data: LockDetails;
}

export const getLockById = async (phone_number: string): Promise<GetLockByIdResponse> => {
  try {
    const response = await api.get<GetLockByIdResponse>(`/api/v2/locks/${phone_number}/`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch lock by ID');
  }
};

export interface LockOtpDetails {
  lock_id: string;
  lock_phone_number: string;
  otp: string;
  is_used: boolean;
  createdAt: string;
  updatedAt: string;
  status_display: string;
}

export interface GetLockOtpResponse {
  success: boolean;
  data: LockOtpDetails;
}

export const getLockOtpByPhoneNumber = async (phone_number: string): Promise<GetLockOtpResponse> => {
  try {
    const response = await api.get<GetLockOtpResponse>(`/api/v2/locks/otp/${phone_number}/get/`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch lock OTP');
  }
};

export interface LockStatusDetails {
  lock_id: string;
  lock_phone_number: string;
  status: string;
  status_display: string;
  latitude: string;
  longitude: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}
export interface GetLockStatusResponse {
  success: boolean;
  data: LockStatusDetails;
}

export const getLockStatusByPhoneNumber = async (phone_number: string): Promise<GetLockStatusResponse> => {
  try {
    const response = await api.get<GetLockStatusResponse>(`/api/v2/locks/status/${phone_number}/get/`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch lock status');
  }
};

// Update lock with vehicle registration number
export interface UpdateLockVehicleData {
  vehicle_registration_number: string;
}

export interface UpdateLockVehicleResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const updateLockVehicle = async (phone_number: string, data: UpdateLockVehicleData): Promise<UpdateLockVehicleResponse> => {
  try {
    const response = await api.put<UpdateLockVehicleResponse>(`/api/v2/locks/lock-vehicles/${phone_number}/update/`, data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to update lock vehicle');
  }
};

// Trip Management API Functions
export const getTripsWithFilters = async (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  vendor?: string;
  client?: string;
  payment_status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ data: Trip[], pagination: any }> => {
  try {
    // Transform parameters to match API expectations
    const apiParams: any = {};
    if (params?.page) apiParams.page = params.page;
    if (params?.page_size) apiParams.page_size = params.page_size;
    if (params?.search) apiParams.search = params.search;
    if (params?.status) apiParams.status = params.status;
    if (params?.vendor) apiParams.vendor = params.vendor;
    if (params?.client) apiParams.client = params.client;
    if (params?.payment_status) apiParams.payment_status = params.payment_status;
    if (params?.startDate) apiParams.start_date = params.startDate;
    if (params?.endDate) apiParams.end_date = params.endDate;

    const response = await api.get('/api/v2/core/trips', { params: apiParams });

    // Transform the data to match the Trip interface
    const transformedData = response.data.data ?
      response.data.data.map(transformTripData) :
      response.data.map(transformTripData);

    return {
      data: transformedData,
      pagination: response.data.pagination || response.data
    };
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch trips');
  }
};

// Data transformation function to map API response to Trip interface
const transformTripData = (apiData: any): Trip => {
  return {
    id: apiData.id,
    referenceId: apiData.reference_id,
    status: apiData.latest_status as TripStatusEnum || TripStatusEnum.SCHEDULED,
    scheduledDate: apiData.scheduled_date || new Date().toISOString(),
    startDate: apiData.start_date,
    endDate: apiData.end_date,
    fromLocation: apiData.from_location,
    toLocation: apiData.to_location,
    distance: apiData.distance || 0,
    duration: apiData.duration || 0,
    specialInstructions: apiData.special_instructions,
    vehicleId: apiData.vehicle_id || '',
    vehicleNumber: apiData.vehicle_number,
    driverId: apiData.driver_id || '',
    driverName: apiData.driver_name || '',
    vendorId: apiData.vendor?.id || apiData.vendor_id || '',
    vendorName: apiData.vendor?.name || apiData.vendor_name || '',
    vendor: apiData.vendor ? {
      id: apiData.vendor.id,
      name: apiData.vendor.name,
      gst: apiData.vendor.gst,
      pan: apiData.vendor.pan,
      spoc_name: apiData.vendor.spoc_name,
      spoc_email: apiData.vendor.spoc_email,
      spoc_phone: apiData.vendor.spoc_phone,
      alternate_contact_number: apiData.vendor.alternate_contact_number,
    } : undefined,
    clientId: apiData.client_id || '',
    clientName: apiData.client_name,
    totalAmount: apiData.pricing || apiData.order_prize || 0,
    paidAmount: apiData.paid_amount || 0,
    outstandingAmount: apiData.outstanding_amount || 0,
    payment_status: apiData.payment_status || 0,
    completionPercentage: apiData.completion_percentage || 0,
    documents: apiData.documents || [],
    internalNotes: apiData.latest_notes || apiData.internal_notes,
    createdAt: apiData.created_at || new Date().toISOString(),
    updatedAt: apiData.updated_at || new Date().toISOString(),
  };
};

export const getTripById = async (id: string): Promise<Trip> => {
  try {
    const response = await api.get(`/api/v2/core/trips/${id}`);
    return transformTripData(response.data);
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch trip details');
  }
};

export const createTrip = async (data: CreateTripData): Promise<Trip> => {
  try {
    const response = await api.post('/api/v2/core/trips', data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to create trip');
  }
};

export const updateTrip = async (id: string, data: UpdateTripData): Promise<Trip> => {
  try {
    const response = await api.put(`/api/v2/core/trips/${id}`, data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to update trip');
  }
};

export const deleteTrip = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v2/core/trips/${id}`);
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to delete trip');
  }
};

export const updateTripStatus = async (id: string, status: TripStatusEnum): Promise<Trip> => {
  try {
    const response = await api.patch(`/api/v2/core/trips/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to update trip status');
  }
};

// Payment Management API Functions
export const getPayments = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  mode?: string;
  vendorId?: string;
  tripId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<PaymentsResponse> => {
  try {
    const response = await api.get('/api/v2/core/payment', { params });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch payments');
  }
};

export const getPaymentById = async (id: string): Promise<Payment> => {
  try {
    const response = await api.get(`/api/v2/core/payment/${id}`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch payment details');
  }
};

export const createPayment = async (data: CreatePaymentData): Promise<Payment> => {
  try {
    // Transform the data to match the API structure
    const apiData = {
      trip_id: data.tripId,
      amount: data.amount,
      payment_type: data.type.toLowerCase(),
      payment_mode: data.mode.toLowerCase(),
      utr_number: data.utrNumber,
      payment_date: data.transactionDate,
      notes: data.notes || data.description || ''
    };

    const response = await api.post('/api/v2/core/vendor-payment-logs/', apiData);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to create payment');
  }
};

export const updatePayment = async (id: string, data: UpdatePaymentData): Promise<Payment> => {
  try {
    const response = await api.put(`/api/v2/core/payment/${id}`, data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to update payment');
  }
};

export const deletePayment = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v2/core/payment/${id}`);
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to delete payment');
  }
};

// Data transformation function to map API response to Payment interface
const transformPaymentData = (apiData: any): Payment => {


  const transformed = {
    id: apiData.id,
    tripId: apiData.trip_id || '',
    tripReferenceId: apiData.trip_reference_id || '',
    vendorId: apiData.vendor_id || '',
    vendorName: apiData.vendor_name || '',
    type: apiData.payment_type?.toUpperCase() as PaymentTypeEnum || 'ADVANCE' as PaymentTypeEnum,
    mode: apiData.payment_mode?.toUpperCase() as PaymentModeEnum || 'BANK_TRANSFER' as PaymentModeEnum,
    amount: parseFloat(apiData.amount) || 0,
    utrNumber: apiData.utr_number || '',
    transactionDate: apiData.payment_date || apiData.transaction_date || new Date().toISOString(),
    description: apiData.description || '',
    status: 'CONFIRMED' as 'PENDING' | 'CONFIRMED' | 'FAILED', // Default status since it's not in the API response
    receiptUrl: apiData.receipt_url || '',
    notes: apiData.notes || '',
    createdAt: apiData.created_at || new Date().toISOString(),
    updatedAt: apiData.updated_at || new Date().toISOString(),
  };


  return transformed;
};

export const getPaymentsByTrip = async (tripId: string): Promise<Payment[]> => {
  try {
    const response = await api.get(`/api/v2/core/vendor-payment-logs/`, {
      params: { trip_id: tripId }
    });

    // Handle the actual API response structure
    if (response.data && response.data.success && response.data.data && response.data.data.payment_logs) {
      return response.data.data.payment_logs.map(transformPaymentData);
    } else if (response.data && Array.isArray(response.data)) {
      return response.data.map(transformPaymentData);
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data.map(transformPaymentData);
    } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
      return response.data.results.map(transformPaymentData);
    }

    // If no payments found, return empty array
    return [];
  } catch (error) {
    // If API returns 404 or no payments found, return empty array instead of throwing error
    if (error && typeof error === 'object' && 'response' in error && (error as any).response?.status === 404) {
      return [];
    }
    throw ApiError.fromAxiosError(error, 'Failed to fetch trip payments');
  }
};

export const getPaymentsByVendor = async (vendorId: string): Promise<Payment[]> => {
  try {
    const response = await api.get(`/api/v2/core/payment/vendor/${vendorId}`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch vendor payments');
  }
};

// Vendor Bank Details API Functions
export const getVendorBankAccounts = async (vendorId: string): Promise<VendorBankAccountsResponse> => {
  try {
    const response = await api.get(`/api/v2/core/vendor-bank-details`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch vendor bank accounts');
  }
};

export const createVendorBankAccount = async (vendorId: string, data: CreateBankAccountData): Promise<VendorBankAccount> => {
  try {
    const response = await api.post(`/api/v2/core/vendor-bank-details`, data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to create bank account');
  }
};

export const updateVendorBankAccount = async (vendorId: string, bankId: string, data: UpdateBankAccountData): Promise<VendorBankAccount> => {
  try {
    const response = await api.put(`/api/v2/core/vendor-bank-details/${bankId}`, data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to update bank account');
  }
};

export const deleteVendorBankAccount = async (vendorId: string, bankId: string): Promise<void> => {
  try {
    await api.delete(`/api/v2/core/vendor-bank-details/${bankId}`);
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to delete bank account');
  }
};

export const setPrimaryBankAccount = async (vendorId: string, bankId: string): Promise<VendorBankAccount> => {
  try {
    const response = await api.patch(`/api/v2/core/vendor-bank-details/${bankId}/primary`);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to set primary bank account');
  }
};

// Analytics & Reporting API Functions
export const getOrdersAnalytics = async (params?: {
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<any> => {
  try {
    const response = await api.get('/api/v2/core/analytics/orders/', { params });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch orders analytics');
  }
};

export const getTripsAnalytics = async (params?: {
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}): Promise<any> => {
  try {
    const response = await api.get('/api/v2/core/analytics/trips/', { params });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch trips analytics');
  }
};

export const getVendorsAnalytics = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<any> => {
  try {
    const response = await api.get('/api/v2/core/analytics/vendors/', { params });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch vendors analytics');
  }
};

export const getOutstandingBalances = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<OutstandingBalancesResponse> => {
  try {
    const response = await api.get('/api/v2/core/analytics/outstanding/', { params });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch outstanding balances');
  }
};

export const getTripFinancials = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  vendorId?: string;
}): Promise<TripFinancialSummaryResponse> => {
  try {
    const response = await api.get('/api/v2/core/analytics/trip_financials/', { params });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch trip financials');
  }
};

export const getVendorPaymentSummary = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<VendorPaymentSummaryResponse> => {
  try {
    const response = await api.get('/api/v2/core/analytics/vendor_payment_summary/', { params });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch vendor payment summary');
  }
};

export const getTrends = async (params?: {
  period?: 'daily' | 'weekly' | 'monthly';
  startDate?: string;
  endDate?: string;
}): Promise<TrendsResponse> => {
  try {
    const response = await api.get('/api/v2/core/analytics/trends', { params });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to fetch trends');
  }
};

export const exportReport = async (format: 'pdf' | 'excel' | 'csv', params?: {
  type?: 'payments' | 'trips' | 'vendors' | 'outstanding';
  startDate?: string;
  endDate?: string;
  vendorId?: string;
}): Promise<Blob> => {
  try {
    const response = await api.get(`/api/v2/core/analytics/export`, {
      params: { format, ...params },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to export report');
  }
};

// Search API Functions
export const searchTrips = async (params: {
  q: string;
  status?: string;
  dateRange?: string;
  page?: number;
  pageSize?: number;
}): Promise<TripsResponse> => {
  try {
    const response = await api.get('/api/v2/core/trips', { params });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to search trips');
  }
};

export const searchPayments = async (params: {
  q: string;
  status?: string;
  dateRange?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaymentsResponse> => {
  try {
    const response = await api.get('/api/v2/core/payment', { params });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to search payments');
  }
};

export const searchVendors = async (params: {
  q: string;
  page?: number;
  pageSize?: number;
}): Promise<any> => {
  try {
    const response = await api.get('/api/v2/core/vendors', { params });
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to search vendors');
  }
};

// ============================================================================
// USER MANAGEMENT API FUNCTIONS (Super User Only)
// ============================================================================

// User Management Interfaces
export interface UserManagementUser {
  id: string;
  phone_number: string;
  full_name: string;
  email: string;
  role: number;
  role_display: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  phone_number: string;
  full_name: string;
  email: string;
  role: number;
  password: string;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  phone_number?: string;
  full_name?: string;
  email?: string;
  role?: number;
  is_active?: boolean;
}

export interface GetUserRequest {
  user_id: string;
}

export interface ListUsersRequest {
  page?: number;
  page_size?: number;
  search?: string;
  role?: number;
  is_active?: boolean;
  date_joined_after?: string;
  date_joined_before?: string;
}

export interface DeleteUserRequest {
  user_id: string;
}

export interface UpdateUserRoleRequest {
  user_id: string;
  role: number;
}

export interface ChangePasswordRequest {
  user_id: string;
  new_password: string;
}

export interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
}

export interface UserManagementResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}

export interface PaginatedUserResponse {
  success: boolean;
  message?: string;
  data: {
    users: UserManagementUser[];
    total_users: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// 1. Create new user
export const createUserManagement = async (data: CreateUserRequest): Promise<UserManagementResponse<UserManagementUser>> => {
  try {
    const response = await api.post('/api/users/create_user/', data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to create user');
  }
};

// 2. Get user by ID
export const getUserManagement = async (data: GetUserRequest): Promise<UserManagementResponse<UserManagementUser>> => {
  try {
    const response = await api.post('/api/users/get_user/', data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to get user');
  }
};

// 3. Update user information
export const updateUserManagement = async (data: UpdateUserRequest & { user_id: string }): Promise<UserManagementResponse<UserManagementUser>> => {
  try {
    const response = await api.post('/api/users/update_user/', data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to update user');
  }
};

// 4. List users with pagination/filters
export const listUsersManagement = async (data: ListUsersRequest = {}): Promise<PaginatedUserResponse> => {
  try {
    const response = await api.post('/api/users/list_users/', data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to list users');
  }
};

// 5. Delete user
export const deleteUserManagement = async (data: DeleteUserRequest): Promise<UserManagementResponse<{ deleted: boolean }>> => {
  try {
    const response = await api.post('/api/users/delete_user/', data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to delete user');
  }
};

// 6. Get all available roles
export const getRolesManagement = async (): Promise<UserManagementResponse<Role[]>> => {
  try {
    const response = await api.post('/api/users/get_roles/');
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to get roles');
  }
};

// 7. Update user role
export const updateUserRoleManagement = async (data: UpdateUserRoleRequest): Promise<UserManagementResponse<UserManagementUser>> => {
  try {
    const response = await api.post('/api/users/update_user_role/', data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to update user role');
  }
};

// 8. Change password
export const changePasswordManagement = async (data: ChangePasswordRequest): Promise<UserManagementResponse<{ changed: boolean }>> => {
  try {
    const response = await api.post('/api/users/change_password/', data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Failed to change password');
  }
};

// Helper function to check if current user is super user
export const isSuperUser = (): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;

  // Role should now always be a number from getCurrentUser
  return currentUser.role === 1; // Super User role
};

// Helper function to require super user access
export const requireSuperUser = (): void => {
  if (!isSuperUser()) {
    throw new ApiError('Access denied. Super user privileges required.', 'FORBIDDEN', 403);
  }
};


