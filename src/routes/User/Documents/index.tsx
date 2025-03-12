import { useQuery } from '@apollo/client';
import { gql } from '__generated__';
import { DocumentStatusEnumType, DocumentTypeEnumType } from '__generated__/graphql';
import { FC } from 'react';
import { useParams } from 'react-router-dom';

import DataTable from 'components/DataTable';
import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';

import CreateDocumentDialogButton from './CreateDocumentDialogButton';

type Document = {
  id: string;
  type: DocumentTypeEnumType;
  name: string;
  description?: string;
  file: string;
  status: DocumentStatusEnumType;
  createdAt: string;
};

const USER_DOCUMENTS = gql(`
  query UserDocuments($userId: ID!) {
    user(id: $userId) {
      id
      documents {
        id
        type
        name
        description
        file
        status
        createdAt
      }
    }
  }
`);

const UserDocuments: FC = () => {
  const { userId } = useParams<{ userId: string }>() as { userId: string };

  const { loading, error, data, refetch } = useQuery(USER_DOCUMENTS, {
    variables: {
      userId,
    },
  });

  if (loading && !data) return <LoadingIndicator />;

  if (error || !data) return <ErrorMessage error={error} refetch={refetch} />;

  const documents = data.user.documents;

  return (
    <>
      <CreateDocumentDialogButton />
      <DataTable
        data={documents as Document[]}
        columns={[
          {
            label: 'Type',
            fieldName: 'type',
            type: 'STRING',
          },
          {
            label: 'Name',
            fieldName: 'name',
            type: 'STRING',
          },
          {
            label: 'Description',
            fieldName: 'description',
            type: 'STRING',
          },
          {
            label: 'File',
            fieldName: 'file',
            type: 'FILE',
          },
          {
            label: 'Status',
            fieldName: 'status',
            type: 'STRING',
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

export default UserDocuments;
