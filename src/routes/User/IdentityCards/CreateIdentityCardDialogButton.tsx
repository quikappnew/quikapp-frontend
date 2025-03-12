import { useMutation } from '@apollo/client';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { gql } from '__generated__';
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from 'components/Button';
import { FormInput, FormPanel } from 'components/FormPanel';

const CREATE_IDENTITY_CARD_MUTATION = gql(`
  mutation CreateIdentityCard(
    $userId: ID!
    $cardNumber: String!
    $issueDate: String!
    $expiryDate: String!
  ) {
    createIdentityCard(
      userId: $userId
      cardNumber: $cardNumber
      issueDate: $issueDate
      expiryDate: $expiryDate
    ) {
      id
      cardNumber
      issueDate
      expiryDate
      createdAt
      updatedAt
    }
  }
`);

const CreateIdentityCardDialogButton: FC = () => {
  const [showDialog, toggleDialog] = useState(false);
  const { userId } = useParams<{ userId: string }>() as { userId: string };

  const [createIdentityCard, { loading, error }] = useMutation(CREATE_IDENTITY_CARD_MUTATION, {
    update(cache, { data }) {
      if (!data) return;
      cache.modify({
        id: `UserType:${userId}`,
        fields: {
          identityCards(existingIdentityCardsRef) {
            const newIdentityCardNodeRef = cache.writeFragment({
              data: data.createIdentityCard,
              fragment: gql(`
                fragment NewIdentityCard on IdentityCardType {
                  id
                  cardNumber
                  issueDate
                  expiryDate
                  status
                  updatedAt
                  createdAt
                }
              `),
            });
            return [newIdentityCardNodeRef, ...existingIdentityCardsRef];
          },
        },
      });
    },
  });

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
            onSubmit={data => {
              createIdentityCard({
                variables: {
                  userId,
                  cardNumber: data.cardNumber,
                  issueDate: data.issueDate,
                  expiryDate: data.expiryDate,
                },
              }).then(() => toggleDialog(false));
            }}
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
