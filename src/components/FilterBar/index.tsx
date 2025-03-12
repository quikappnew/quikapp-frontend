import classNames from 'classnames';

import theme from './theme.module.scss';

export default function FilterBar({
  title,
  filters,
  currentValue,
  onSelect,
}: {
  title: string;
  filters: { label: string; value?: string | boolean }[];
  currentValue: string | boolean | undefined;
  onSelect: (value?: string | boolean) => void;
}) {
  return (
    <div className={theme.filtersContainer}>
      <span>{title}: </span>
      {filters.map(filter => (
        <div
          className={classNames(theme.filter, filter.value === currentValue && theme.active)}
          key={`${title}-${filter.label}`}
          onClick={() => onSelect(filter.value)}
        >
          {filter.label}
        </div>
      ))}
    </div>
  );
}
