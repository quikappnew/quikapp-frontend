import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { ApiError } from '../../types/api';

interface Props {
  error?: ApiError | any;
  onRetry?: () => void;
  type?: string;
  refetch?: () => void;
}

export default function ErrorMessage({ error, onRetry, type, refetch }: Props) {
  if (!error) return null;

  const handleRetry = () => {
    if (refetch) {
      refetch();
    } else if (onRetry) {
      onRetry();
    }
  };

  const message = typeof error === 'string' ? error : error.message;

  return (
    <>
      <Alert 
        severity="error" 
        action={handleRetry ? <button onClick={handleRetry}>Retry</button> : undefined}
      >
        {message}
      </Alert>
      {type !== 'alert' && (
        <Snackbar open autoHideDuration={6000}>
          <Alert 
            severity="error" 
            action={handleRetry ? <button onClick={handleRetry}>Retry</button> : undefined}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
