import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Button } from '@mui/material';

import { FormInput, FormPanel } from 'components/FormPanel';
import { login, register } from 'services/api';
import { User } from 'types/api';
import { storeLoginCredentials } from 'utils/auth';

import theme from './theme.module.scss';

export const pngLogo = 'https://d1x4ga22txmryo.cloudfront.net/static/image_assets/newlogo.png';



const Login: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirectTo');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const user = await login(formData.email, formData.password);
      storeLoginCredentials(user, formData.password);
      navigate(redirectTo || '/users');
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData: any) => {
    setLoading(true);
    setError(null);
    
    // Only pick the fields we need for registration
    const registerData = {
      phone_number: formData.phone_number,
      full_name: formData.full_name,
      ...(formData.email ? { email: formData.email } : {})
    };

    console.log('Registration data:', registerData); // Log the cleaned data

    try {
      await register(registerData);
      // After successful registration, switch back to login form
      setIsRegistering(false);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <FormPanel
      loading={loading}
      error={error}
      onSubmit={handleLogin}
      submitButtonLabel="Login"
    >
      <FormInput fieldName="email" type="string" defaultValue="" label="Email" fullWidth />
      <FormInput
        fieldName="password"
        type="password"
        defaultValue=""
        label="Password"
        fullWidth
      />
    </FormPanel>
  );

  const renderRegisterForm = () => (
    <FormPanel
      loading={loading}
      error={error}
      onSubmit={handleRegister}
      submitButtonLabel="Register"
      key="register-form" // Add key to ensure form state is reset
    >
      <FormInput
        fieldName="phone_number"
        type="string"
        defaultValue=""
        label="Phone Number"
        fullWidth
      />
      <FormInput
        fieldName="full_name"
        type="string"
        defaultValue=""
        label="Full Name"
        fullWidth
      />
      <FormInput
        fieldName="email"
        type="string"
        defaultValue=""
        label="Email (Optional)"
        fullWidth
      />
    </FormPanel>
  );

  return (
    <div className="max-w-sm mx-auto  px-4 h-screen flex  justify-center flex-col">
      <div className="flex flex-col  mb-2">
        <NavLink to="/" className="flex flex-col gap-2">
        <img className="h-16 w-20" src={pngLogo} alt="PNG logo" />
        {/* <span>Logistics</span> */}
        </NavLink>
        <h2 className='my-2'>Please {isRegistering ? 'Register' : 'Sign in'}</h2>
      </div>
      {isRegistering ? (
        <>
          {renderRegisterForm()}
          <div className="mt-4 text-center">
            <Button
              variant="text"
              onClick={() => {
                setIsRegistering(false);
                setError(null);
              }}
            >
              Already have an account? Sign in
            </Button>
          </div>
        </>
      ) : (
        <>
          {renderLoginForm()}
          <div className="mt-4 text-center">
            <Button
              variant="text"
              onClick={() => {
                setIsRegistering(true);
                setError(null);
              }}
            >
              Don't have an account? Register
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
