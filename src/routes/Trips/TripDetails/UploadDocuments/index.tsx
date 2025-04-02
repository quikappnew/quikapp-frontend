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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface UploadDocumentsProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (files: { [key: string]: File }) => void;
}

interface DocumentField {
  label: string;
  key: string;
  required?: boolean;
}

const documentFields: DocumentField[] = [
  { label: 'LR Document', key: 'lrDocument' },
  { label: 'E-way Bill', key: 'ewayBill' },
  { label: 'Invoice', key: 'invoice' },
  { label: 'Cheque Leaf', key: 'chequeLeaf' },
];

const UploadDocuments: FC<UploadDocumentsProps> = ({ open, onClose, onSubmit }) => {
  const [files, setFiles] = useState<{ [key: string]: File }>({});

  const handleFileChange = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [key]: file
      }));
    }
  };

  const handleSubmit = () => {
    onSubmit(files);
    setFiles({});
    onClose();
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
          <Typography variant="h6">Upload Documents</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          {documentFields.map(({ label, key, required }) => (
            <Box key={key} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {label}{required && '*'}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange(key)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {files[key]?.name || 'No file chosen'}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDocuments; 