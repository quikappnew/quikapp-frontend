import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import DataTable from '../../../components/DataTable';
import ErrorMessage from '../../../components/ErrorMessage';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { getIdentityCards } from '../../../services/api';
import { ApiError, IdentityCard } from '../../../types/api';

import CreateIdentityCardDialogButton from './CreateIdentityCardDialogButton';

const UserIdentityCards: FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const [identityCards, setIdentityCards] = useState<IdentityCard[]>([]);

  const fetchIdentityCards = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await getIdentityCards(userId);
      setIdentityCards(data);
      setError(undefined);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdentityCards();
  }, [userId]);

  if (loading) return <LoadingIndicator />;

  if (error) return <ErrorMessage error={error} onRetry={fetchIdentityCards} />;

  return (
    <>
      <CreateIdentityCardDialogButton />
      <DataTable
        data={identityCards}
        onClick={identityCard => navigate(`/identity-cards/${identityCard.id}`)}
        columns={[
          {
            label: 'Card Number',
            fieldName: 'cardNumber',
            width: 150,
          },
          {
            label: 'Issue Date',
            fieldName: 'issueDate',
            type: 'DATETIME',
            width: 150,
          },
          {
            label: 'Expiry Date',
            fieldName: 'expiryDate',
            type: 'DATETIME',
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

export default UserIdentityCards;
