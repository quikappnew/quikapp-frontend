// src/routes/Login/types.ts
export interface FormState {
    phoneNumber: string;
    fullName: string;
    email?: string;
    otp: string;
    loading: boolean;
    error: Error | null;
    showOTP: boolean;
    isRegistering: boolean;
  }
  
  export interface LoginResponse {
    data: {
      user_exists: boolean;
      message?: string;
    };
  }
  
  export interface RegisterResponse {
    data: {
      register_required: boolean;
      message: string;
    };
  }
  
  export interface VerifyOTPResponse {
    success: boolean;
    token: string;
    message?: string;
  }
  
  export interface FormData {
    phone_number: string;
    full_name?: string;
    email?: string;
    otp?: string;
  }