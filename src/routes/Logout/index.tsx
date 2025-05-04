import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Logout</DialogTitle>
    <DialogContent>
      Are you sure you want to log out?
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">Logout</Button>
    </DialogActions>
  </Dialog>
);

export default LogoutModal;
