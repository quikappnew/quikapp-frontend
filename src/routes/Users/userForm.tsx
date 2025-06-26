import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem, Grid, FormControl, InputLabel } from '@mui/material';
import ConfirmDeactivateModal from './ConfirmDeactivateModal';

interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  role: string;
  status?: string;
}

interface UserFormProps {
  onSubmit: (data: User) => void;
  user?: User;
  onClose: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, user, onClose }) => {
  const [formData, setFormData] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
    status: 'Active'
  });

  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '' // Don't pre-fill password in edit mode
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDeactivateClick = () => {

    setConfirmDeactivate(true);
  };

  const handleDeactivate = () => {

    onSubmit({
      ...formData,
      status: 'Inactive'
    });
    setConfirmDeactivate(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            variant="outlined"
            value={formData.firstName}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            variant="outlined"
            value={formData.lastName}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            variant="outlined"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {!user && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              fullWidth
              name="role"
              labelId="role-label"
              label="Role"
              value={formData.role}
              onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>)}
              required
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {user && (
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                fullWidth
                name="status"
                labelId="status-label"
                label="Status"
                value={formData.status}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>)}
                required
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            {/* {user && user.status === 'Active' && (
              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={handleDeactivateClick}
              >
                Deactivate User
              </Button>
            )} */}
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => {
                  onClose();
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    password: '',
                    role: '',
                    status: 'Active'
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {user ? 'Update User' : 'Create User'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <ConfirmDeactivateModal
        open={confirmDeactivate}
        onClose={() => {
      
          setConfirmDeactivate(false);
        }}
        onConfirm={handleDeactivate}
        userName={formData.firstName + ' ' + formData.lastName}
      />
    </Box>
  );
};

export default UserForm;