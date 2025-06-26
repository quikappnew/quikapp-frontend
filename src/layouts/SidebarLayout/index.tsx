// import { Box } from '@mui/material';
// import { FC, ReactNode } from 'react';
// import Sidebar from 'components/Sidebar';
// import getSidebarTabs from 'utils/sidebar-tabs';
// import theme from './theme.module.scss';

// interface SidebarLayoutProps {
//   children: ReactNode;
// }

// const SidebarLayout: FC<SidebarLayoutProps> = ({ children }) => {
//   return (
//     <Box sx={{ display: 'flex', minHeight: '100vh' }}>
//       <div className={theme.sidebarContainer}>
//         <Sidebar tabs={getSidebarTabs()} />
//       </div>
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           backgroundColor: '#f5f5f5',
//         }}
//       >
//         {children}
//       </Box>
//     </Box>
//   );
// };

// export default SidebarLayout;

// src/layouts/SidebarLayout/index.tsx
import React, { useState, useEffect } from 'react';
import { Box, IconButton, useMediaQuery, useTheme, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Sidebar from 'components/Sidebar';
import getSidebarTabs from 'utils/sidebar-tabs';
import { getCurrentUser } from 'services/api';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [userRole, setUserRole] = useState<number | undefined>(undefined);

  // Get user role on component mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserRole(typeof user.role === 'string' ? parseInt(user.role, 10) : user.role);
    }
  }, []);

  // Update sidebar state when screen size changes
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const sidebarContent = (
    <Box
      sx={{
        width: { xs: '240px', md: '280px' },
        height: '100%',
        backgroundColor: 'white',
        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <Sidebar tabs={getSidebarTabs(userRole)} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Menu Button */}
      <IconButton
        onClick={handleToggle}
        sx={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1,
          display: { xs: 'block', md: 'none' },
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isOpen}
          onClose={handleToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: '240px',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Box
          component="nav"
          sx={{
            width: { md: '280px' },
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
          }}
        >
          {sidebarContent}
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { xs: '100%', md: `calc(100% - 280px)` },
          transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
          backgroundColor: '#f5f5f5',
        }}
      >
        {/* Add top spacing for mobile to account for the menu button */}
        <Box sx={{ height: { xs: '48px', md: 0 } }} />
        {children}
      </Box>
    </Box>
  );
};

export default SidebarLayout;