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

// Trip Management Types
export enum TripStatusEnum {
  SCHEDULED = 'SCHEDULED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DELAYED = 'DELAYED'
}

export enum PaymentModeEnum {
  BANK_TRANSFER = 'BANK_TRANSFER',
  UPI = 'UPI',
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  NEFT = 'NEFT',
  RTGS = 'RTGS',
  IMPS = 'IMPS'
}

export enum PaymentTypeEnum {
  ADVANCE = 'ADVANCE',
  PARTIAL = 'PARTIAL',
  FINAL = 'FINAL'
}

export interface Trip {
  id: string;
  referenceId: string;
  status: TripStatusEnum;
  scheduledDate: string;
  startDate?: string;
  endDate?: string;
  fromLocation: string;
  toLocation: string;
  distance: number; // in kilometers
  duration: number; // in hours
  specialInstructions?: string;
  vehicleId: string;
  vehicleNumber: string;
  driverId: string;
  driverName: string;
  vendorId: string;
  vendorName: string;
  vendor?: {
    id: string;
    name: string;
    gst: string;
    pan: string;
    spoc_name: string;
    spoc_email?: string;
    spoc_phone?: string;
    alternate_contact_number?: string;
  };
  clientId: string;
  clientName: string;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  payment_status: number;
  completionPercentage: number;
  documents: TripDocument[];
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface CreateTripData {
  referenceId: string;
  scheduledDate: string;
  fromLocation: string;
  toLocation: string;
  distance: number;
  duration: number;
  specialInstructions?: string;
  vehicleId: string;
  driverId: string;
  vendorId: string;
  clientId: string;
  totalAmount: number;
  internalNotes?: string;
}

export interface UpdateTripData extends Partial<CreateTripData> {
  status?: TripStatusEnum;
  startDate?: string;
  endDate?: string;
}

// Payment Management Types
export interface Payment {
  id: string;
  tripId: string;
  tripReferenceId: string;
  vendorId: string;
  vendorName: string;
  type: PaymentTypeEnum;
  mode: PaymentModeEnum;
  amount: number;
  utrNumber?: string;
  transactionDate: string;
  description?: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentData {
  tripId: string;
  type: PaymentTypeEnum;
  mode: PaymentModeEnum;
  amount: number;
  utrNumber?: string;
  transactionDate: string;
  description?: string;
  notes?: string;
}

export interface UpdatePaymentData extends Partial<CreatePaymentData> {
  status?: 'PENDING' | 'CONFIRMED' | 'FAILED';
  receiptUrl?: string;
}

// Vendor Bank Details Types
export interface VendorBankAccount {
  id: string;
  vendorId: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'BUSINESS';
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBankAccountData {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'BUSINESS';
}

export interface UpdateBankAccountData extends Partial<CreateBankAccountData> {
  isPrimary?: boolean;
}

// Analytics & Reporting Types
export interface PaymentAnalytics {
  totalPayable: number;
  totalPaid: number;
  totalOutstanding: number;
  completionPercentage: number;
  paymentBreakdown: {
    byType: Record<PaymentTypeEnum, number>;
    byMode: Record<PaymentModeEnum, number>;
    byVendor: Record<string, number>;
    byMonth: Record<string, number>;
  };
}

export interface VendorPaymentSummary {
  vendorId: string;
  vendorName: string;
  totalTrips: number;
  totalPayable: number;
  totalPaid: number;
  outstandingAmount: number;
  completionPercentage: number;
  lastPaymentDate?: string;
}

export interface TripFinancialSummary {
  tripId: string;
  referenceId: string;
  vendorName: string;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  completionPercentage: number;
  paymentHistory: Payment[];
}

export interface OutstandingBalance {
  vendorId: string;
  vendorName: string;
  totalOutstanding: number;
  tripCount: number;
  oldestOutstandingDate: string;
  recentPaymentDate?: string;
}

export interface TrendData {
  period: string;
  payments: number;
  trips: number;
  revenue: number;
}

// Search & Filter Types
export interface TripFilters {
  status?: TripStatusEnum;
  vendorId?: string;
  clientId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface PaymentFilters {
  type?: PaymentTypeEnum;
  mode?: PaymentModeEnum;
  vendorId?: string;
  tripId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface VendorFilters {
  search?: string;
  hasOutstandingBalance?: boolean;
}

// API Response Types
export interface TripsResponse extends PaginatedResponse<Trip> { }
export interface PaymentsResponse extends PaginatedResponse<Payment> { }
export interface VendorBankAccountsResponse {
  data: VendorBankAccount[];
  total: number;
}
export interface PaymentAnalyticsResponse {
  data: PaymentAnalytics;
}
export interface VendorPaymentSummaryResponse {
  data: VendorPaymentSummary[];
  total: number;
}
export interface TripFinancialSummaryResponse {
  data: TripFinancialSummary[];
  total: number;
}
export interface OutstandingBalancesResponse {
  data: OutstandingBalance[];
  total: number;
}
export interface TrendsResponse {
  data: TrendData[];
}