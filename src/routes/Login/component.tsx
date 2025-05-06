// src/routes/Login/components.tsx
import React, { FC, useEffect } from 'react';
import { Typography } from '@mui/material';
import { FormInput, FormPanel } from 'components/FormPanel';
import { FormState, FormData } from './types';
import { TokenService } from 'services/tokenService';

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
      submitButtonLabel="Login"
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

export const RegisterForm: FC<FormProps> = ({ onSubmit, formState }) => (
  <FormPanel
    loading={formState.loading}
    error={formState.error}
    onSubmit={onSubmit}
    submitButtonLabel="Register"
    key="register-form"
  >
    <FormInput
      fieldName="phone_number"
      type="string"
      defaultValue=""
      label="Phone Number"
      fullWidth
      validators={{ required: true }}
    />
    <FormInput
      fieldName="full_name"
      type="string"
      defaultValue=""
      label="Full Name"
      fullWidth
      validators={{ required: true }}
    />
    {/* <FormInput
      fieldName="email"
      type="string"
      defaultValue=""
      label="Email (Optional)"
      fullWidth
    /> */}
  </FormPanel>
);