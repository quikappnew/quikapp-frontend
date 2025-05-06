import { FC, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Divider
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CommentIcon from '@mui/icons-material/Comment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UploadDocuments from './UploadDocuments';
import AddComment from 'components/AddComment';
import AddHaltingDays from 'components/AddHaltingDays';


interface Location {
  city: string;
  district: string;
  state: string;
  pincode: string;
}

interface TripDetailsProps {
  tripNumber: string;
  referenceId: string;
  fromLocation: Location;
  toLocation: Location;
  createdBy: string;
  createdDate: string;
  haltingDays: string;
  comments?: string[];
}

const InfoSection: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      variant="h6"
      sx={{
        bgcolor: 'info.light',
        color: 'white',
        p: 1,
        mb: 2,
        borderRadius: 1,
        fontSize: '1rem',
        fontWeight: 600
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

const InfoRow: FC<{ label: string; value: string }> = ({ label, value }) => (
  <Grid container sx={{ py: 1 }}>
    <Grid item xs={12} sm={3}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid item xs={12} sm={9}>
      <Typography variant="body2">{value}</Typography>
    </Grid>
  </Grid>
);

const TripDetails: FC<TripDetailsProps> = ({
  tripNumber,
  referenceId,
  fromLocation,
  toLocation,
  createdBy,
  createdDate,
  haltingDays,
  comments = []
}) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [haltingDaysModalOpen, setHaltingDaysModalOpen] = useState(false);

  const handleUploadSubmit = (files: { [key: string]: File }) => {
    // Handle the uploaded files here
    console.log('Uploaded files:', files);
  };

  const handleCommentSubmit = (comment: { text: string; priority: string }) => {
    // Handle the comment submission here
    console.log('New comment:', comment);
  };

  const handleHaltingDaysSubmit = (days: number) => {
    // Handle the halting days submission here
    console.log('Halting days:', days);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Trip Details: {tripNumber}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            size="small"
            onClick={() => setUploadModalOpen(true)}
          >
            Upload Documents
          </Button>
          <Button
            variant="outlined"
            startIcon={<CommentIcon />}
            size="small"
            onClick={() => setCommentModalOpen(true)}
          >
            Add Comment
          </Button>
          <Button
            variant="outlined"
            startIcon={<CalendarTodayIcon />}
            size="small"
            onClick={() => setHaltingDaysModalOpen(true)}
          >
            Add Halting Days
          </Button>
        </Box>
      </Box>

      <InfoSection title="General Information">
        <InfoRow label="Trip Number" value={tripNumber} />
        <InfoRow label="Reference ID" value={referenceId} />
      </InfoSection>

      <InfoSection title="From Location">
        <InfoRow label="City" value={fromLocation.city} />
        <InfoRow label="District" value={fromLocation.district} />
        <InfoRow label="State" value={fromLocation.state} />
        <InfoRow label="Pincode" value={fromLocation.pincode} />
      </InfoSection>

      <InfoSection title="To Location">
        <InfoRow label="City" value={toLocation.city} />
        <InfoRow label="District" value={toLocation.district} />
        <InfoRow label="State" value={toLocation.state} />
        <InfoRow label="Pincode" value={toLocation.pincode} />
      </InfoSection>

      <InfoSection title="Trip Details">
        <InfoRow label="Created By" value={createdBy} />
        <InfoRow label="Created Date" value={createdDate} />
        <InfoRow label="Halting Days" value={haltingDays} />
      </InfoSection>

      <InfoSection title="Comments History">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 1 }}>
              {comment}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No comments available.
          </Typography>
        )}
      </InfoSection>

      <UploadDocuments
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
      />
      <AddComment
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        onSubmit={handleCommentSubmit}
      />
      <AddHaltingDays
        open={haltingDaysModalOpen}
        onClose={() => setHaltingDaysModalOpen(false)}
        onSubmit={handleHaltingDaysSubmit}
      />
    </Paper>
  );
};

export default TripDetails; 