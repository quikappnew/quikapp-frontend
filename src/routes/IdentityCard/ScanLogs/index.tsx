import { useQuery } from '@apollo/client';
import { gql } from '__generated__';
import { IdentityCardAuditType } from '__generated__/graphql';
import { FC } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import DataTable from 'components/DataTable';
import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';

const SCAN_AUDIT_QUERY = gql(`
  query IdentityCardScanLogs($identityCardId: ID!, $limit: Int) {
    identityCard(id: $identityCardId) {
      id
      scanAudits(limit: $limit) {
        nodes {
          id
          scannedBy {
            id
            fullName
          }
          latitude
          longitude
          createdAt
          card {
            id
            cardNumber
          }
        }
        pageInfo {
          cursor
          hasNextPage
          totalCount
        }
      }
    }
  }
`);

const ScanAuditLogPage: FC = () => {
  const { cardId } = useParams<{ cardId: string }>();

  const { loading, error, data, refetch, fetchMore } = useQuery(SCAN_AUDIT_QUERY, {
    variables: {
      identityCardId: cardId as string,
      limit: 30,
    },
    notifyOnNetworkStatusChange: true,
  });

  const renderContent = () => {
    if (loading) return <LoadingIndicator />;

    if (error || !data) return <ErrorMessage error={error} refetch={refetch} />;

    const scanAudit = data.identityCard.scanAudits.nodes;
    const pageInfo = data.identityCard.scanAudits.pageInfo;

    return (
      <DataTable
        data={scanAudit as IdentityCardAuditType[]}
        columns={[
          {
            label: 'Card Number',
            fieldName: 'card.cardNumber',
          },
          {
            label: 'Scanned By',
            fieldName: 'scannedBy.fullName',
          },
          {
            label: 'Latitude',
            fieldName: 'latitude',
          },
          {
            label: 'Longitude',
            fieldName: 'longitude',
          },
          {
            label: 'Scanned At',
            fieldName: 'createdAt',
            type: 'DATETIME',
          },
        ]}
        hasNextPage={pageInfo.hasNextPage as boolean}
        paginationLoading={loading}
        onLoadMore={() =>
          fetchMore({
            variables: {
              cursor: pageInfo.cursor,
            },
          })
        }
      />
    );
  };

  return (
    <>
      {renderContent()}
      <Outlet />
    </>
  );
};

export default ScanAuditLogPage;
