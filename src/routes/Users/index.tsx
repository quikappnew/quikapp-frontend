import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import DataTable from '../../components/DataTable';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingIndicator from '../../components/LoadingIndicator';
import Navbar from '../../components/Navbar';
import SidebarLayout from '../../layouts/SidebarLayout';
import { getUsers } from '../../services/api';
import { ApiError, User } from '../../types/api';

interface PageInfo {
  cursor: string;
  totalCount: number;
  hasNextPage: boolean;
}

const AdministrationUsers: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    cursor: '',
    totalCount: 0,
    hasNextPage: false,
  });

  const fetchUsers = async (cursor?: string) => {
    try {
      setLoading(true);
      const response = await getUsers({ limit: 30, cursor });
      if (cursor) {
        setUsers(prevUsers => [...prevUsers, ...response.data]);
      } else {
        setUsers(response.data);
      }
      setPageInfo({
        cursor: response.cursor,
        totalCount: response.total,
        hasNextPage: response.hasNextPage,
      });
      setError(undefined);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  function renderContent() {
    if (loading && !users.length) return <LoadingIndicator />;

    if (error) return <ErrorMessage error={error} onRetry={() => fetchUsers()} />;

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
          onLoadMore={() => fetchUsers(pageInfo.cursor)}
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
