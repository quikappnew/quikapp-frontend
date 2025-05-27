import React, { useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { FormContext } from 'context/FormContext';

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ open, onClose, onConfirm }) => {
  const { dispatch } = useContext(FormContext);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Logout</DialogTitle>
      <DialogContent>
        Are you sure you want to log out?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={()=>{onConfirm(); dispatch({ type: 'HIDE_OTP' }); dispatch({ type: 'SET_IS_REGISTERING', payload: false }); dispatch({ type: 'SET_LOADING', payload: false });}} color="error" variant="contained">Logout</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutModal;
