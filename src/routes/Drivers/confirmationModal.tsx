import { Dialog, DialogTitle, DialogContent, Box, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DriverDetails {
  name: string;
  licenseNumber: string;
  phoneNumber: string;
  salary: number;
}

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  driverDetails: DriverDetails;
}

const ConfirmationModal = ({ open, onClose, driverDetails }: ConfirmationModalProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Driver Details</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography><strong>Name:</strong> {driverDetails.name}</Typography>
          <Typography><strong>License Number:</strong> {driverDetails.licenseNumber || 'None'}</Typography>
          <Typography><strong>Phone Number:</strong> {driverDetails.phoneNumber || 'None'}</Typography>
          <Typography><strong>Salary:</strong> {driverDetails.salary || '0.00'}</Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Attendance Records</Typography>
          <Typography color="text.secondary">No attendance records.</Typography>
          <Button 
            variant="contained" 
            color="success" 
            sx={{ mt: 1 }}
          >
            Mark Attendance
          </Button>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Payment Records</Typography>
          <Typography color="text.secondary">No payment records.</Typography>
          <Button 
            variant="contained" 
            sx={{ 
              mt: 1,
              backgroundColor: '#ffc107',
              '&:hover': {
                backgroundColor: '#ffb000'
              }
            }}
          >
            Record Payment
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;