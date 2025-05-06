import dayjs from 'dayjs';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import IdentityLayout from 'layouts/IdentityLayout';

import Button from 'components/Button';
import DetailsPanel from 'components/DetailsPanel';
import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';
import { getIdentityCardPublic } from 'services/api';
import { CategoryEnum } from 'types/api';

import cityLogo from 'media/ncdc-logo.png';

import Documents from './Documents';
import downloadVCF from './contact-generator';
import theme from './theme.module.scss';

const UserPublicInformation: FC = () => {
  const { identityCardId } = useParams<{ identityCardId: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!identityCardId) return;
      setLoading(true);
      setError(null);
      try {
        const result = await getIdentityCardPublic(identityCardId);
        setData({ identityCard: result });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [identityCardId]);

  function renderContent() {
    if (loading) return <LoadingIndicator />;

    if (error || !data) return <ErrorMessage error={error} />;

    const user = data.identityCard.user;

    const getCategoryLabel = (category: CategoryEnum) => {
      switch (category) {
        case CategoryEnum.STUDENT:
          return 'STD';
        case CategoryEnum.TEACHER:
          return 'TCH';
        case CategoryEnum.STAFF:
          return 'STF';
        case CategoryEnum.DRIVER:
          return 'DRV';
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
            </div>
          </div>
          <DetailsPanel
            title="Identity Information"
            data={[
              { label: 'First Name', value: user.firstName },
              { label: 'Last Name', value: user.lastName },
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
              { label: 'Country', value: user?.address?.country },
            ]}
          />
          <Button
            className="mb-3 mt-1"
            variant="contained"
            onClick={() => downloadVCF(user.fullName, user.phoneNumber || '', user.email || '')}
          >
            Add to Contacts
          </Button>
          <Documents />
        </div>
      </>
    );
  }

  return <IdentityLayout>{renderContent()}</IdentityLayout>;
};

export default UserPublicInformation;
