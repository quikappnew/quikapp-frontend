// src/routes/Login/components.tsx
import React, { FC, useEffect, useContext } from 'react';
import { Typography, Button, ButtonGroup } from '@mui/material';
import { FormInput, FormPanel } from 'components/FormPanel';
import { FormState, FormData } from './types';
import { TokenService } from 'services/tokenService';
import { FormContext } from 'context/FormContext';

interface FormProps {
  onSubmit: (data: FormData) => Promise<void>;
  formState: FormState;
}

export const LoginForm: FC<FormProps> = ({ onSubmit, formState }) => {
  useEffect(() => {
    TokenService.removeToken();
  }, []);

  return (
    <FormPanel
      loading={formState.loading}
      error={formState.error}
      onSubmit={onSubmit}
      submitButtonLabel="Continue"
    >
      <FormInput
        fieldName="phone_number"
        type="string"
        defaultValue={formState.phoneNumber}
        label="Phone Number"
        fullWidth
        validators={{ required: true }}
      />
    </FormPanel>
  );
};

export const AuthMethodSelector: FC<{ formState: FormState }> = ({ formState }) => {
  const { dispatch } = useContext(FormContext);

  if (!formState.uiMarkers?.display_auth_choice) {
    return null;
  }

  const handleAuthMethodChange = async (method: 'otp' | 'password') => {
    dispatch({ type: 'SET_AUTH_METHOD', payload: method });
    if (method === 'otp') {
      // Request OTP when user selects OTP method
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        // The OTP should already be sent from the initial login call
        dispatch({ type: 'SHOW_OTP' });
      } catch (error) {
  
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'HIDE_OTP' });
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <Typography variant="h6" align="center">
        Choose Authentication Method
      </Typography>
      <ButtonGroup variant="outlined" fullWidth>
        {formState.uiMarkers?.allow_otp_login && (
          <Button
            variant={formState.selectedAuthMethod === 'otp' ? 'contained' : 'outlined'}
            onClick={() => handleAuthMethodChange('otp')}
          >
            OTP Login
          </Button>
        )}
        {formState.uiMarkers?.allow_password_login && (
          <Button
            variant={formState.selectedAuthMethod === 'password' ? 'contained' : 'outlined'}
            onClick={() => handleAuthMethodChange('password')}
          >
            Password Login
          </Button>
        )}
      </ButtonGroup>
    </div>
  );
};

export const PasswordForm: FC<FormProps> = ({ onSubmit, formState }) => (
  <FormPanel
    loading={formState.loading}
    error={formState.error}
    onSubmit={onSubmit}
    submitButtonLabel="Login"
  >
    <FormInput
      fieldName="password"
      type="password"
      defaultValue=""
      label="Password"
      fullWidth
      validators={{ required: true }}
    />
  </FormPanel>
);

export const OTPForm: FC<FormProps> = ({ onSubmit, formState }) => (
  <div className="flex flex-col gap-4">
    <Typography variant="body1" align="center">
      Enter the verification code sent to {formState.phoneNumber}
    </Typography>
    <FormPanel
      loading={formState.loading}
      error={formState.error}
      onSubmit={onSubmit}
      submitButtonLabel="Verify OTP"
    >
      <FormInput
        fieldName="otp"
        type="string"
        defaultValue={formState.otp}
        label="OTP"
        fullWidth
        validators={{ required: true }}
      />
    </FormPanel>
  </div>
);