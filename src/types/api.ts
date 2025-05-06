export interface ApiError {
  name: string;
  message: string;
  status: string;
  code: number;
}

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}

export enum CategoryEnum {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  STAFF = 'STAFF',
  DRIVER = 'DRIVER',
}

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum IdentityCardStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_PRINTING = 'PENDING_PRINTING',
}

export enum DocumentStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum DocumentTypeEnum {
  PASSPORT = 'PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
  OTHER = 'OTHER',
}

export interface Province {
  id: string;
  name: string;
}

export interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Document {
  id: string;
  type: DocumentTypeEnum;
  name: string;
  description?: string;
  url: string;
  status: DocumentStatusEnum;
  createdAt: string;
  updatedAt: string;
}

export interface IdentityCard {
  id: string;
  cardNumber: string;
  status: IdentityCardStatusEnum;
  issueDate: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  status: UserStatusEnum;
  category: CategoryEnum;
  nationality: string;
  provinceOfOrigin?: string;
  gender: GenderEnum;
  dateOfBirth: string;
  photo?: string;
  province: Province;
  address: Address;
  documents: Document[];
  identityCards: IdentityCard[];
  createdAt: string;
  updatedAt: string;
  role: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  cursor: string;
  total: number;
  hasNextPage: boolean;
}

export interface IdentityCardAudit {
  id: string;
  scannedAt: string;
  location: string;
}