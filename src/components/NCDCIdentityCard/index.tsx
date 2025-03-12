import { CategoryEnumType } from '__generated__/graphql';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { FC } from 'react';
import QRCode from 'react-qr-code';

import countryCodeToReadable from 'utils/country-code-to-readable';

import cardBack from './Back.png';
import cardFront from './Front.png';
import cardHiddenBack from './Hidden-Back.png';
import cardHiddenFront from './Hidden-Front.png';
import theme from './theme.module.scss';

type IdentityCard = {
  id: string;
  cardNumber: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    category: CategoryEnumType;
    address?: {
      line1: string;
      city: string;
    } | null;
    nationality: string;
    provinceOfOrigin?: string | null;
    photo?: string | null;
  };
  codeLink: string;
  issueDate: string;
  expiryDate: string;
};

const NCDCIdentityCard: FC<{
  identityCard: IdentityCard;
  visibileOnly?: boolean;
}> = ({ identityCard, visibileOnly = false }) => {
  const { label: countryLabel } = countryCodeToReadable(identityCard.user.nationality);

  const cardImage = {
    front: cardFront,
    hiddenFront: cardHiddenFront,
    back: cardBack,
    hiddenBack: cardHiddenBack,
  };

  function getCategoryLabel(category: CategoryEnumType) {
    switch (category) {
      case CategoryEnumType.MemberOfParliament:
        return 'MP';
      case CategoryEnumType.PublicServant:
        return 'PS';
      case CategoryEnumType.NonCitizen:
        return 'NC';
    }
  }

  return (
    <div className={theme.container}>
      <div className={theme.page}>
        <img className={theme.background} src={cardImage.front} alt="Card Front" />
        <span className={theme.heading}>CITY PERMIT CARD</span>
        <span className={theme.subHeading}>NATIONAL CAPITAL DISTRICT</span>
        <img className={theme.photo} src={identityCard.user.photo || ''} alt="Employee" />
        <div className={theme.information}>
          <div className={theme.row}>
            <p className={theme.label}>First Name:</p>
            <p className={theme.value}>{identityCard.user.firstName}</p>
          </div>
          <div className={theme.row}>
            <p className={theme.label}>Last Name:</p>
            <p className={theme.value}>{identityCard.user.lastName}</p>
          </div>
          <div className="flex gap-48">
            <div className={theme.row}>
              <p className={theme.label}>Gender:</p>
              <p className={theme.value}>{identityCard.user.gender}</p>
            </div>
            <div className={theme.row}>
              <p className={theme.label}>Category:</p>
              <p className={theme.value}>{getCategoryLabel(identityCard.user.category)}</p>
            </div>
          </div>
          <div className={theme.row}>
            <p className={theme.label}>Date of Birth:</p>
            <p className={theme.value}>
              {dayjs(identityCard.user.dateOfBirth).format('DD MMMM YYYY')}
            </p>
          </div>
          <div className={theme.row}>
            <p className={theme.label}>Address:</p>
            <p className={theme.value}>{identityCard.user.address?.line1 || ''}</p>
          </div>
          <div className={theme.row}>
            <p className={theme.label}>City:</p>
            <p className={theme.value}>{identityCard.user.address?.city || ''}</p>
          </div>
        </div>
        <span className={theme.cardNumberFront}>{identityCard.cardNumber}</span>
      </div>
      <div className={theme.page} style={{ display: visibileOnly ? 'none' : 'block' }}>
        <img className={theme.background} src={cardImage.hiddenFront} alt="Card Hidden Front" />
      </div>
      <div className={classNames(theme.page, theme.back)}>
        <img className={theme.background} src={cardImage.back} alt="Card Back" />
        <img className={theme.photo} src={identityCard.user.photo || ''} alt="Employee" />
        <div className={theme.qrCodeContainer}>
          <QRCode value={identityCard.codeLink} size={525} />
        </div>
        <div className={classNames(theme.information, 'mb-12')}>
          <div className={theme.columns}>
            <div className={theme.row}>
              <p className={theme.label}>Issue Date:</p>
              <p className={theme.value}>{dayjs(identityCard.issueDate).format('DD MMMM YYYY')}</p>
            </div>
            <div className={theme.row}>
              <p className={theme.label}>Expiry Date:</p>
              <p className={theme.value}>{dayjs(identityCard.expiryDate).format('DD MMMM YYYY')}</p>
            </div>
          </div>
          <div className={theme.row}>
            <p className={theme.label}>Card No:</p>
            <p className={theme.value}>{identityCard.cardNumber}</p>
          </div>
          <div className={theme.row}>
            <p className={theme.label}>Nationality:</p>
            <p className={theme.value}>{countryLabel}</p>
          </div>
          {identityCard.user.provinceOfOrigin && (
            <div className={theme.row}>
              <p className={theme.label}>Province Of Origin:</p>
              <p className={theme.value}>{identityCard.user.provinceOfOrigin}</p>
            </div>
          )}
        </div>
        <div className={theme.signatureBack}>
          {/* <img src={chairmanSignature} alt="Secretary Signature" className={theme.signatureImage} /> */}
          <p className={theme.signature}>F Ravu</p>
          <p className={theme.label}>City Manager</p>
        </div>
      </div>
      <div
        className={classNames(theme.page, theme.hidden)}
        style={{ display: visibileOnly ? 'none' : 'block' }}
      >
        <img className={theme.background} src={cardImage.hiddenBack} alt="Card Hidden Back" />
        <img className={theme.photo} src={identityCard.user.photo || ''} alt="Employee" />
      </div>
    </div>
  );
};

export default NCDCIdentityCard;
