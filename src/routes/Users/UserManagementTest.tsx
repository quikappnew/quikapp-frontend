import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Grid
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  createUserManagement,
  getUserManagement,
  updateUserManagement,
  listUsersManagement,
  deleteUserManagement,
  getRolesManagement,
  updateUserRoleManagement,
  changePasswordManagement,
  isSuperUser,
  type CreateUserRequest,
  type GetUserRequest,
  type UpdateUserRequest,
  type DeleteUserRequest,
  type UpdateUserRoleRequest,
  type ChangePasswordRequest
} from 'services/api';

const UserManagementTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Test data
  const [testUser, setTestUser] = useState<CreateUserRequest>({
    phone_number: '+1234567890',
    full_name: 'Test User',
    email: 'test@example.com',
    role: 2,
    password: 'testpass123',
    is_active: true
  });

  const [userId, setUserId] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('newpass123');
  const [newRole, setNewRole] = useState<number>(3);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testCreateUser = async () => {
    try {
      setLoading(true);
      addResult('Testing createUserManagement...');
      
      const response = await createUserManagement(testUser);
      
      if (response.success) {
        addResult(`✅ User created successfully! ID: ${response.data.id}`);
        setUserId(response.data.id);
        toast.success('User created successfully');
      } else {
        addResult(`❌ Failed to create user`);
        toast.error('Failed to create user');
      }
    } catch (error: any) {
      addResult(`❌ Error creating user: ${error.message}`);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetUser = async () => {
    if (!userId) {
      addResult('❌ No user ID available. Create a user first.');
      return;
    }

    try {
      setLoading(true);
      addResult('Testing getUserManagement...');
      
      const response = await getUserManagement({ user_id: userId });
      
      if (response.success) {
        addResult(`✅ User retrieved successfully! Name: ${response.data.full_name}`);
        toast.success('User retrieved successfully');
      } else {
        addResult(`❌ Failed to get user`);
        toast.error('Failed to get user');
      }
    } catch (error: any) {
      addResult(`❌ Error getting user: ${error.message}`);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testUpdateUser = async () => {
    if (!userId) {
      addResult('❌ No user ID available. Create a user first.');
      return;
    }

    try {
      setLoading(true);
      addResult('Testing updateUserManagement...');
      
      const updateData: UpdateUserRequest & { user_id: string } = {
        user_id: userId,
        full_name: 'Updated Test User',
        email: 'updated@example.com',
        is_active: true
      };
      
      const response = await updateUserManagement(updateData);
      
      if (response.success) {
        addResult(`✅ User updated successfully! New name: ${response.data.full_name}`);
        toast.success('User updated successfully');
      } else {
        addResult(`❌ Failed to update user`);
        toast.error('Failed to update user');
      }
    } catch (error: any) {
      addResult(`❌ Error updating user: ${error.message}`);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testListUsers = async () => {
    try {
      setLoading(true);
      addResult('Testing listUsersManagement...');
      
      const response = await listUsersManagement({
        page: 1,
        page_size: 10,
        search: '',
        role: undefined,
        is_active: undefined
      });
      
      if (response.success) {
        addResult(`✅ Users listed successfully! Total: ${response.data.total_users}, Page: ${response.data.page}`);
        toast.success('Users listed successfully');
      } else {
        addResult(`❌ Failed to list users`);
        toast.error('Failed to list users');
      }
    } catch (error: any) {
      addResult(`❌ Error listing users: ${error.message}`);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetRoles = async () => {
    try {
      setLoading(true);
      addResult('Testing getRolesManagement...');
      
      const response = await getRolesManagement();
      
      if (response.success) {
        addResult(`✅ Roles retrieved successfully! Count: ${response.data.length}`);
        response.data.forEach(role => {
          addResult(`  - ${role.display_name} (ID: ${role.id})`);
        });
        toast.success('Roles retrieved successfully');
      } else {
        addResult(`❌ Failed to get roles`);
        toast.error('Failed to get roles');
      }
    } catch (error: any) {
      addResult(`❌ Error getting roles: ${error.message}`);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testUpdateUserRole = async () => {
    if (!userId) {
      addResult('❌ No user ID available. Create a user first.');
      return;
    }

    try {
      setLoading(true);
      addResult('Testing updateUserRoleManagement...');
      
      const roleData: UpdateUserRoleRequest = {
        user_id: userId,
        role: newRole
      };
      
      const response = await updateUserRoleManagement(roleData);
      
      if (response.success) {
        addResult(`✅ User role updated successfully! New role: ${response.data.role_display}`);
        toast.success('User role updated successfully');
      } else {
        addResult(`❌ Failed to update user role`);
        toast.error('Failed to update user role');
      }
    } catch (error: any) {
      addResult(`❌ Error updating user role: ${error.message}`);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testChangePassword = async () => {
    if (!userId) {
      addResult('❌ No user ID available. Create a user first.');
      return;
    }

    try {
      setLoading(true);
      addResult('Testing changePasswordManagement...');
      
      const passwordData: ChangePasswordRequest = {
        user_id: userId,
        new_password: newPassword
      };
      
      const response = await changePasswordManagement(passwordData);
      
      if (response.success) {
        addResult(`✅ Password changed successfully!`);
        toast.success('Password changed successfully');
      } else {
        addResult(`❌ Failed to change password`);
        toast.error('Failed to change password');
      }
    } catch (error: any) {
      addResult(`❌ Error changing password: ${error.message}`);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testDeleteUser = async () => {
    if (!userId) {
      addResult('❌ No user ID available. Create a user first.');
      return;
    }

    try {
      setLoading(true);
      addResult('Testing deleteUserManagement...');
      
      const deleteData: DeleteUserRequest = {
        user_id: userId
      };
      
      const response = await deleteUserManagement(deleteData);
      
      if (response.success) {
        addResult(`✅ User deleted successfully!`);
        setUserId(''); // Clear the user ID
        toast.success('User deleted successfully');
      } else {
        addResult(`❌ Failed to delete user`);
        toast.error('Failed to delete user');
      }
    } catch (error: any) {
      addResult(`❌ Error deleting user: ${error.message}`);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testAllFunctions = async () => {
    clearResults();
    addResult('🚀 Starting comprehensive API test...');
    
    // Check if user is super user
    if (!isSuperUser()) {
      addResult('❌ Access denied. Super user privileges required.');
      return;
    }
    
    addResult('✅ Super user access confirmed.');
    
    // Test in sequence
    await testGetRoles();
    await testListUsers();
    await testCreateUser();
    await testGetUser();
    await testUpdateUser();
    await testUpdateUserRole();
    await testChangePassword();
    await testDeleteUser();
    
    addResult('🎉 All tests completed!');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management API Test
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This component tests all the user management API functions. Make sure you're logged in as a Super User.
      </Alert>

      <Grid container spacing={3}>
        {/* Test Controls */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Controls
              </Typography>
              
              <Button
                variant="contained"
                onClick={testAllFunctions}
                disabled={loading}
                sx={{ mb: 2, mr: 1 }}
                fullWidth
              >
                {loading ? 'Testing...' : 'Run All Tests'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={clearResults}
                sx={{ mb: 2 }}
                fullWidth
              >
                Clear Results
              </Button>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Individual Tests:
              </Typography>
              
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={testGetRoles}
                    disabled={loading}
                    fullWidth
                  >
                    Get Roles
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={testListUsers}
                    disabled={loading}
                    fullWidth
                  >
                    List Users
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={testCreateUser}
                    disabled={loading}
                    fullWidth
                  >
                    Create User
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={testGetUser}
                    disabled={loading}
                    fullWidth
                  >
                    Get User
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={testUpdateUser}
                    disabled={loading}
                    fullWidth
                  >
                    Update User
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={testUpdateUserRole}
                    disabled={loading}
                    fullWidth
                  >
                    Update Role
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={testChangePassword}
                    disabled={loading}
                    fullWidth
                  >
                    Change Password
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={testDeleteUser}
                    disabled={loading}
                    fullWidth
                  >
                    Delete User
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Test Data */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Data
              </Typography>
              
              <TextField
                fullWidth
                label="User ID (auto-generated)"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                sx={{ mb: 2 }}
                disabled
              />
              
              <TextField
                fullWidth
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>New Role</InputLabel>
                <Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as number)}
                  label="New Role"
                >
                  <MenuItem value={0}>Admin</MenuItem>
                  <MenuItem value={1}>Super User</MenuItem>
                  <MenuItem value={2}>User</MenuItem>
                  <MenuItem value={3}>Driver</MenuItem>
                  <MenuItem value={4}>Vendor</MenuItem>
                  <MenuItem value={5}>Vendor Admin</MenuItem>
                  <MenuItem value={6}>Client</MenuItem>
                  <MenuItem value={7}>Client Admin</MenuItem>
                  <MenuItem value={8}>Sales Person</MenuItem>
                  <MenuItem value={9}>Sales Person Admin</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Test Results */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Results
              </Typography>
              
              <Box
                sx={{
                  maxHeight: 400,
                  overflowY: 'auto',
                  bgcolor: 'grey.50',
                  p: 2,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}
              >
                {testResults.length === 0 ? (
                  <Typography color="text.secondary">
                    No test results yet. Click "Run All Tests" to start testing.
                  </Typography>
                ) : (
                  testResults.map((result, index) => (
                    <Box key={index} sx={{ mb: 0.5 }}>
                      {result}
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserManagementTest;
