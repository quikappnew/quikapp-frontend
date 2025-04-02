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
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AddCommentProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (comment: { text: string; priority: string }) => void;
}

type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

const priorities: Priority[] = ['Low', 'Medium', 'High', 'Critical'];

const priorityColors: Record<Priority, string> = {
  Low: '#4CAF50',
  Medium: '#FFC107',
  High: '#FF9800',
  Critical: '#F44336'
};

const AddComment: FC<AddCommentProps> = ({ open, onClose, onSubmit }) => {
  const [comment, setComment] = useState('');
  const [priority, setPriority] = useState<Priority>('Low');

  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handlePriorityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPriority(event.target.value as Priority);
  };

  const handleSubmit = () => {
    onSubmit({
      text: comment,
      priority: priority
    });
    setComment('');
    setPriority('Low');
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
          <Typography variant="h6">Add Trip Comment</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Your Comment
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter your comments here..."
            value={comment}
            onChange={handleCommentChange}
            sx={{ mb: 3 }}
          />
          
          <Typography variant="body2" sx={{ mb: 1 }}>
            Priority*
          </Typography>
          <RadioGroup
            value={priority}
            onChange={handlePriorityChange}
          >
            {priorities.map((p) => (
              <FormControlLabel
                key={p}
                value={p}
                control={
                  <Radio 
                    sx={{
                      color: priorityColors[p],
                      '&.Mui-checked': {
                        color: priorityColors[p],
                      },
                    }}
                  />
                }
                label={p}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: priorityColors[p],
                    fontWeight: priority === p ? 500 : 400
                  }
                }}
              />
            ))}
          </RadioGroup>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!comment.trim()}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Submit Comment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddComment; 