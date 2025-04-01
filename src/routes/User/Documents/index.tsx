import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import DataTable from '../../../components/DataTable';
import ErrorMessage from '../../../components/ErrorMessage';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { getDocuments } from '../../../services/api';
import type { ApiError, Document } from '../../../types/api';

import CreateDocumentDialogButton from './CreateDocumentDialogButton';

const UserDocuments: FC = () => {
  const { userId } = useParams<{ userId: string }>() as { userId: string };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const [documents, setDocuments] = useState<Document[]>([]);

  const fetchDocuments = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await getDocuments(userId);
      setDocuments(data);
      setError(undefined);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  if (loading && !documents.length) return <LoadingIndicator />;

  if (error) return <ErrorMessage error={error} onRetry={fetchDocuments} />;

  return (
    <>
      <CreateDocumentDialogButton />
      <DataTable
        data={documents}
        columns={[
          {
            label: 'Type',
            fieldName: 'type',
            type: 'STRING',
            width: 150,
          },
          {
            label: 'Name',
            fieldName: 'name',
            type: 'STRING',
            width: 150,
          },
          {
            label: 'Description',
            fieldName: 'description',
            type: 'STRING',
            width: 150,
          },
          {
            label: 'File',
            fieldName: 'fileUrl',
            type: 'FILE',
            width: 150,
          },
          {
            label: 'Status',
            fieldName: 'status',
            type: 'STATUS',
            width: 150,
          },
          {
            label: 'Created At',
            fieldName: 'createdAt',
            type: 'DATETIME',
            width: 150,
          },
        ]}
      />
    </>
  );
};

export default UserDocuments;
