import { Button } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import ErrorLayout from 'layouts/ErrorLayout';

import accessDeniedImage from 'media/access_denied.jpg';

import theme from './theme.module.scss';

const RouteAccessDenied: FC = () => {
  const navigate = useNavigate();
  return (
    <ErrorLayout>
      <div className={theme.container}>
        <img className={theme.image} src={accessDeniedImage} alt="No access" />
        <p className={theme.title}>You don't have the permission to view this page</p>
        <p className={theme.description}>
          You may have mistyped the address or the page may have moved. If this is an error, please
          contact the support.
        </p>
        <br />
        <Button variant="contained" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </ErrorLayout>
  );
};
export default RouteAccessDenied;
