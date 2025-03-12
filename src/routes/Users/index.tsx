import { gql, useQuery } from '@apollo/client';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import SidebarLayout from 'layouts/SidebarLayout';

import Button from 'components/Button';
import DataTable from 'components/DataTable';
import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';
import Navbar from 'components/Navbar';

const USERS_QUERY = gql`
  query AdministrationUsers($limit: Int, $cursor: ID, $filters: UserFilterInputType) {
    users(limit: $limit, cursor: $cursor, filters: $filters) {
      nodes {
        id
        fullName
        category
        province {
          id
          name
        }
        status
        createdAt
      }
      pageInfo {
        cursor
        totalCount
        hasNextPage
      }
    }
  }
`;

const AdministrationUsers: FC = () => {
  const navigate = useNavigate();

  const { loading, error, data, refetch, fetchMore } = useQuery(USERS_QUERY, {
    variables: {
      limit: 30,
    },
  });

  function renderContent() {
    if (loading && !data) return <LoadingIndicator />;

    if (error || !data) return <ErrorMessage error={error} refetch={refetch} />;

    const users = data.users.nodes;
    const pageInfo = data.users.pageInfo;

    return (
      <>
        <Button variant="contained" onClick={() => navigate('/create-user')}>
          Add Person
        </Button>
        <DataTable
          data={users}
          onClick={user => navigate(`/users/${user.id}`)}
          columns={[
            {
              label: 'Full Name',
              fieldName: 'fullName',
            },
            {
              label: 'Category',
              fieldName: 'category',
            },
            {
              label: 'Province',
              fieldName: 'province.name',
            },
            {
              label: 'Created At',
              fieldName: 'createdAt',
              type: 'DATETIME',
            },
            {
              label: 'Status',
              fieldName: 'status',
              type: 'STATUS',
            },
          ]}
          hasNextPage={pageInfo.hasNextPage}
          paginationLoading={loading}
          onLoadMore={() =>
            fetchMore({
              variables: {
                cursor: pageInfo.cursor,
              },
            })
          }
          totalCount={pageInfo.totalCount}
        />
      </>
    );
  }

  return (
    <SidebarLayout>
      <Navbar title="People" subTitle="Manage people, identity cards, and more" />
      {renderContent()}
    </SidebarLayout>
  );
};

export default AdministrationUsers;
