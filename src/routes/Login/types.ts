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
      user_exists: boolean;
      message?: string;
      register_required: boolean;
    
  }
  
  export interface RegisterResponse {
      register_required: boolean;
      message: string;
  }
  
// src/routes/Login/types.ts
export interface VerifyOTPResponse {
  message: string;
  user: {
    id: string;
    phone_number: string;
    full_name: string;
    email: string;
    role: string;
      token: string;
    };
  };

  
  export interface FormData {
    phone_number: string;
    full_name?: string;
    email?: string;
    otp?: string;
  }