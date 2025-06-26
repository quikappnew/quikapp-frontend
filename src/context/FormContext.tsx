// src/context/FormContext.tsx
import React, { createContext, useReducer, ReactNode } from 'react';

interface FormState {
  phoneNumber: string;
  otp: string;
  error: Error | null;
  loading: boolean;
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

const initialState: FormState = {
  phoneNumber: '',
  otp: '',
  error: null,
  loading: false,
  showOTP: false,
  selectedAuthMethod: 'otp',
};

// Define action types
type ActionType =
  | { type: 'SET_PHONE_NUMBER'; payload: string }
  | { type: 'SET_OTP'; payload: string }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SHOW_OTP' }
  | { type: 'HIDE_OTP' }
  | { type: 'SET_AUTH_OPTIONS'; payload: { authOptions: any; uiMarkers: any } }
  | { type: 'SET_AUTH_METHOD'; payload: 'otp' | 'password' };

// Create a reducer function
const reducer = (state: FormState, action: ActionType) => {
  switch (action.type) {
    case 'SET_PHONE_NUMBER':
      return { ...state, phoneNumber: action.payload };
    case 'SET_OTP':
      return { ...state, otp: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SHOW_OTP':
      return { ...state, showOTP: true };
    case 'HIDE_OTP':
      return { ...state, showOTP: false };
    case 'SET_AUTH_OPTIONS':
      return { 
        ...state, 
        authOptions: action.payload.authOptions,
        uiMarkers: action.payload.uiMarkers 
      };
    case 'SET_AUTH_METHOD':
      return { ...state, selectedAuthMethod: action.payload };
    default:
      return state;
  }
};

export const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<ActionType>;
}>({ state: initialState, dispatch: () => null });

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};