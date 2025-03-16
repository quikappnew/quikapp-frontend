import { FC } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';
import { getIdentityCard } from 'services/api';
import { IdentityCard } from 'types/api';

const IdentityCardPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [identityCard, setIdentityCard] = useState<IdentityCard | null>(null);

  const fetchIdentityCard = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getIdentityCard(id);
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
      <Outlet context={{ identityCard }} />
    </div>
  );
};

export default IdentityCardPage;
