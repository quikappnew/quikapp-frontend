import { useQuery } from '@apollo/client';
import { gql } from '__generated__';
import { IdentityCardType } from '__generated__/graphql';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import DataTable from 'components/DataTable';
import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';

import CreateIdentityCardDialogButton from './CreateIdentityCardDialogButton';

const IDENTITY_CARDS_QUERY = gql(`
  query IdentityCards($userId: ID!) {
    user(id: $userId) {
      id
      identityCards {
        id
        cardNumber
        status
        issueDate
        expiryDate
        createdAt
      }
    }
  }
`);

const UserIdentityCards: FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(IDENTITY_CARDS_QUERY, {
    variables: { userId: userId as string },
  });

  if (loading) return <LoadingIndicator />;

  if (error || !data) return <ErrorMessage error={error} refetch={refetch} />;

  const identityCards = data.user.identityCards;

  return (
    <>
      <CreateIdentityCardDialogButton />
      <DataTable
        data={identityCards as IdentityCardType[]}
        onClick={identityCard => navigate(`/identity-cards/${identityCard.id}`)}
        columns={[
          {
            label: 'Card Number',
            fieldName: 'cardNumber',
          },
          {
            label: 'Issue Date',
            fieldName: 'issueDate',
            type: 'DATETIME',
          },
          {
            label: 'Expiry Date',
            fieldName: 'expiryDate',
            type: 'DATETIME',
          },
          {
            label: 'Status',
            fieldName: 'status',
            type: 'STATUS',
          },
          {
            label: 'Created At',
            fieldName: 'createdAt',
            type: 'DATETIME',
          },
        ]}
      />
    </>
  );
};

export default UserIdentityCards;
