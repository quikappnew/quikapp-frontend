// src/routes/Login/hooks.ts
import { useContext } from 'react';
import { FormContext } from 'context/FormContext';
import { login, verifyOTP } from 'services/api';
import { FormData, LoginResponse, VerifyOTPResponse } from './types';
import { TokenService } from 'services/tokenService';

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
      if (response?.user_exists) {
        dispatch({ type: 'SET_PHONE_NUMBER', payload: data.phone_number });

        // Set authentication options from API response
        if (response.auth_options && response.ui_markers) {
          dispatch({
            type: 'SET_AUTH_OPTIONS',
            payload: {
              authOptions: response.auth_options,
              uiMarkers: response.ui_markers
            }
          });
        }

        // If only OTP is enabled or if display_auth_choice is false, show OTP directly
        if (!response.ui_markers?.display_auth_choice ||
          (response.ui_markers?.allow_otp_login && !response.ui_markers?.allow_password_login)) {
          dispatch({ type: 'SHOW_OTP' });
        }
      } else {
        setError(new Error('User does not exist. Please contact administrator.'));
      }
    } catch (err: any) {
      // Handle API error responses
      if (err.response && err.response.data && err.response.data.error) {
        const apiError = err.response.data.error.toLowerCase();
        if (apiError.includes('user not found') || apiError.includes('user doesn\'t exist')) {
          setError(new Error('This phone number is not registered in our system. Please contact your administrator to create an account or verify your phone number.'));
        } else {
          setError(new Error(err.response.data.error));
        }
      } else if (err.message) {
        const errorMessage = err.message.toLowerCase();
        if (errorMessage.includes('user not found') || errorMessage.includes('user doesn\'t exist')) {
          setError(new Error('This phone number is not registered in our system. Please contact your administrator to create an account or verify your phone number.'));
        } else {
          setError(new Error(err.message));
        }
      } else {
        setError(new Error('An error occurred during login. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  // src/routes/Login/hooks.ts
  const handleOTPVerification = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response: VerifyOTPResponse = await verifyOTP({
        phone_number: formState.phoneNumber,
        otp: data.otp!,
        use_password: false
      });

      if (response.user.token) {

        const token = response.user.token;
        TokenService.setToken(token);
        localStorage.setItem('user', JSON.stringify(response.user));


        // Verify token was set
        const storedToken = TokenService.getToken();
        await new Promise(resolve => setTimeout(resolve, 100));

        if (TokenService.isAuthenticated()) {
          navigate(redirectTo || '/orders/get-orders');
        } else {
          throw new Error('Failed to store token');
        }

      } else {
        setError(new Error('Invalid OTP or missing token'));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      // Use the same verifyOTP endpoint but with password payload
      const response = await verifyOTP({
        phone_number: formState.phoneNumber,
        password: data.password!,
        use_password: true
      });

      if (response.user.token) {
        const token = response.user.token;
        TokenService.setToken(token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Verify token was set
        await new Promise(resolve => setTimeout(resolve, 100));

        if (TokenService.isAuthenticated()) {
          navigate(redirectTo || '/orders/get-orders');
        } else {
          throw new Error('Failed to store token');
        }
      } else {
        setError(new Error('Invalid password or missing token'));
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
    handlePasswordLogin,
  };
};