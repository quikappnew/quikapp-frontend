import React, { FC, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Button } from '@mui/material';
import { FormContext } from 'context/FormContext';
import { LoginForm, OTPForm, RegisterForm } from './component';
import { useAuth } from './hooks';

export const pngLogo = 'https://d32f2yg5omsqjr.cloudfront.net/static/image_assets/newlogo.png';

const Login: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirectTo');
  const { dispatch } = useContext(FormContext);

  const { formState, handleLogin, handleOTPVerification, handleRegister } = 
    useAuth(redirectTo, navigate);

  const toggleRegistration = () => {
    dispatch({ type: 'SET_IS_REGISTERING', payload: !formState.isRegistering });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'HIDE_OTP' });
  };

  const renderForm = () => {
    if (formState.showOTP) {
      return <OTPForm onSubmit={handleOTPVerification} formState={formState} />;
    }
    return formState.isRegistering 
      ? <RegisterForm onSubmit={handleRegister} formState={formState} />
      : <LoginForm onSubmit={handleLogin} formState={formState} />;
  };

  return (
    <div className="max-w-sm mx-auto px-4 h-screen flex justify-center flex-col">
      <div className="flex flex-col mb-2">
        <NavLink to="/" className="flex flex-col gap-2">
          <img className="h-16 w-20" src={pngLogo} alt="PNG logo" />
        </NavLink>
        {!formState.showOTP &&
          <h2 className='my-2'>Please {formState.isRegistering ? 'Register' : 'Sign in'}</h2>}
      </div>
      {renderForm()}
      <div className="mt-4 text-center">
        <Button variant="text" onClick={toggleRegistration}>
          {formState.isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Register"}
        </Button>
      </div>
    </div>
  );
};

export default Login;