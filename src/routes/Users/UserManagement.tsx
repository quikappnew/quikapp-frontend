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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Tooltip,
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Lock as LockIcon
} from '@mui/icons-material';
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
  requireSuperUser,
  type UserManagementUser,
  type CreateUserRequest,
  type UpdateUserRequest,
  type Role,
  type ListUsersRequest
} from 'services/api';

interface UserManagementProps {
  onClose?: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onClose }) => {
  // State management
  const [users, setUsers] = useState<UserManagementUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  
  // Selected user state
  const [selectedUser, setSelectedUser] = useState<UserManagementUser | null>(null);
  
  // Form states
  const [createForm, setCreateForm] = useState<CreateUserRequest>({
    phone_number: '',
    full_name: '',
    email: '',
    role: 2,
    password: '',
    is_active: true
  });
  
  const [editForm, setEditForm] = useState<UpdateUserRequest>({
    phone_number: '',
    full_name: '',
    email: '',
    role: 2,
    is_active: true
  });
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newRole, setNewRole] = useState<number>(2);
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  
  // Pagination and filters
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filters, setFilters] = useState<ListUsersRequest>({
    page: 1,
    page_size: 10,
    search: '',
    role: undefined,
    is_active: undefined
  });
  
  // Error states
  const [error, setError] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if user has super user privileges
    if (!isSuperUser()) {
      setError('Access denied. Super user privileges required.');
      setLoading(false);
      return;
    }
    
    fetchUsers();
    fetchRoles();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await listUsersManagement(filters);
      
      if (response.success) {
        setUsers(response.data.users);
        setTotalUsers(response.data.total_users);
        setPage(response.data.page - 1); // Convert to 0-based index
      } else {
        setError('Failed to fetch users');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch users');
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const response = await getRolesManagement();
      
      if (response.success) {
        setRoles(response.data);
      } else {
        toast.error('Failed to fetch roles');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch roles');
    } finally {
      setRolesLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      // Validation
      const errors: Record<string, string> = {};
      if (!createForm.phone_number) errors.phone_number = 'Phone number is required';
      if (!createForm.full_name) errors.full_name = 'Full name is required';
      if (!createForm.email) errors.email = 'Email is required';
      if (!createForm.password) errors.password = 'Password is required';
      if (createForm.password.length < 6) errors.password = 'Password must be at least 6 characters';
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const response = await createUserManagement(createForm);
      
      if (response.success) {
        toast.success('User created successfully');
        setCreateModalOpen(false);
        resetCreateForm();
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to create user');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await updateUserManagement({
        user_id: selectedUser.id,
        ...editForm
      });
      
      if (response.success) {
        toast.success('User updated successfully');
        setEditModalOpen(false);
        resetEditForm();
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to update user');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await deleteUserManagement({ user_id: selectedUser.id });
      
      if (response.success) {
        toast.success('User deleted successfully');
        setDeleteModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to delete user');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await updateUserRoleManagement({
        user_id: selectedUser.id,
        role: newRole
      });
      
      if (response.success) {
        toast.success('User role updated successfully');
        setRoleModalOpen(false);
        setNewRole(2);
        fetchUsers();
      } else {
        toast.error(response.message || 'Failed to update user role');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user role');
    }
  };

  const handleChangePassword = async () => {
    if (!selectedUser) return;
    
    try {
      // Validation
      if (!newPassword) {
        toast.error('New password is required');
        return;
      }
      if (newPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      const response = await changePasswordManagement({
        user_id: selectedUser.id,
        new_password: newPassword
      });
      
      if (response.success) {
        toast.success('Password changed successfully');
        setPasswordModalOpen(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      phone_number: '',
      full_name: '',
      email: '',
      role: 2,
      password: '',
      is_active: true
    });
    setFormErrors({});
  };

  const resetEditForm = () => {
    setEditForm({
      phone_number: '',
      full_name: '',
      email: '',
      role: 2,
      is_active: true
    });
    setFormErrors({});
  };

  const handleEditUser = (user: UserManagementUser) => {
    setSelectedUser(user);
    setEditForm({
      phone_number: user.phone_number,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      is_active: user.is_active
    });
    setEditModalOpen(true);
  };

  const handleDeleteUserClick = (user: UserManagementUser) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleRoleChange = (user: UserManagementUser) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleModalOpen(true);
  };

  const handlePasswordChange = (user: UserManagementUser) => {
    setSelectedUser(user);
    setPasswordModalOpen(true);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage + 1 // Convert to 1-based index
    }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setFilters(prev => ({
      ...prev,
      page: 1,
      page_size: newRowsPerPage
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: event.target.value,
      page: 1
    }));
  };

  const handleFilterChange = (field: keyof ListUsersRequest, value: any) => {
    let processedValue = value;
    
    // Convert string boolean values to actual booleans for is_active field
    if (field === 'is_active') {
      if (value === 'true') {
        processedValue = true;
      } else if (value === 'false') {
        processedValue = false;
      } else {
        processedValue = undefined;
      }
    }
    
    setFilters(prev => ({
      ...prev,
      [field]: processedValue,
      page: 1
    }));
  };

  const getRoleDisplayName = (roleId: number): string => {
    const role = roles.find(r => r.id === roleId);
    return role?.display_name || `Role ${roleId}`;
  };

  const getRoleColor = (roleId: number): any => {
    const roleColors: Record<number, any> = {
      0: 'error',    // Admin
      1: 'secondary', // Super User
      2: 'primary',   // User
      3: 'success',   // Driver
      4: 'warning',   // Vendor
      5: 'warning',   // Vendor Admin
      6: 'info',      // Client
      7: 'info',      // Client Admin
      8: 'default',   // Sales Person
      9: 'default'    // Sales Person Admin
    };
    return roleColors[roleId] || 'default';
  };

  if (!isSuperUser()) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. Super user privileges required to access user management.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create User
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search users"
                value={filters.search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={filters.role || ''}
                  onChange={(e) => handleFilterChange('role', e.target.value || undefined)}
                  label="Role"
                >
                  <MenuItem value="">All Roles</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.display_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.is_active === undefined ? '' : filters.is_active}
                  onChange={(e) => handleFilterChange('is_active', e.target.value === '' ? undefined : e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchUsers}
                disabled={loading}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.phone_number}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleDisplayName(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.is_active ? 'Active' : 'Inactive'}
                        color={user.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.date_joined).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Edit User">
                          <IconButton
                            size="small"
                            onClick={() => handleEditUser(user)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Change Role">
                          <IconButton
                            size="small"
                            onClick={() => handleRoleChange(user)}
                          >
                            <SecurityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Change Password">
                          <IconButton
                            size="small"
                            onClick={() => handlePasswordChange(user)}
                          >
                            <LockIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteUserClick(user)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={totalUsers}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>

      {/* Create User Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={createForm.phone_number}
                onChange={(e) => setCreateForm(prev => ({ ...prev, phone_number: e.target.value }))}
                error={!!formErrors.phone_number}
                helperText={formErrors.phone_number}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={createForm.full_name}
                onChange={(e) => setCreateForm(prev => ({ ...prev, full_name: e.target.value }))}
                error={!!formErrors.full_name}
                helperText={formErrors.full_name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={createForm.role}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, role: e.target.value as number }))}
                  label="Role"
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.display_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={createForm.password}
                onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                error={!!formErrors.password}
                helperText={formErrors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={createForm.is_active}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained">
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={editForm.phone_number}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone_number: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={editForm.full_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editForm.role}
                  onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value as number }))}
                  label="Role"
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.display_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained">
            Update User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{selectedUser?.full_name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Role Modal */}
      <Dialog open={roleModalOpen} onClose={() => setRoleModalOpen(false)}>
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Change role for user "{selectedUser?.full_name}"
          </Typography>
          <FormControl fullWidth>
            <InputLabel>New Role</InputLabel>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as number)}
              label="New Role"
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.display_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleModalOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateRole} variant="contained">
            Update Role
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Change password for user "{selectedUser?.full_name}"
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmNewPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        edge="end"
                      >
                        {showConfirmNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordModalOpen(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
