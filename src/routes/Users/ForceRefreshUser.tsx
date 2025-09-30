import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { getCurrentUserByToken, getCurrentUser } from 'services/api';

const ForceRefreshUser: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Show current user data
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const forceRefreshUser = async () => {
    setLoading(true);
    setMessage('Refreshing user data...');

    try {
      // Clear current user data
      localStorage.removeItem('user');
      
      // Get fresh user data from token validation
      const tokenValidation = await getCurrentUserByToken();
      
      if (tokenValidation?.valid && tokenValidation.user) {
        // Store the fresh user data with correct role type
        const userData = {
          id: tokenValidation.user.id,
          phone_number: tokenValidation.user.phone_number,
          full_name: tokenValidation.user.full_name,
          email: tokenValidation.user.email,
          role: tokenValidation.user.role // This should be number 1
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        setMessage('User data refreshed successfully! Please refresh the page.');
        setCurrentUser(userData);
        
        
        
      } else {
        setMessage('Failed to refresh user data. Please log in again.');
      }
    } catch (error) {
      setMessage('Error refreshing user data. Please log in again.');

    } finally {
      setLoading(false);
    }
  };

  const clearAndReload = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Force Refresh User Data
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This will force refresh your user data from the server and fix the sidebar issue.
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current User Data
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
            {JSON.stringify(currentUser, null, 2)}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          onClick={forceRefreshUser}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Refreshing...' : 'Force Refresh User Data'}
        </Button>
        
        <Button
          variant="outlined"
          onClick={clearAndReload}
        >
          Clear & Reload Page
        </Button>
      </Box>

      {message && (
        <Alert severity={message.includes('successfully') ? 'success' : 'warning'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Instructions
          </Typography>
          <Typography variant="body2" paragraph>
            1. Click "Force Refresh User Data" to get fresh user data from the server
          </Typography>
          <Typography variant="body2" paragraph>
            2. After successful refresh, reload the page (F5 or Ctrl+R)
          </Typography>
          <Typography variant="body2" paragraph>
            3. Check if "User Management" appears in the sidebar
          </Typography>
          <Typography variant="body2" paragraph>
            4. If still not working, try "Clear & Reload Page" to completely reset
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForceRefreshUser;
