import React, { FC, ReactNode, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import ErrorMessage from '../ErrorMessage';
import type { ApiError } from 'types/api';

export interface Props {
  children: ReactNode;
  onConfirm: () => Promise<void>;
  loading?: boolean;
  error?: ApiError | null;
}

const ConfirmButton: FC<Props> = ({ children, onConfirm, loading, error }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    try {
      await onConfirm();
      handleClose();
    } catch (err) {
      console.error('Error in confirmation:', err);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} disabled={loading}>
        {children}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          Are you sure you want to proceed with this action?
          {error && <ErrorMessage error={error} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={loading}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmButton; 