import { useQuery } from '@apollo/client';
import { gql } from '__generated__';
import { AddressType, UserStatusEnumType, UserType } from '__generated__/graphql';
import { FC } from 'react';
import { useParams } from 'react-router-dom';

import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';

import UpdateAddress from './UpdateAddress';
import UpdateUser from './UpdateUser';
import UpdateUserStatus from './UpdateUserStatus';

const USER_QUERY = gql(`
  query UserInformation($userId: ID!) {
    user(id: $userId) {
      id
      firstName
      lastName
      fullName
      email
      phoneNumber
      status
      category
      nationality
      provinceOfOrigin
      gender
      dateOfBirth
      photo
      province {
        id
        name
      }
      address {
        id
        line1
        line2
        city
        state
        postalCode
        country
      }
      createdAt
    }
  }
`);

const UserInformation: FC = () => {
  const { userId } = useParams<{ userId: string }>();

  const { loading, error, data, refetch } = useQuery(USER_QUERY, {
    variables: { userId: userId as string },
  });

  if (loading) return <LoadingIndicator />;

  if (error || !data) return <ErrorMessage error={error} refetch={refetch} />;

  const user = data.user;

  return (
    <>
      <UpdateUser user={user as UserType} />
      <UpdateAddress address={user.address as AddressType} />
      <UpdateUserStatus id={user.id} status={user.status as UserStatusEnumType} />
      {/* <UpdateUserRole id={user.id} role={user.role} /> */}
      {/* <DeleteUserButton id={user.id} /> */}
    </>
  );
};

export default UserInformation;
