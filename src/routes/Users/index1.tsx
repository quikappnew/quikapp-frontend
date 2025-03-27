import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import DataTable from '../../components/DataTable';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingIndicator from '../../components/LoadingIndicator';
import Navbar from '../../components/Navbar';
import SidebarLayout from '../../layouts/SidebarLayout';
import { getUsers } from '../../services/api';
import { ApiError, User, UserStatusEnum, CategoryEnum, GenderEnum } from '../../types/api';

interface PageInfo {
  cursor: string;
  totalCount: number;
  hasNextPage: boolean;
}

const mockData: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    status: UserStatusEnum.ACTIVE,
    category: CategoryEnum.STAFF,
    nationality: 'INDIAN',
    gender: GenderEnum.MALE,
    dateOfBirth: '1990-01-01',
    province: {
      id: '1',
      name: 'California',
    },
    address: {
      id: '1',
      line1: '123 Main St',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      postalCode: '90001'
    },
    documents: [],
    identityCards: [],
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
    role: 'STAFF'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    status: UserStatusEnum.INACTIVE,
    category: CategoryEnum.STAFF,
    nationality: 'INDIAN',
    gender: GenderEnum.FEMALE,
    dateOfBirth: '1992-01-01',
    province: {
      id: '2',
      name: 'New York',
    },
    address: {
      id: '2',
      line1: '456 Park Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001'
    },
    documents: [],
    identityCards: [],
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
    role: 'STAFF'
  },
];

const AdministrationUsers1: FC = () => {
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
        setUsers(mockData);
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
      <Navbar title="People" subTitle="Dashboard" />
      {renderContent()}
    </SidebarLayout>
  );
};

export default AdministrationUsers1;
