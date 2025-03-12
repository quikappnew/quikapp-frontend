import classNames from 'classnames';
import { FC } from 'react';

import ErrorIcon from 'media/icons/error.svg';
import InfoIcon from 'media/icons/info.svg';
import SuccessIcon from 'media/icons/success.svg';
import WarningIcon from 'media/icons/warning.svg';

import theme from './theme.module.scss';

const Icon = {
  INFO: InfoIcon,
  WARNING: WarningIcon,
  SUCCESS: SuccessIcon,
  ERROR: ErrorIcon,
};

const Alert: FC<{ type?: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR'; message: string }> = ({
  type = 'INFO',
  message,
}) => {
  return (
    <div className={theme.container}>
      <div className={classNames(theme[type.toLowerCase()], theme.row)}>
        <img src={Icon[type]} alt={type} width={18} height={18} />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Alert;
