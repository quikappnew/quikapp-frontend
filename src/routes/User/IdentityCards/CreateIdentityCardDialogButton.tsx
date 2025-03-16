import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from '../../../components/Button';
import { FormInput, FormPanel } from '../../../components/FormPanel';
import { createIdentityCard } from '../../../services/api';
import { ApiError } from '../../../types/api';

interface CreateIdentityCardData {
  cardNumber?: string;
  issueDate?: string;
  expiryDate?: string;
}

const CreateIdentityCardDialogButton: FC = () => {
  const [showDialog, toggleDialog] = useState(false);
  const { userId } = useParams<{ userId: string }>() as { userId: string };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | undefined>(undefined);

  const handleSubmit = async (data: CreateIdentityCardData) => {
    try {
      setLoading(true);
      setError(undefined);
      await createIdentityCard(userId, data);
      toggleDialog(false);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => toggleDialog(true)}>
        Generate an Identity Card
      </Button>
      <Dialog open={showDialog} onClose={() => toggleDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Generate an Identity Card</DialogTitle>
        <DialogContent sx={{ minHeight: '50vh' }}>
          <FormPanel
            loading={loading}
            error={error}
            onCancel={() => toggleDialog(false)}
            onSubmit={handleSubmit}
          >
            <FormInput
              fullWidth
              type="string"
              fieldName="cardNumber"
              label="Card Number"
              helperText="Leave this empty to auto-generate a card number. Check if the province has a card number prefix."
              defaultValue=""
            />
            <FormInput
              fullWidth
              type="date"
              fieldName="issueDate"
              label="Issue Date"
              helperText="Leave this empty to auto-generate an issue date."
              defaultValue=""
            />
            <FormInput
              fullWidth
              type="date"
              fieldName="expiryDate"
              label="Expiry Date"
              helperText="Leave this empty to auto-generate an expiry date."
              defaultValue=""
            />
          </FormPanel>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateIdentityCardDialogButton;
