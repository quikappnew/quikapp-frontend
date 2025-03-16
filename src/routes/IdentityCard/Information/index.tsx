import { FC } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';
import { getIdentityCardInformation } from 'services/api';
import { IdentityCard, IdentityCardStatusEnum } from 'types/api';

const IdentityCardInformation: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [identityCard, setIdentityCard] = useState<IdentityCard | null>(null);

  const fetchIdentityCard = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getIdentityCardInformation(id);
      setIdentityCard(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdentityCard();
  }, [id]);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage error={error} onRetry={fetchIdentityCard} />;
  if (!identityCard) return null;

  return (
    <div>
      <Outlet context={{ identityCard, refetch: fetchIdentityCard }} />
    </div>
  );
};

export default IdentityCardInformation;
