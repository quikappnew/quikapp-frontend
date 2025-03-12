import { useMutation } from '@apollo/client';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { gql } from '__generated__';
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from 'components/Button';
import { FormInput, FormPanel } from 'components/FormPanel';

const CREATE_DOCUMENT_MUTATION = gql(`
  mutation CreateDocument(
    $userId: ID!
    $name: String!
    $description: String
    $type: DocumentTypeEnumType!
    $file: Upload!
  ) {
    createDocument(
      userId: $userId
      name: $name
      description: $description
      type: $type
      file: $file
    ) {
      id
      name
      description
      type
      file
      status
      createdAt
      updatedAt
    }
  }
`);

const CreateDocumentDialogButton: FC = () => {
  const [showDialog, toggleDialog] = useState(false);
  const { userId } = useParams<{ userId: string }>() as { userId: string };

  const [createDocument, { loading, error }] = useMutation(CREATE_DOCUMENT_MUTATION, {
    update(cache, { data }) {
      if (!data) return;
      cache.modify({
        id: `UserType:${userId}`,
        fields: {
          documents(existingDocumentsRef) {
            const newDocumentNodeRef = cache.writeFragment({
              data: data.createDocument,
              fragment: gql(`
                fragment NewDocument on DocumentType {
                  id
                  name
                  description
                  type
                  file
                  status
                  updatedAt
                  createdAt
                }
              `),
            });
            return [newDocumentNodeRef, ...existingDocumentsRef];
          },
        },
      });
    },
  });

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
            onSubmit={data => {
              createDocument({
                variables: {
                  userId,
                  name: data.name,
                  description: data.description,
                  type: data.type,
                  file: data.file,
                },
              }).then(() => toggleDialog(false));
            }}
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
                { value: 'PAY_SLIP', label: 'Pay Slip' },
                { value: 'DRIVING_LICENSE', label: 'Driving License' },
                { value: 'NATIONAL_ID', label: 'National ID' },
                { value: 'PASSPORT', label: 'Passport' },
                { value: 'OTHER', label: 'Other' },
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
