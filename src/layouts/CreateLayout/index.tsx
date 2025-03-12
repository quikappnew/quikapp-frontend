import { Box, Grid } from '@mui/material';
import { FC } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import closeIcon from 'media/icons/close.svg';
import pngLogo from 'media/pngLogo.png';

import theme from './theme.module.scss';

const CreateLayout: FC<{ children: any; onClose?: () => void }> = props => {
  const navigate = useNavigate();

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
          <div className={theme.sidebar}>
            <NavLink to="/">
              <img className={theme.logo} src={pngLogo} alt="PNG logo" height={24} />
            </NavLink>
            <div
              className={theme.closeButton}
              onClick={() => (props.onClose ? props.onClose() : navigate(-1))}
            >
              <img src={closeIcon} alt="Close" height={28} />
            </div>
          </div>
          <Grid container justifyContent="center" alignContent="center">
            <Grid item xs={12} md={10} lg={9} xl={9}>
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: 2,
                }}
              >
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

export default CreateLayout;
