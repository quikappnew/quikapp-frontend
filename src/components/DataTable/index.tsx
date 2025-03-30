import { LoadingButton } from '@mui/lab';
import {
  Box,
  Checkbox,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import dayjs from 'dayjs';
import { FC, Fragment, ReactNode, useState } from 'react';

import Button from 'components/Button';
import ErrorMessage from 'components/ErrorMessage';
import LoadingIndicator from 'components/LoadingIndicator';
import { ApiError } from '../../types/api';
import ConfirmButton from '../ConfirmButton';

import binocularsIcon from 'media/icons/binoculars.svg';
import searchOutline from 'media/icons/search-outline.svg';

import countryCodeToReadable from 'utils/country-code-to-readable';
// import fundingSourceToReadable from 'utils/funding-source-to-readable';
import statusEnumToReadable from 'utils/status-enum-to-readable';

import theme from './theme.module.scss';

interface Column {
  label: string;
  fieldName: string;
  type?:
    | 'DATE'
    | 'DATETIME'
    | 'STRING'
    | 'CURRENCY'
    | 'IMAGE'
    | 'NUMBER'
    | 'STATUS'
    | 'BOOLEAN'
    | 'SELECT'
    //  | 'FUNDING_SOURCE'
    | 'COUNTRY'
    | 'FILE';
}

const DataTableHead: FC<{
  columns: Column[];
  isSelected: boolean;
  onSelectAll: (value: any) => void;
}> = ({ columns, isSelected, onSelectAll }) => (
  <TableHead>
    <TableRow>
      {columns.map(c => (
        <TableCell key={c.fieldName + c.label} align={'left'}>
          {c.type === 'SELECT' ? (
            <Checkbox
              size="small"
              sx={{
                height: '24px',
                width: '24px',
              }}
              value={isSelected}
              onChange={e => onSelectAll(e.target.checked)}
            />
          ) : (
            c.label
          )}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const DataTableCell: FC<{
  value: any;
  type?:
    | 'DATE'
    | 'DATETIME'
    | 'STRING'
    | 'CURRENCY'
    | 'IMAGE'
    | 'NUMBER'
    | 'STATUS'
    | 'BOOLEAN'
    | 'SELECT'
    | 'FUNDING_SOURCE'
    | 'COUNTRY'
    | 'FILE';
  onSelect?: (value: any) => void;
}> = ({ value, type, onSelect = () => {} }) => {
  switch (type) {
    case 'SELECT':
      return (
        <TableCell
          align="left"
          width={20}
          sx={{
            cursor: 'pointer',
          }}
          onClick={e => e.stopPropagation()}
        >
          <Checkbox
            size="small"
            sx={{
              height: '24px',
              width: '24px',
            }}
            checked={value}
            onChange={e => onSelect(e.target.checked)}
          />
        </TableCell>
      );
    case 'CURRENCY':
      return (
        <TableCell align="right">
          {value !== undefined && value !== null ? `₹ ${value.toLocaleString('en-IN')}` : '-'}
        </TableCell>
      );
    case 'DATE':
      return <TableCell align="left">{dayjs(value).format('D MMMM YYYY')}</TableCell>;
    case 'DATETIME':
      return <TableCell align="left">{dayjs(value).format('h:mm A, D MMMM YYYY')}</TableCell>;
    case 'IMAGE':
      return (
        <TableCell padding="checkbox">
          <div
            style={{
              backgroundImage: `url("${value}")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              border: '1px solid #eee',
              height: '36px',
              width: '36px',
              margin: '8px',
              borderRadius: '4px',
            }}
          />
        </TableCell>
      );
    case 'NUMBER':
      return <TableCell align="right">{value}</TableCell>;
    case 'BOOLEAN':
      return <TableCell align="left">{value ? 'TRUE' : 'FALSE'}</TableCell>;
    case 'STATUS':
      const { label, color } = statusEnumToReadable(value);
      return (
        <TableCell align="left">
          <div className={theme.statusBadge}>
            <div className={theme.indicator} style={{ backgroundColor: color }} />
            {label}
          </div>
        </TableCell>
      );
    case 'COUNTRY':
      const { label: countryLabel } = countryCodeToReadable(value);
      return <TableCell align="left">{countryLabel}</TableCell>;
    case 'FILE':
      return (
        <TableCell align="left">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 hover:underline"
          >
            View File
          </a>
        </TableCell>
      );
    default:
      return <TableCell align="left">{value}</TableCell>;
  }
};

interface DataTableProps {
  data: any[];
  columns: Column[];
  searchFields?: string[];
  onLoadMore?: () => void;
  paginationLoading?: boolean;
  filterLoading?: boolean;
  hasNextPage?: boolean;
  onClick?: (dataItem: any) => void;
  bulkSelectActions?: {
    label: string;
    icon?: ReactNode;
    action: (selectedItems: any[]) => Promise<any>;
    loading?: boolean;
    error?: ApiError;
  }[];
  onSelect?: (selectedItems: any[]) => void;
  emptyListImage?: string;
  emptyListTitle?: string;
  emptyListDescription?: string;
  totalCount?: number;
}

const DataTable: FC<DataTableProps> = ({
  data,
  columns,
  searchFields,
  onLoadMore,
  paginationLoading = false,
  filterLoading = false,
  hasNextPage = false,
  onClick,
  bulkSelectActions,
  onSelect,
  emptyListImage,
  emptyListTitle,
  emptyListDescription,
  totalCount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  function getValueByFieldName(fieldName, obj) {
    // Example: fieldName "group.name" looks for obj[group][name]
    if (!fieldName) return obj;
    return fieldName.split('.').reduce((acc, curr) => {
      if (!acc) return null;
      return acc[curr];
    }, obj);
  }

  function updateSelectedItems(items: string[]) {
    setSelectedItems(items);
    onSelect && onSelect(items);
  }

  return (
    <Box className={theme.table}>
      {searchFields && searchFields.length ? (
        <TextField
          id="input-with-icon-textfield"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img className={theme.logo} src={searchOutline} height={20} alt="search" />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          sx={{ margin: '8px 0' }}
          placeholder="Search"
          onChange={e => setSearchTerm(e.target.value.toLowerCase())}
        />
      ) : null}
      <TableContainer className={theme.tableContainer}>
        <Table size="small">
          <DataTableHead
            columns={columns}
            isSelected={selectedItems.length > 0}
            onSelectAll={checked => {
              if (!checked) {
                updateSelectedItems([]);
                return;
              }
              updateSelectedItems(
                data.map(item => getValueByFieldName(columns[0].fieldName, item))
              );
            }}
          />
          <TableBody>
            {!filterLoading &&
              data
                .filter(d => {
                  if (searchFields && searchFields.length) {
                    return searchFields.some(sf =>
                      getValueByFieldName(sf, d).toLowerCase().includes(searchTerm)
                    );
                  }
                  return true;
                })
                .map(d => (
                  <TableRow
                    hover={!!onClick}
                    onClick={() => (onClick ? onClick(d) : null)}
                    tabIndex={-1}
                    key={d.id}
                  >
                    {columns.map(c => (
                      <DataTableCell
                        key={c.fieldName + c.label}
                        type={c.type}
                        value={
                          c.type === 'SELECT'
                            ? selectedItems.includes(getValueByFieldName(c.fieldName, d))
                            : getValueByFieldName(c.fieldName, d)
                        }
                        onSelect={checked => {
                          if (checked) {
                            const newSelectedItems = [
                              ...selectedItems,
                              getValueByFieldName(c.fieldName, d),
                            ];
                            updateSelectedItems(newSelectedItems);
                            return;
                          }

                          const newSelectedItems = selectedItems.filter(
                            item => item !== getValueByFieldName(c.fieldName, d)
                          );
                          updateSelectedItems(newSelectedItems);
                        }}
                      />
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {filterLoading ? (
          <div>
            <LoadingIndicator />
          </div>
        ) : null}
        {data.length < 1 && !filterLoading ? (
          <div className={theme.container}>
            <div className={theme.emptyList}>
              <img src={emptyListImage || binocularsIcon} alt="Empty List" />
              <span className={theme.title}>{emptyListTitle || 'No results found'}</span>
              <span className={theme.description}>
                {emptyListDescription || 'Try adjusting your search or filters'}
              </span>
            </div>
          </div>
        ) : null}
      </TableContainer>
      {selectedItems.length && bulkSelectActions ? (
        <div className={theme.bulkActionsContainer}>
          <div className={theme.top}>
            <span className={theme.actionLabel}>{`${selectedItems.length} item${
              selectedItems.length > 1 ? 's' : ''
            } selected`}</span>
            <Button variant="text" onClick={() => updateSelectedItems([])}>
              Close
            </Button>
          </div>
          <div className={theme.bottom}>
            {bulkSelectActions?.map((action, index) => {
              return (
                <Fragment key={`bulk-action-${index}`}>
                  {action.error ? <ErrorMessage error={action.error} /> : null}
                  <LoadingButton
                    id="id"
                    fullWidth
                    loading={action.loading}
                    endIcon={action.icon}
                    variant="contained"
                    onClick={() => action.action(selectedItems).then(() => updateSelectedItems([]))}
                  >
                    {action.label}
                  </LoadingButton>
                </Fragment>
              );
            })}
          </div>
        </div>
      ) : null}

      {onLoadMore && hasNextPage && !filterLoading ? (
        <div className={theme.paginationContainer}>
          {totalCount && (
            <p className={theme.count}>
              Showing {data.length} of {totalCount}
            </p>
          )}
          <LoadingButton loading={paginationLoading} onClick={onLoadMore} variant="outlined">
            Load More
          </LoadingButton>
        </div>
      ) : null}
    </Box>
  );
};

export default DataTable;
