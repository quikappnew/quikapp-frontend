import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
  TableRow,
  TableCell,
  TablePagination,
  Paper
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import SidebarLayout from 'layouts/SidebarLayout';
import DataTable from 'components/DataTable';
import { toast } from 'react-toastify';
import { getUsers, createSimpleUser, deleteUser, getCurrentUser } from 'services/api';
import type { User, PaginatedResponse } from 'types/api';

// Interface for user list API response
interface UserListItem {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  role: number;
  role_display: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

interface CreateUserFormData {
  phone_number: string;
  full_name: string;
  email: string;
  role: number;
  password: string;
  confirmPassword: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [createUserData, setCreateUserData] = useState<CreateUserFormData>({
    phone_number: '',
    full_name: '',
    email: '',
    role: 2,
    password: '',
    confirmPassword: ''
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [apiError, setApiError] = useState<string>('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [previousCursors, setPreviousCursors] = useState<string[]>([]);

  useEffect(() => {
    const user = getCurrentUser();

    setCurrentUser(user);
    
    // Only fetch users if we have a user
    if (user) {
      fetchUsers();
    } else {
      
      setApiError('No user session found. Please log in to view users.');
      setLoading(false);
    }
  }, []);

  const fetchUsers = async (cursor?: string, resetPagination = false) => {
    try {
      setLoading(true);
      
      const params = {
        limit: rowsPerPage,
        ...(cursor && { cursor })
      };
      
      const response: any = await getUsers(params);
      
      // The API returns users in response.users array
      const usersData = response.users || [];
      
      setUsers(usersData);
      setTotalUsers(response.total_users || usersData.length);
      setNextCursor(response.next_cursor || null);
      
      if (resetPagination) {
        setPage(0);
        setPreviousCursors([]);
      }
    } catch (error: any) {
      
      
      // Set API error state for display
      setApiError(`Failed to load users: ${error.message}`);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  const getAllRoles = () => {
    return [
      { value: 0, label: 'Admin', color: 'error' },
      { value: 1, label: 'Super User', color: 'secondary' },
      { value: 2, label: 'User', color: 'primary' },
      { value: 3, label: 'Driver', color: 'success' },
      { value: 4, label: 'Vendor', color: 'warning' },
      { value: 5, label: 'Vendor Admin', color: 'warning' },
      { value: 6, label: 'Client', color: 'info' },
      { value: 7, label: 'Client Admin', color: 'info' },
      { value: 8, label: 'Sales Person', color: 'default' },
      { value: 9, label: 'Sales Person Admin', color: 'default' }
    ];
  };

  const getRoleDisplayName = (role: number): string => {
    const roleData = getAllRoles().find(r => r.value === role);
    return roleData?.label || `Role ${role}`;
  };

  const getRoleColor = (role: number): any => {
    const roleData = getAllRoles().find(r => r.value === role);
    return roleData?.color || 'default';
  };

  const isSuperUser = () => {
    const numericRole = typeof currentUser?.role === 'string' ? parseInt(currentUser.role, 10) : currentUser?.role;
    return numericRole === 1; // Super User role
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    if (newPage === 0) {
      // Go to first page
      fetchUsers(undefined, true);
    } else if (newPage > page && nextCursor) {
      // Going forward - use next cursor
      const newPreviousCursors = [...previousCursors];
      if (newPreviousCursors.length <= page) {
        newPreviousCursors.push(nextCursor);
      }
      setPreviousCursors(newPreviousCursors);
      fetchUsers(nextCursor);
      setPage(newPage);
    } else if (newPage < page && newPage >= 0) {
      // Going backward - use previous cursor
      const targetCursor = newPage === 0 ? undefined : previousCursors[newPage - 1];
      fetchUsers(targetCursor);
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setPreviousCursors([]);
    fetchUsers(undefined, true);
  };

  const handleCreateUser = async () => {
    setCreateError('');
    
    // Validation
    if (!createUserData.phone_number || !createUserData.full_name || !createUserData.password || !createUserData.confirmPassword) {
      setCreateError('All required fields must be filled');
      return;
    }
    
    if (createUserData.password !== createUserData.confirmPassword) {
      setCreateError('Passwords do not match');
      return;
    }
    
    if (createUserData.password.length < 6) {
      setCreateError('Password must be at least 6 characters long');
      return;
    }

    // Phone number validation
    if (!/^\d{10}$/.test(createUserData.phone_number)) {
      setCreateError('Phone number must be 10 digits');
      return;
    }

    setCreateLoading(true);
    
    try {
      await createSimpleUser({
        phone_number: createUserData.phone_number,
        full_name: createUserData.full_name,
        email: createUserData.email || undefined,
        role: createUserData.role,
        password: createUserData.password,
        is_active: true
      });

      toast.success('User created successfully!');
      setCreateModalOpen(false);
      resetCreateForm();
      fetchUsers(undefined, true); // Refresh the users list and reset pagination
    } catch (error: any) {

      setCreateError(error.message || 'Failed to create user');
      toast.error('Failed to create user');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        toast.success('User deleted successfully!');
        fetchUsers(undefined, true); // Refresh the users list and reset pagination
      } catch (error: any) {
  
        toast.error('Failed to delete user');
      }
    }
  };

  const resetCreateForm = () => {
    setCreateUserData({
      phone_number: '',
      full_name: '',
      email: '',
      role: 2,
      password: '',
      confirmPassword: ''
    });
    setCreateError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    resetCreateForm();
  };

  const columns = [
    { label: 'Name', fieldName: 'full_name', width: 200 },
    { label: 'Contact', fieldName: 'phone_number', width: 200 },
    { label: 'Role', fieldName: 'role_display', width: 150 },
    { label: 'Status', fieldName: 'is_active', width: 120 },
    { label: 'Joined', fieldName: 'date_joined', width: 150 },
    { label: 'Actions', fieldName: 'actions', width: 150 }
  ];

  const customRowRender = (user: UserListItem) => (
    <TableRow key={user.id}>
      {/* Name Column */}
      <TableCell style={{ width: 200 }}>
        <Typography variant="body2" fontWeight="medium">
          {user.full_name}
        </Typography>
      </TableCell>
      
      {/* Contact Column */}
      <TableCell style={{ width: 200 }}>
        <Box>
          <Typography variant="body2">
            {user.phone_number || 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.email || 'No email'}
          </Typography>
        </Box>
      </TableCell>
      
      {/* Role Column */}
      <TableCell style={{ width: 150 }}>
        <Chip 
          label={getRoleDisplayName(user.role)} 
          color={getRoleColor(user.role)}
          size="small"
        />
      </TableCell>
      
      {/* Status Column */}
      <TableCell style={{ width: 120 }}>
        <Chip 
          label={user.is_active ? 'Active' : 'Inactive'} 
          color={user.is_active ? 'success' : 'default'}
          size="small"
        />
      </TableCell>
      
      {/* Joined Column */}
      <TableCell style={{ width: 150 }}>
        {new Date(user.date_joined).toLocaleDateString()}
      </TableCell>
      
      {/* Actions Column */}
      <TableCell style={{ width: 150 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(user);
              setEditModalOpen(true);
            }}
            title="Edit User"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          {isSuperUser() && (
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUser(user.id);
              }}
              title="Delete User"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );

  if (loading) {
    return (
      <SidebarLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              User Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage system users, roles, and permissions
            </Typography>
          </Box>
          {isSuperUser() && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Create User
            </Button>
          )}
        </Box>

        {/* API Error Alert */}
        {apiError && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            action={
              !currentUser && (
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => window.location.href = '/login'}
                >
                  Login
                </Button>
              )
            }
          >
            {apiError}
          </Alert>
        )}

        {/* Stats Cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            bgcolor: 'primary.50', 
            border: '1px solid',
            borderColor: 'primary.200',
            minWidth: 120 
          }}>
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              {totalUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Users
            </Typography>
          </Box>
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            bgcolor: 'success.50', 
            border: '1px solid',
            borderColor: 'success.200',
            minWidth: 120 
          }}>
            <Typography variant="h6" color="success.main" fontWeight="bold">
              {users.filter(u => u.is_active).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Users
            </Typography>
          </Box>
        </Box>

        {/* Users Table */}
        <Paper sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <DataTable
            data={users}
            columns={columns}
            searchFields={['full_name', 'email', 'phone_number']}
            customRowRender={customRowRender}
          />
          
          {/* Pagination */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            p: 2,
            borderTop: '1px solid rgba(224, 224, 224, 1)',
            bgcolor: 'grey.50'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Users per page:
              </Typography>
              <Select
                value={rowsPerPage}
                onChange={(e) => handleChangeRowsPerPage({ target: { value: e.target.value } } as any)}
                size="small"
                sx={{ minWidth: 80 }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Page {page + 1} • {users.length} users shown
                {totalUsers > users.length && ` of ${totalUsers} total`}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => handleChangePage(null, 0)}
                  disabled={page === 0}
                  variant="outlined"
                >
                  First
                </Button>
                <Button
                  size="small"
                  onClick={() => handleChangePage(null, page - 1)}
                  disabled={page === 0}
                  variant="outlined"
                >
                  Previous
                </Button>
                <Button
                  size="small"
                  onClick={() => handleChangePage(null, page + 1)}
                  disabled={!nextCursor}
                  variant="outlined"
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Create User Modal */}
        <Dialog 
          open={createModalOpen} 
          onClose={handleCloseCreateModal}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Create New User
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              {createError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {createError}
                </Alert>
              )}
              
              <TextField
                fullWidth
                label="Phone Number"
                value={createUserData.phone_number}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, phone_number: e.target.value }))}
                margin="normal"
                disabled={createLoading}
                helperText="Enter 10-digit phone number"
                inputProps={{ maxLength: 10 }}
              />
              
              <TextField
                fullWidth
                label="Full Name"
                value={createUserData.full_name}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, full_name: e.target.value }))}
                margin="normal"
                disabled={createLoading}
              />
              
              <TextField
                fullWidth
                label="Email (Optional)"
                type="email"
                value={createUserData.email}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))}
                margin="normal"
                disabled={createLoading}
              />

              <FormControl fullWidth margin="normal" disabled={createLoading}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={createUserData.role}
                  label="Role"
                  onChange={(e) => setCreateUserData(prev => ({ ...prev, role: e.target.value as number }))}
                >
                  {getAllRoles().map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      <Chip 
                        label={role.label} 
                        color={role.color as any}
                        size="small"
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                value={createUserData.password}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, password: e.target.value }))}
                margin="normal"
                disabled={createLoading}
                helperText="Password must be at least 6 characters long"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={createLoading}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <TextField
                fullWidth
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                value={createUserData.confirmPassword}
                onChange={(e) => setCreateUserData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                margin="normal"
                disabled={createLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        disabled={createLoading}
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={handleCloseCreateModal}
              disabled={createLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateUser}
              variant="contained"
              disabled={createLoading}
              startIcon={createLoading ? <CircularProgress size={16} /> : null}
            >
              {createLoading ? 'Creating...' : 'Create User'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Modal - Placeholder for future implementation */}
        <Dialog 
          open={editModalOpen} 
          onClose={() => setEditModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Typography>Edit functionality will be implemented here.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </SidebarLayout>
  );
};

export default UserManagement;
