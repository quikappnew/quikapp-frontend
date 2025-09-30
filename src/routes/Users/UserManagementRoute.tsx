import React, { useEffect, useState } from 'react';
import SidebarLayout from 'layouts/SidebarLayout';
import UserManagement from './UserManagement';
import { isSuperUser, getCurrentUser } from 'services/api';
import { Alert, Box, Typography } from '@mui/material';

const UserManagementRoute: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isSuperUserStatus, setIsSuperUserStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    const superUserCheck = isSuperUser();
    
    setUserInfo(user);
    setIsSuperUserStatus(superUserCheck);
    

  }, []);

  // Show loading state while checking user info
  if (isSuperUserStatus === null) {
    return (
      <SidebarLayout>
        <Box sx={{ p: 3 }}>
          <Typography>Loading user information...</Typography>
        </Box>
      </SidebarLayout>
    );
  }

  // Check if user has super user privileges
  if (!isSuperUserStatus) {
    return (
      <SidebarLayout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Access denied. Super user privileges required to access user management.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Current user role: {userInfo?.role} (Type: {typeof userInfo?.role})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Required role: 1 (Super User)
          </Typography>
        </Box>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <UserManagement />
    </SidebarLayout>
  );
};

export default UserManagementRoute;
