import { useMutation, useQuery } from '@apollo/client';
import { gql } from '__generated__';
import { IdentityCardStatusEnumType } from '__generated__/graphql';
import { FC } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import Button from 'components/Button';
import Columns from 'components/Columns';
import DetailsPanel from 'components/DetailsPanel';
import ErrorMessage from 'components/ErrorMessage';
import LoadingButton from 'components/LoadingButton';
import LoadingIndicator from 'components/LoadingIndicator';

import UpdateIdentityCardStatus from './UpdateIdentityCardStatus';

const IDENTITY_CARD_QUERY = gql(`
  query IdentityCardInfo($id: ID!) {
    identityCard(id: $id) {
      id
      cardNumber
      user {
        id
        firstName
        lastName
        gender
        nationality
        province {
          id
          name
        }
        photo
      }
      codeLink
      status
      issueDate
      expiryDate
      updatedAt
      createdAt
    }
  }
`);

const CREATE_PRINT_SESSION = gql(`
  mutation CreatePrintSession($identityCardIds: [ID!]!, $provinceId: ID!) {
    createPrintSession(identityCardIds: $identityCardIds, provinceId: $provinceId) {
      id
      name
      status
      createdAt
    }
  }
`);

const CardInformation: FC = () => {
  const { identityCardId } = useParams<{ identityCardId: string }>() as { identityCardId: string };

  const { loading, error, data, refetch } = useQuery(IDENTITY_CARD_QUERY, {
    variables: {
      id: identityCardId,
    },
  });

  const [createPrintSession, { loading: printLoading, error: printError }] =
    useMutation(CREATE_PRINT_SESSION);

  const renderContent = () => {
    if (loading) return <LoadingIndicator />;

    if (error || !data) return <ErrorMessage error={error} refetch={refetch} />;

    const identityCard = data.identityCard;

    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '5px',
          }}
        >
          <a href={`/identities/${identityCardId}`} target="_blank" rel="noreferrer">
            <Button variant="contained">Open Public Link</Button>
          </a>
          {printError && <ErrorMessage error={printError} />}
          <LoadingButton
            loading={printLoading}
            onClick={() => {
              createPrintSession({
                variables: {
                  identityCardIds: [identityCard.id as string],
                  provinceId: identityCard.user.province.id as string,
                },
              }).then(data => window.open(`/print-sessions/${data.data?.createPrintSession.id}`));
            }}
          >
            Print
          </LoadingButton>
        </div>
        <Columns number={2}>
          <DetailsPanel
            title="Details"
            data={[
              { label: 'Card Number', value: identityCard.cardNumber },
              { label: 'First Name', value: identityCard.user.firstName },
              { label: 'Last Name', value: identityCard.user.lastName },
              { label: 'Gender', value: identityCard.user.gender },
              { label: 'Province', value: identityCard.user.province.name },
              { label: 'Photo', value: identityCard.user.photo, type: 'IMAGE' },
              { label: 'Nationality', value: identityCard.user.nationality, type: 'COUNTRY' },
              {
                label: 'Code Link',
                value: identityCard.codeLink,
                type: 'LINK',
                navigateTo: identityCard.codeLink,
              },
              { label: 'Status', value: identityCard.status, type: 'STATUS' },
              { label: 'Issue Date', value: identityCard.issueDate, type: 'DATE' },
              { label: 'Expiry Date', value: identityCard.expiryDate, type: 'DATE' },
              { label: 'Updated At', value: identityCard.updatedAt, type: 'DATETIME' },
              { label: 'Created At', value: identityCard.createdAt, type: 'DATETIME' },
            ]}
          />
          <UpdateIdentityCardStatus
            id={identityCardId}
            status={
              identityCard.status as
                | IdentityCardStatusEnumType.Active
                | IdentityCardStatusEnumType.Inactive
            }
          />
        </Columns>
      </>
    );
  };

  return (
    <>
      {renderContent()}
      <Outlet />
    </>
  );
};

export default CardInformation;
