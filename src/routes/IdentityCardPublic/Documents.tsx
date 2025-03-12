import { useQuery } from '@apollo/client';
import { gql } from '__generated__';
import { FC, useState } from 'react';

import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';

import documentIcon from 'media/document-icon.svg';

import AuthenticateForDocumentDialog from './AuthenticateForDocumentDialog';
import theme from './theme.module.scss';

const IDENTITY_CARD_USER_QUERY = gql(`
  query IdentityCardUserQuery($id: ID!) {
    user(id: $id) {
      id
      documents {
        id
        type
        name
        description
        file
      }
    }
  }
`);

const UserDocuments: FC<{ userId: string; identityCardId: string }> = ({
  userId,
  identityCardId,
}) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [openAuthenticator, toggleAuthenticator] = useState(false);

  const { loading, error, data, refetch } = useQuery(IDENTITY_CARD_USER_QUERY, {
    variables: {
      id: userId,
    },
  });

  console.log(identityCardId);

  function renderContent() {
    if (loading) return <LoadingIndicator />;

    // const graphQLError = error?.graphQLErrors[0];

    // if (graphQLError && graphQLError.extensions?.code === 'FORBIDDEN') {
    // if (!isAuthenticated) {
    //   return;
    // }

    if (error || !data) return <ErrorMessage error={error} refetch={refetch} />;

    const user = data.user;

    if (!user.documents.length) {
      return null;
    }

    return (
      <>
        {openAuthenticator && (
          <AuthenticateForDocumentDialog
            onSuccess={() => {
              setAuthenticated(true);
              toggleAuthenticator(false);
            }}
            open={openAuthenticator}
            onClose={() => toggleAuthenticator(false)}
          />
        )}
        <div className={theme.loginToViewDocumentsContainer}>
          <div className={theme.titleContainer}>Documents</div>
          {isAuthenticated ? (
            <div className={theme.content}>
              {user.documents.map(document => (
                <a href={document.file} target="_blank" rel="noreferrer" key={document.id}>
                  <div className={theme.document}>
                    <img src={documentIcon} alt="document" height={20} />
                    <p>{document.name}</p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className={theme.loginContent}>
              {/* <a href={`/login?redirect=/identities/${identityCardId}`}>Login to view documents</a> */}
              <button
                className={theme.loginLink}
                onClick={() => {
                  toggleAuthenticator(true);
                }}
              >
                Login to view documents
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  return renderContent();
};

export default UserDocuments;
