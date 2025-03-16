import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { FormInput, FormPanel } from 'components/FormPanel';
import { login } from 'services/api';
import { User } from 'types/api';

import pngLogo from 'media/pngLogo.png';

import { storeLoginCredentials } from 'utils/auth';

const Login: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirectTo');

  const handleSubmit = async (formData: { email: string; password: string }) => {
    const user = await login(formData.email, formData.password);
    storeLoginCredentials(user, formData.password);
    navigate(redirectTo || '/users');
  };

  return (
    <div className="max-w-sm mx-auto mt-4 px-4">
      <div className="flex flex-col items-center mb-8">
        <NavLink to="/" className="flex flex-col items-center gap-2">
          <img className="h-16" src={pngLogo} alt="PNG logo" />
          <span>City Permit System</span>
        </NavLink>
        <h2>Sign in</h2>
      </div>
      <FormPanel
        loading={false}
        error={null}
        onSubmit={handleSubmit}
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
    </div>
  );
};

export default Login;
