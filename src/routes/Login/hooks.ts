// src/routes/Login/hooks.ts
import { useContext } from 'react';
import { FormContext } from 'context/FormContext';
import { login, register, verifyOTP } from 'services/api';
import { FormData, LoginResponse, RegisterResponse, VerifyOTPResponse } from './types';

export const useAuth = (redirectTo: string | null, navigate: (path: string) => void) => {
  const { state: formState, dispatch } = useContext(FormContext);

  const setLoading = (loading: boolean) => 
    dispatch({ type: 'SET_LOADING', payload: loading });

  const setError = (error: Error | null) => 
    dispatch({ type: 'SET_ERROR', payload: error });

  const handleLogin = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await login(data.phone_number);
      if (response?.data?.user_exists) {
        dispatch({ type: 'SET_PHONE_NUMBER', payload: data.phone_number });
        dispatch({ type: 'SHOW_OTP' });
      } else {
        dispatch({ type: 'SET_IS_REGISTERING', payload: true });
        setError(new Error('User does not exist. Please register.'));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (data: FormData) => {
    setLoading(true);
    setError(null);
    navigate(redirectTo || '/dashboard');
    try {
      const response: VerifyOTPResponse = await verifyOTP({
        phone_number: formState.phoneNumber,
        otp: data.otp!
      });
      navigate(redirectTo || '/dashboard');
      if (response.success) {
        localStorage.setItem('token', response.token);
        navigate(redirectTo || '/dashboard');
      } else {
        setError(new Error('Invalid OTP. Please try again.'));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response: RegisterResponse = await register({
        phone_number: data.phone_number,
        full_name: data.full_name!,
        email: data.email
      });

      if (response.data?.register_required) {
        dispatch({ type: 'SET_PHONE_NUMBER', payload: data.phone_number });
        dispatch({ type: 'SET_FULL_NAME', payload: data.full_name! });
        dispatch({ type: 'SET_EMAIL', payload: data.email! });
        dispatch({ type: 'SHOW_OTP' });
      } else {
        setError(new Error('Registration failed. Please try again.'));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    formState,
    handleLogin,
    handleOTPVerification,
    handleRegister,
  };
};