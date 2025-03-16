import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from '../../../components/Button';
import { FormInput, FormPanel } from '../../../components/FormPanel';
import { createDocument } from '../../../services/api';
import { ApiError, DocumentTypeEnum } from '../../../types/api';

interface CreateDocumentData {
  name: string;
  description?: string;
  type: DocumentTypeEnum;
  file: File;
}

const CreateDocumentDialogButton: FC = () => {
  const [showDialog, toggleDialog] = useState(false);
  const { userId } = useParams<{ userId: string }>() as { userId: string };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | undefined>(undefined);

  const handleSubmit = async (data: CreateDocumentData) => {
    try {
      setLoading(true);
      setError(undefined);
      await createDocument(userId, data);
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
        Add Document
      </Button>
      <Dialog open={showDialog} onClose={() => toggleDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Document</DialogTitle>
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
              fieldName="name"
              label="Name"
              defaultValue=""
              validators={{
                required: true,
              }}
            />
            <FormInput
              fullWidth
              type="string"
              fieldName="description"
              label="Description"
              defaultValue=""
            />
            <FormInput
              fullWidth
              type="select"
              fieldName="type"
              label="Type"
              defaultValue=""
              options={[
                { value: DocumentTypeEnum.PASSPORT, label: 'Passport' },
                { value: DocumentTypeEnum.DRIVERS_LICENSE, label: 'Drivers License' },
                { value: DocumentTypeEnum.BIRTH_CERTIFICATE, label: 'Birth Certificate' },
                { value: DocumentTypeEnum.OTHER, label: 'Other' },
              ]}
              validators={{
                required: true,
              }}
            />
            <FormInput
              fullWidth
              type="upload"
              fieldName="file"
              label="File"
              defaultValue=""
              validators={{
                required: true,
              }}
            />
          </FormPanel>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateDocumentDialogButton;
