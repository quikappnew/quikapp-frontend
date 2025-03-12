import { Box, Grid } from '@mui/material';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import pngLogo from 'media/pngLogo.png';

import theme from './theme.module.scss';

const FocusLayout: FC<{ title?: string; children: any }> = props => {
  const renderContent = () => {
    return (
      <>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
          }}
        >
          <Grid container justifyContent="center" alignContent="center">
            <Grid item xs={12} md={8} lg={6} xl={6}>
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: 2,
                }}
              >
                <NavLink to="/" className={theme.logoContainer}>
                  <img className={theme.logo} src={pngLogo} alt="PNG logo" height={64} />
                </NavLink>
                <div>{props.children}</div>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };

  return <Box sx={{ display: 'flex' }}>{renderContent()}</Box>;
};

export default FocusLayout;
