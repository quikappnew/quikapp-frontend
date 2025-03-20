// src/context/FormContext.tsx
import React, { createContext, useReducer, ReactNode } from 'react';

interface FormState {
  phoneNumber: string;
  otp: string;
  error: Error | null;
  loading: boolean;
  showOTP: boolean;
  isRegistering: boolean;
  fullName: string;
  email: string;
}

const initialState: FormState = {
  phoneNumber: '',
  otp: '',
  error: null,
  loading: false,
  showOTP: false,
  isRegistering: false,
  fullName: '',
  email: '',
};

// Define action types
type ActionType =
  | { type: 'SET_PHONE_NUMBER'; payload: string }
  | { type: 'SET_FULL_NAME'; payload: string }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_IS_REGISTERING'; payload: boolean }
  | { type: 'SET_OTP'; payload: string }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SHOW_OTP' }
  | { type: 'HIDE_OTP' };

// Create a reducer function
const reducer = (state: FormState, action: ActionType) => {
    console.log("Action", action, state)
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
    case 'SET_FULL_NAME':
      return { ...state, fullName: action.payload };
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_IS_REGISTERING':
      return { ...state, isRegistering: action.payload };
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