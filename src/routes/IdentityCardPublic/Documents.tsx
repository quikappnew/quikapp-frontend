import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';

import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';
import { getIdentityCardDocuments } from 'services/api';
import { Document } from 'types/api';

const Documents: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);

  const fetchDocuments = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getIdentityCardDocuments(id);
      setDocuments(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage error={error} onRetry={fetchDocuments} />;
  if (!documents.length) return <div>No documents found.</div>;

  return (
    <div>
      {documents.map(doc => (
        <div key={doc.id}>
          <p>Name: {doc.name}</p>
          <p>Type: {doc.type}</p>
          <p>Description: {doc.description}</p>
          <a href={doc.url} target="_blank" rel="noreferrer">
            View Document
          </a>
        </div>
      ))}
    </div>
  );
};

export default Documents;
