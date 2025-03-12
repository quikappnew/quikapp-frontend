import { useQuery } from '@apollo/client';
import { gql } from '__generated__';
import { FC } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import SidebarLayout from 'layouts/SidebarLayout';

import ErrorMessage from 'components/ErrorMessage';
import HorizontalTabs from 'components/HorizontalTabs';
import LoadingIndicator from 'components/LoadingIndicator';
import Navbar from 'components/Navbar';

const USER_QUERY = gql(`
  query getUser($userId: ID!) {
    user(id: $userId) {
      id
      fullName
    }
  }
`);

const UserPage: FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const { loading, error, data, refetch } = useQuery(USER_QUERY, {
    variables: {
      userId: userId as string,
    },
  });

  function renderContent() {
    if (loading && !data) return <LoadingIndicator />;

    if (error || !data) return <ErrorMessage error={error} refetch={refetch} />;

    const user = data.user;

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
