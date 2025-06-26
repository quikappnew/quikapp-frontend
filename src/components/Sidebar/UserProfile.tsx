import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  KeyIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { toast } from 'react-toastify';
import { getCurrentUserByToken, getCurrentUser } from 'services/api';
import { TokenService } from 'services/tokenService';

interface UserProfileData {
  id: string;
  phone_number: string;
  full_name: string;
  email: string;
  role: number | string;
}

interface PasswordUpdateData {
  newPassword: string;
  confirmPassword: string;
}



const UserProfile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // First try to get fresh data from API
        try {
          const response = await getCurrentUserByToken();
          if (response?.valid) {
            setUserProfile(response.user);
            return;
          }
        } catch (apiError) {
          // API call failed, fall back to localStorage
        }
        
        // Fallback to localStorage data
        const localUser = getCurrentUser();
        if (localUser) {
          setUserProfile({
            id: localUser.id,
            phone_number: localUser.phone_number,
            full_name: localUser.full_name,
            email: localUser.email || '',
            role: localUser.role
          });
        }
      } catch (error) {
        // Silent error handling - profile will show as unavailable
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);



  const getRoleDisplayName = (role: number | string): string => {
    // Convert to number if it's a string
    const numericRole = typeof role === 'string' ? parseInt(role, 10) : role;
    
    const roleMap: { [key: number]: string } = {
      0: 'Admin',
      1: 'Super User',
      2: 'User',
      3: 'Driver',
      4: 'Vendor',
      5: 'Vendor Admin',
      6: 'Client',
      7: 'Client Admin',
      8: 'Sales Person',
      9: 'Sales Person Admin'
    };
    
    return roleMap[numericRole] || `Role ${role}`;
  };

  const getRoleColor = (role: number | string): string => {
    const numericRole = typeof role === 'string' ? parseInt(role, 10) : role;
    
    const colorMap: { [key: number]: string } = {
      0: 'bg-red-500',      // Admin
      1: 'bg-purple-500',   // Super User
      2: 'bg-blue-500',     // User
      3: 'bg-green-500',    // Driver
      4: 'bg-orange-500',   // Vendor
      5: 'bg-orange-600',   // Vendor Admin
      6: 'bg-indigo-500',   // Client
      7: 'bg-indigo-600',   // Client Admin
      8: 'bg-teal-500',     // Sales Person
      9: 'bg-teal-600'      // Sales Person Admin
    };
    
    return colorMap[numericRole] || 'bg-gray-500';
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePasswordUpdate = async () => {
    setPasswordError('');
    
    // Validation
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);
    
    try {
      const token = TokenService.getToken();
      if (!token || !userProfile) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/v2/users/change_password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          auth_token: token,
          phone_number: userProfile.phone_number,
          new_password: passwordData.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to update password');
      }

      toast.success('Password updated successfully!');
      setPasswordModalOpen(false);
      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {

      setPasswordError(error.message || 'Failed to update password');
      toast.error('Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
    setPasswordData({
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };





  if (loading) {
    return (
      <div className="p-4 mb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="p-4 mb-4 border-b border-gray-200">
        <div className="flex items-center gap-3 text-gray-500">
          <UserIcon className="w-12 h-12" />
          <span className="text-sm">Profile unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 border-b border-gray-200 bg-white">
        <div 
          className="p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            {/* Profile Avatar */}
            <div className={`w-12 h-12 ${getRoleColor(userProfile.role)} rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md`}>
              {getInitials(userProfile.full_name)}
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userProfile.full_name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${getRoleColor(userProfile.role)}`}>
                  {getRoleDisplayName(userProfile.role)}
                </span>
              </div>
            </div>
            
            {/* Expand/Collapse Icon */}
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
        
        {/* Expanded Details */}
        {isExpanded && (
          <div className="px-4 pb-4 space-y-3 bg-gray-50">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
               
                <span className="text-xs text-gray-500">({userProfile.role})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">Phone:</span>
                <span className="truncate">{userProfile.phone_number}</span>
              </div>
              {userProfile.email && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="truncate">{userProfile.email}</span>
                </div>
              )}
              
            </div>
            
            {/* Action Buttons */}
            <div className="pt-2 border-t border-gray-200 space-y-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPasswordModalOpen(true);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <KeyIcon className="w-4 h-4" />
                Change Password
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Password Update Modal */}
      <Dialog 
        open={passwordModalOpen} 
        onClose={handleClosePasswordModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <div className="flex items-center gap-2">
            <KeyIcon className="w-5 h-5 text-blue-600" />
            Change Password
          </div>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
            
            <TextField
              fullWidth
              type={showNewPassword ? "text" : "password"}
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              margin="normal"
              disabled={passwordLoading}
              helperText="Password must be at least 6 characters long"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                      disabled={passwordLoading}
                    >
                      {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              margin="normal"
              disabled={passwordLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={passwordLoading}
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleClosePasswordModal}
            disabled={passwordLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePasswordUpdate}
            variant="contained"
            disabled={passwordLoading}
            startIcon={passwordLoading ? <CircularProgress size={16} /> : null}
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </DialogActions>
      </Dialog>


    </>
  );
};

export default UserProfile; 