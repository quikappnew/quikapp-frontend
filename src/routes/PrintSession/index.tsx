import { FC, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Button from 'components/Button';
import ConfirmButton from 'components/ConfirmButton';
import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';
import NCDCIdentityCard from 'components/NCDCIdentityCard';
import { getPrintSession, markPrintSessionAsPrinted, markPrintSessionAsCancelled } from 'services/api';
import type { PrintSession } from 'services/api';
import type { ApiError } from 'types/api';

import theme from './theme.module.scss';

interface ConfirmButtonProps {
  children: ReactNode;
  onConfirm: () => Promise<void>;
  loading?: boolean;
  error?: ApiError | undefined;
  title: string;
  description: string;
}

const PrintSessionPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [printSession, setPrintSession] = useState<PrintSession | null>(null);
  const [markPrintLoading, setMarkPrintLoading] = useState(false);
  const [markPrintError, setMarkPrintError] = useState<ApiError | null>(null);
  const [markCancelLoading, setMarkCancelLoading] = useState(false);
  const [markCancelError, setMarkCancelError] = useState<ApiError | null>(null);

  const fetchPrintSession = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPrintSession(id);
      setPrintSession(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPrinted = async () => {
    if (!id) return;
    setMarkPrintLoading(true);
    setMarkPrintError(null);
    try {
      await markPrintSessionAsPrinted(id);
      navigate(`/provinces/${printSession?.province.id}/identity-cards`);
    } catch (err) {
      setMarkPrintError(err as ApiError);
    } finally {
      setMarkPrintLoading(false);
    }
  };

  const handleMarkAsCancelled = async () => {
    if (!id) return;
    setMarkCancelLoading(true);
    setMarkCancelError(null);
    try {
      await markPrintSessionAsCancelled(id);
      navigate(`/provinces/${printSession?.province.id}/identity-cards`);
    } catch (err) {
      setMarkCancelError(err as ApiError);
    } finally {
      setMarkCancelLoading(false);
    }
  };

  useEffect(() => {
    fetchPrintSession();
  }, [id]);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage error={error} onRetry={fetchPrintSession} />;
  if (!printSession) return null;

  const confirmButtonProps = (onConfirm: () => Promise<void>, loading: boolean, error: ApiError | null): ConfirmButtonProps => ({
    onConfirm,
    loading,
    error: error || undefined,
    children: null,
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed with this action?',
  });

  return (
    <div className={theme.container}>
      <div className={theme.actionsContainer}>
        <Button onClick={() => window.print()}>Print</Button>
        <ConfirmButton
          {...confirmButtonProps(handleMarkAsPrinted, markPrintLoading, markPrintError)}
        >
          Mark Cards as Active
        </ConfirmButton>
        <ConfirmButton
          {...confirmButtonProps(handleMarkAsCancelled, markCancelLoading, markCancelError)}
        >
          Cancel Print Session
        </ConfirmButton>
      </div>
      <div className={theme.cardsContainer}>
        {printSession.identityCards.map(card => (
          <NCDCIdentityCard
            key={card.id}
            identityCard={card}
          />
        ))}
      </div>
    </div>
  );
};

export default PrintSessionPage;
