import { FC, useState, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AddHaltingDaysProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (days: number) => void;
}

const AddHaltingDays: FC<AddHaltingDaysProps> = ({ open, onClose, onSubmit }) => {
  const [days, setDays] = useState<string>('1');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Only allow positive numbers
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setDays(value);
    }
  };

  const handleSubmit = () => {
    const numDays = parseInt(days);
    if (numDays > 0) {
      onSubmit(numDays);
      setDays('1');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Add Trip Halting Days</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Halting days*
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={days}
            onChange={handleChange}
            inputProps={{ 
              min: 1,
              step: 1
            }}
            sx={{ mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            Number of halting days
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!days || parseInt(days) < 1}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Submit Halting Days
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddHaltingDays; 