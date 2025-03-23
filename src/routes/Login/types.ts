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
  
// src/routes/Login/types.ts
export interface VerifyOTPResponse {
  success: boolean;
  data: {
    message: string;
    user: {
      phone_number: string;
      full_name: string;
      email: string;
      role: string;
      token: string;
    };
  };
}
  
  export interface FormData {
    phone_number: string;
    full_name?: string;
    email?: string;
    otp?: string;
  }