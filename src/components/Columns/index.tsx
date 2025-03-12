import classNames from 'classnames';
import { FC } from 'react';

import theme from './theme.module.scss';

const Columns: FC<{ number: number; children: any[] | any; bordered?: boolean }> = ({
  number,
  children,
  bordered,
}) => {
  const percentageWidth = 100 / number;

  return (
    <div className={classNames(theme.container, bordered ? theme.bordered : null)}>
      {children.length > 0 ? (
        children.map((child, index) => (
          <div
            key={index}
            className={theme.column}
            style={{ flex: `0 0 calc(${percentageWidth}% - 0.5rem)` }}
          >
            {child}
          </div>
        ))
      ) : (
        <div
          className={theme.column}
          style={{ flex: `0 0 calc(${percentageWidth}% - 0.5rem)` }}
          key="single-column"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Columns;
