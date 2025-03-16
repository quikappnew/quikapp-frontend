import { LoadingButton } from '@mui/lab';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { FC, useState } from 'react';
import { ApiError } from '../types/api';
import ErrorMessage from './ErrorMessage';

interface Props {
  onConfirm: () => Promise<any>;
  title: string;
  description: string;
  buttonText?: string;
  error?: ApiError;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}

const ConfirmButton: FC<Props> = ({
  onConfirm,
  title,
  description,
  buttonText = 'Delete',
  error,
  loading = false,
  disabled = false,
  variant = 'contained',
  color = 'error',
}) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    await onConfirm();
    handleClose();
  };

  return (
    <>
      <LoadingButton
        onClick={handleClickOpen}
        loading={loading}
        disabled={disabled}
        variant={variant}
        color={color}
      >
        {buttonText}
      </LoadingButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
          {error && <ErrorMessage error={error} />}
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={handleClose} color="primary">
            Cancel
          </LoadingButton>
          <LoadingButton onClick={handleConfirm} color="error" loading={loading} autoFocus>
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmButton;
