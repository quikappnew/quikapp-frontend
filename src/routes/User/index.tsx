import { FC, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import ErrorMessage from '../../components/ErrorMessage';
import HorizontalTabs from '../../components/HorizontalTabs';
import LoadingIndicator from '../../components/LoadingIndicator';
import Navbar from '../../components/Navbar';
import SidebarLayout from '../../layouts/SidebarLayout';
import { getUser } from '../../services/api';
import { ApiError, User } from '../../types/api';

const UserPage: FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
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

    fetchUser();
  }, [userId]);

  function renderContent() {
    if (loading && !user) return <LoadingIndicator />;

    if (error) return <ErrorMessage error={error} onRetry={() => navigate(0)} />;
    if (!user) return <ErrorMessage error={{ message: 'User not found', code: 404, status: 'Not Found' }} />;

    const tabs = [
      {
        key: 'information',
        label: 'Information',
        route: `/users/${userId}`,
        exact: true,
      },
      {
        key: 'identity-cards',
        label: 'Identity Cards',
        route: `/users/${userId}/identity-cards`,
      },
      {
        key: 'documents',
        label: 'Documents',
        route: `/users/${userId}/documents`,
      },
      {
        key: 'activity',
        label: 'Activity',
        route: `/users/${userId}/activity`,
      },
    ];

    return (
      <>
        <Navbar title={user.fullName} subTitle="User" onBackButtonClick={() => navigate(-1)} />
        <HorizontalTabs tabs={tabs} />
        <Outlet />
      </>
    );
  }

  return <SidebarLayout>{renderContent()}</SidebarLayout>;
};

export default UserPage;
