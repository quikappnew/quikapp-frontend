import classNames from 'classnames';
import { FC, ReactNode } from 'react';

const Button: FC<{
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  variant?: 'contained' | 'text';
  disabled?: boolean;
}> = ({ className, children, onClick, variant, disabled }) => {
  const containedClasses =
    'rounded bg-blue-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

  const textClasses =
    'rounded px-2 py-1 text-sm font-semibold text-gray-800 hover:shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';

  return (
    <button
      className={classNames(variant === 'contained' ? containedClasses : textClasses, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
