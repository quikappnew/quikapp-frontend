import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import Sidebar from 'components/Sidebar';
import getSidebarTabs from 'utils/sidebar-tabs';
import theme from './theme.module.scss';

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <div className={theme.sidebarContainer}>
        <Sidebar tabs={getSidebarTabs()} />
      </div>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#f5f5f5',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SidebarLayout;
