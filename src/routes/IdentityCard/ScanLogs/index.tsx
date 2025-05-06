import { FC } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';
import { getIdentityCardScanLogs } from 'services/api';
import { IdentityCardAudit } from 'types/api';

const IdentityCardScanLogs: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [scanLogs, setScanLogs] = useState<IdentityCardAudit[]>([]);

  const fetchScanLogs = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getIdentityCardScanLogs(id);
      setScanLogs(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScanLogs();
  }, [id]);

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage error={error} onRetry={fetchScanLogs} />;
  if (!scanLogs.length) return <div>No scan logs found.</div>;

  return (
    <div>
      {scanLogs.map(log => (
        <div key={log.id}>
          <p>Scanned at: {log.scannedAt}</p>
          <p>Location: {log.location}</p>
        </div>
      ))}
      <Outlet />
    </div>
  );
};

export default IdentityCardScanLogs;
