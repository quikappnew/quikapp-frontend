import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { getCurrentUser, isSuperUser } from 'services/api';
import getSidebarTabs from 'utils/sidebar-tabs';

const UserRoleDebug: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [sidebarTabs, setSidebarTabs] = useState<any[]>([]);
  const [isSuperUserStatus, setIsSuperUserStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    const superUserCheck = isSuperUser();
    const tabs = getSidebarTabs(user?.role);
    
    setUserInfo(user);
    setIsSuperUserStatus(superUserCheck);
    setSidebarTabs(tabs);
    

  }, []);

  const refreshUserInfo = () => {
    const user = getCurrentUser();
    const superUserCheck = isSuperUser();
    const tabs = getSidebarTabs(user?.role);
    
    setUserInfo(user);
    setIsSuperUserStatus(superUserCheck);
    setSidebarTabs(tabs);
  };

  if (!userInfo) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          No user information found. Please log in first.
        </Alert>
      </Box>
    );
  }

  const userManagementTab = sidebarTabs.find(tab => tab.key === 'manage-users');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Role Debug Information
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current User Information
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="User ID" 
                secondary={userInfo.id || 'Not available'} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Full Name" 
                secondary={userInfo.full_name || 'Not available'} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Email" 
                secondary={userInfo.email || 'Not available'} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Phone Number" 
                secondary={userInfo.phone_number || 'Not available'} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Role" 
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{userInfo.role}</span>
                    <Chip 
                      label={typeof userInfo.role} 
                      size="small" 
                      color="secondary" 
                    />
                  </Box>
                } 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Is Super User" 
                secondary={
                  <Chip 
                    label={isSuperUserStatus ? 'Yes' : 'No'} 
                    color={isSuperUserStatus ? 'success' : 'error'} 
                    size="small"
                  />
                } 
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sidebar Configuration
          </Typography>
          
          <Alert severity={userManagementTab ? 'success' : 'error'} sx={{ mb: 2 }}>
            User Management Tab: {userManagementTab ? 'Visible' : 'Hidden'}
          </Alert>

          <Typography variant="subtitle2" gutterBottom>
            Available Sidebar Tabs ({sidebarTabs.length}):
          </Typography>
          <List dense>
            {sidebarTabs.map((tab) => (
              <ListItem key={tab.key}>
                <ListItemText 
                  primary={tab.label}
                  secondary={`Key: ${tab.key} | Route: ${tab.route}`}
                />
                {tab.children && (
                  <Chip 
                    label={`${tab.children.length} children`} 
                    size="small" 
                    color="primary" 
                  />
                )}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Role Requirements
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            To see User Management in the sidebar, you need to be a Super User (role ID: 1)
          </Alert>

          <Typography variant="body2" paragraph>
            <strong>Current Role:</strong> {userInfo.role} (Type: {typeof userInfo.role})
          </Typography>
          
          <Typography variant="body2" paragraph>
            <strong>Required Role:</strong> 1 (Super User)
          </Typography>

          <Typography variant="body2" paragraph>
            <strong>Role Comparison:</strong> {userInfo.role} === 1 = {userInfo.role === 1 ? 'true' : 'false'}
          </Typography>

          <Typography variant="body2" paragraph>
            <strong>String Comparison:</strong> "{userInfo.role}" === "1" = {String(userInfo.role) === "1" ? 'true' : 'false'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Button 
            variant="contained" 
            onClick={refreshUserInfo}
            sx={{ mr: 1 }}
          >
            Refresh User Info
          </Button>

          <Button 
            variant="outlined" 
            onClick={() => {
              
            }}
          >
            Log to Console
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserRoleDebug;
