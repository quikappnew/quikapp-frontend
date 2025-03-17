import axios, { AxiosInstance } from 'axios';
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

const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
  headers: {
    'Content-Type': 'application/json',
  },
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
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error)) {
      throw ApiError.fromAxiosError(error, 'An error occurred');
    }
    throw error;
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

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await api.post<User>('/auth/login', { email, password });
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
  email?: string;
}

export const register = async (data: RegisterData): Promise<User> => {
  try {
    const response = await api.post('/users/auth/register/', data);
    return response.data;
  } catch (error) {
    throw ApiError.fromAxiosError(error, 'Registration failed');
  }
};

export default api; 