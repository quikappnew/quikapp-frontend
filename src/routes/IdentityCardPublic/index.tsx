import { useQuery } from '@apollo/client';
import { gql } from '__generated__';
import { CategoryEnumType } from '__generated__/graphql';
import dayjs from 'dayjs';
import { FC } from 'react';
import { useParams } from 'react-router-dom';

import IdentityLayout from 'layouts/IdentityLayout';

import Button from 'components/Button';
import DetailsPanel from 'components/DetailsPanel';
import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';

import cityLogo from 'media/ncdc-logo.png';

import UserDocuments from './Documents';
import downloadVCF from './contact-generator';
import theme from './theme.module.scss';

const IDENTITY_CARD_USER_QUERY = gql(`
  query IdentityCardUser($id: ID!) {
    identityCard(id: $id) {
      id
      user {
        id
        fullName
        firstName
        middleName
        lastName
        email
        phoneNumber
        gender
        dateOfBirth
        category
        photo
        province {
          name
          shortName
          logo
        }
        address {
          line1
          line2
          city
          state
          country
        }
        createdAt
      }
      cardNumber
      issueDate
      expiryDate
    }
  }
`);

const UserPublicInformation: FC = () => {
  const { identityCardId } = useParams<{ identityCardId: string }>() as { identityCardId: string };

  const { loading, error, data, refetch } = useQuery(IDENTITY_CARD_USER_QUERY, {
    variables: {
      id: identityCardId,
    },
  });

  function renderContent() {
    if (loading) return <LoadingIndicator />;

    if (error || !data) return <ErrorMessage error={error} refetch={refetch} />;

    const user = data.identityCard.user;

    const getCategoryLabel = (category: CategoryEnumType) => {
      switch (category) {
        case CategoryEnumType.MemberOfParliament:
          return 'MP';
        case CategoryEnumType.PublicServant:
          return 'PS';
        case CategoryEnumType.NonCitizen:
          return 'NC';
      }
    };

    return (
      <>
        <div className={theme.logoContainer}>
          <img className="h-12" src={cityLogo} alt={`${user.province.shortName} logo`} />
        </div>
        <div className={theme.container}>
          <div className={theme.identityInformation}>
            <img className={theme.photo} src={user.photo as string} alt="" />
            <div>
              <p className={theme.fullName}>{user.fullName}</p>
              {/*{user.province.name.includes('Education') && (
                <p className={theme.division}>{employee?.division.name}</p>
              )} */}
            </div>
          </div>
          <DetailsPanel
            title="Identity Information"
            data={[
              { label: 'First Name', value: user.firstName },
              { label: 'Last Name', value: user.lastName },
              // { label: 'File Number', value: employee?.fileNumber },
              // { label: 'Organisation', value: employee?.organisationCode },
              // { label: 'Designation', value: employee?.designation.name },
              { label: 'Province', value: user.province.name },
              { label: 'Phone Number', value: user.phoneNumber },
              { label: 'Email', value: user.email },
            ]}
          />
          <DetailsPanel
            title="City Permit Card"
            data={[
              { label: 'Category', value: getCategoryLabel(user.category) },
              { label: 'Card Number', value: data.identityCard.cardNumber },
              {
                label: 'Issue Date',
                value: dayjs(data.identityCard.issueDate).format('DD MMMM YYYY'),
              },
              {
                label: 'Expiry Date',
                value: dayjs(data.identityCard.expiryDate).format('DD MMMM YYYY'),
              },
              {
                label: 'Address',
                value: `${user.address?.line1}, ${
                  user?.address?.line2 ? `${user?.address?.line2},` : ''
                } ${user?.address?.city}`,
              },
              { label: 'Province', value: user?.address?.state },
              { label: 'Country', value: user?.address?.country, type: 'COUNTRY' },
            ]}
          />
          <Button
            className="mb-3 mt-1"
            variant="contained"
            onClick={() => downloadVCF(user.fullName, user.phoneNumber || '', user.email || '')}
          >
            Add to Contacts
          </Button>
          <UserDocuments userId={user.id as string} identityCardId={identityCardId} />
        </div>
      </>
    );
  }

  return <IdentityLayout>{renderContent()}</IdentityLayout>;
};

export default UserPublicInformation;
