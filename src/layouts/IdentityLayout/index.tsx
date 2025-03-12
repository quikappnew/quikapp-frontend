import { Box, Grid } from '@mui/material';
import { FC } from 'react';

const IdentityLayout: FC<{ title?: string; children: any }> = props => {
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
            <Grid item xs={12} md={8} lg={3} xl={3}>
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: 2,
                }}
              >
                {/* <NavLink to="/" className={theme.logoContainer}> */}
                {/* <span>PNG Employee Card </span> */}
                {/* </NavLink> */}
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

export default IdentityLayout;
