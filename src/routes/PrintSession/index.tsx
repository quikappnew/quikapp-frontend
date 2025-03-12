import { useMutation, useQuery } from '@apollo/client';
import { gql } from '__generated__';
import { PrintSessionStatusEnumType } from '__generated__/graphql';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from 'components/Button';
import ConfirmButton from 'components/ConfirmButton';
import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';
import NCDCIdentityCard from 'components/NCDCIdentityCard';

import theme from './theme.module.scss';

const PRINT_SESSION_QUERY = gql(`
  query PrintSession($id: ID!) {
    printSession(id: $id) {
      id
      name
      status
      createdAt
      province {
        id
        name
      }
      identityCards {
        id
        cardNumber
        user {
          id
          firstName
          lastName
          gender
          dateOfBirth
          category
          province {
            id
            name
          }
          nationality
          provinceOfOrigin
          photo
          address {
            line1
            city
          }
        }
        codeLink
        status
        issueDate
        expiryDate
        updatedAt
        createdAt
      }
    }
  }
`);

const MARK_PRINT_SESSION_AS_PRINTED = gql(`
  mutation MarkPrintSessionAsPrinted($id: ID!) {
    markPrintSessionAsPrinted(id: $id) {
      id
      status
    }
  }
`);

const MARK_PRINT_SESSION_AS_CANCELLED = gql(`
  mutation MarkPrintSessionAsCancelled($id: ID!) {
    markPrintSessionAsCancelled(id: $id) {
      id
      status
    }
  }
`);

const PrintSession: FC = () => {
  const navigate = useNavigate();
  const { printSessionId } = useParams<{ printSessionId: string }>() as { printSessionId: string };

  const { loading, error, data, refetch } = useQuery(PRINT_SESSION_QUERY, {
    variables: {
      id: printSessionId,
    },
  });

  const [markPrintSessionAsPrinted, { loading: markPrintLoading, error: markPrintError }] =
    useMutation(MARK_PRINT_SESSION_AS_PRINTED, {
      refetchQueries: ['ProvinceIdentityCards'],
    });

  const [markPrintSessionAsCancelled, { loading: markCancelLoading, error: markCancelError }] =
    useMutation(MARK_PRINT_SESSION_AS_CANCELLED);

  if (loading) return <LoadingIndicator />;

  if (error || !data) return <ErrorMessage error={error} refetch={refetch} />;

  const printSession = data.printSession;

  return (
    <div className={theme.container}>
      {printSession.identityCards.map(identityCard => {
        return <NCDCIdentityCard identityCard={identityCard} />;
      })}
      <div className={theme.printSessionCard}>
        <p className={theme.title}>Print Session</p>
        <p className={theme.name}>
          Name: <strong>{printSession.name}</strong>
        </p>
        <p className={theme.province}>Province: {printSession.province.name}</p>
        <p className={theme.status}>Status: {printSession.status}</p>
        <p className={theme.date}>Created At: {printSession.createdAt}</p>
        {printSession.status === PrintSessionStatusEnumType.Pending ? (
          <div className={theme.actionsContainer}>
            <Button onClick={() => window.print()}>Print</Button>
            <ConfirmButton
              onConfirm={() =>
                markPrintSessionAsPrinted({ variables: { id: printSessionId } }).then(() => {
                  navigate(`/provinces/${printSession.province.id}/identity-cards`);
                })
              }
              loading={markPrintLoading}
              error={markPrintError}
            >
              Mark Cards as Active
            </ConfirmButton>
            <ConfirmButton
              onConfirm={() =>
                markPrintSessionAsCancelled({ variables: { id: printSessionId } }).then(() => {
                  navigate(`/provinces/${printSession.province.id}/identity-cards`);
                })
              }
              loading={markCancelLoading}
              error={markCancelError}
            >
              Cancel Printing
            </ConfirmButton>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PrintSession;
