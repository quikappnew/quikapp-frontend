import { useQuery } from '@apollo/client';
import { gql } from '__generated__';
import { FC } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import SidebarLayout from 'layouts/SidebarLayout';

import ErrorMessage from 'components/ErrorMessage';
import HorizontalTabs from 'components/HorizontalTabs';
import LoadingIndicator from 'components/LoadingIndicator';
import Navbar from 'components/Navbar';

const IDENTITY_CARD_QUERY = gql(`
  query IdentityCard($identityCardId: ID!) {
    identityCard(id: $identityCardId) {
      id
      cardNumber
    }
  }
`);

const IdentityCardPage: FC = () => {
  const navigate = useNavigate();
  const { identityCardId } = useParams<{ identityCardId: string }>();

  const { loading, error, data, refetch } = useQuery(IDENTITY_CARD_QUERY, {
    variables: {
      identityCardId: identityCardId as string,
    },
  });

  const renderContent = () => {
    if (loading) return <LoadingIndicator />;

    if (error || !data) return <ErrorMessage error={error} refetch={refetch} />;

    const identityCard = data.identityCard;

    const tabs = [
      {
        key: 'identity card',
        label: 'Identity Card Information',
        route: `/identity-cards/${identityCardId}`,
        exact: true,
      },
      // {
      //   key: 'identityCardScanLogs',
      //   label: 'Identity Card Scan Logs',
      //   route: `/identity-cards/${identityCardId}/scan-logs`,
      // },
    ];

    return (
      <>
        <Navbar
          title={`${identityCard.cardNumber}`}
          subTitle="Identity Card"
          onBackButtonClick={() => navigate(-1)}
        />

        <HorizontalTabs tabs={tabs} />
      </>
    );
  };

  return (
    <SidebarLayout>
      {renderContent()}
      <Outlet />
    </SidebarLayout>
  );
};

export default IdentityCardPage;
