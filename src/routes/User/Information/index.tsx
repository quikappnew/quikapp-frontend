import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ErrorMessage from '../../../components/ErrorMessage';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { getUser } from '../../../services/api';
import { ApiError, User } from '../../../types/api';

import UpdateAddress from './UpdateAddress';
import UpdateUser from './UpdateUser';
import UpdateUserStatus from './UpdateUserStatus';

const UserInformation: FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await getUser(userId);
      setUser(data);
      setError(undefined);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (loading) return <LoadingIndicator />;

  if (error) return <ErrorMessage error={error} onRetry={fetchUser} />;
  if (!user) return <ErrorMessage error={{ message: 'User not found', code: 404, status: 'Not Found' }} />;

  return (
    <>
      <UpdateUser user={user} />
      <UpdateAddress address={user.address} />
      <UpdateUserStatus id={user.id} status={user.status} />
      {/* <UpdateUserRole id={user.id} role={user.role} /> */}
      {/* <DeleteUserButton id={user.id} /> */}
    </>
  );
};

export default UserInformation;
