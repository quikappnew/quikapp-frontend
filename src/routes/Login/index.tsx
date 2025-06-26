import React, { FC, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { FormContext } from 'context/FormContext';
import { LoginForm, OTPForm, AuthMethodSelector, PasswordForm } from './component';
import { useAuth } from './hooks';

export const pngLogo = 'https://quikapp.cc/lovable-uploads/4da932a7-a74d-4dd1-a1a0-1e93bc4da154.png';

const Login: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirectTo');
  const { dispatch } = useContext(FormContext);

  const { formState, handleLogin, handleOTPVerification, handlePasswordLogin } = 
    useAuth(redirectTo, navigate);

  const renderForm = () => {
    // Show initial login form if no auth options are set yet
    if (!formState.authOptions || !formState.uiMarkers) {
      return <LoginForm onSubmit={handleLogin} formState={formState} />;
    }

    // Show OTP form if OTP is being used
    if (formState.showOTP) {
      return <OTPForm onSubmit={handleOTPVerification} formState={formState} />;
    }

    // Show password form if password method is selected
    if (formState.selectedAuthMethod === 'password' && !formState.showOTP) {
      return <PasswordForm onSubmit={handlePasswordLogin} formState={formState} />;
    }

    // Show auth method selector if user has choices
    return (
      <>
        <AuthMethodSelector formState={formState} />
        {formState.selectedAuthMethod === 'otp' ? (
          <OTPForm onSubmit={handleOTPVerification} formState={formState} />
        ) : (
          <PasswordForm onSubmit={handlePasswordLogin} formState={formState} />
        )}
      </>
    );
  };

  return (
    <div className="max-w-sm mx-auto px-4 h-screen flex justify-center flex-col">
      <div className="flex flex-col mb-2">
        <NavLink to="/" className="flex flex-col gap-2">
          <img className="h-16 w-20" src={pngLogo} alt="PNG logo" />
        </NavLink>
        {!formState.showOTP &&
          <h2 className='my-2'>Please Sign in</h2>}
      </div>
      {renderForm()}
    </div>
  );
};

export default Login;