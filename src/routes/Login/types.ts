// src/routes/Login/types.ts
export interface FormState {
  phoneNumber: string;
  otp: string;
  loading: boolean;
  error: Error | null;
  showOTP: boolean;
  authOptions?: {
    otp_enabled: boolean;
    password_enabled: boolean;
    show_password_option: boolean;
  };
  uiMarkers?: {
    allow_otp_login: boolean;
    allow_password_login: boolean;
    display_auth_choice: boolean;
  };
  selectedAuthMethod: 'otp' | 'password';
}

export interface LoginResponse {
  user_exists: boolean;
  message?: string;
  register_required: boolean;
  auth_options?: {
    otp_enabled: boolean;
    password_enabled: boolean;
    show_password_option: boolean;
  };
  ui_markers?: {
    allow_otp_login: boolean;
    allow_password_login: boolean;
    display_auth_choice: boolean;
  };
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
  otp?: string;
  password?: string;
}