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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  TablePagination,
} from '@mui/material';
import dayjs from 'dayjs';
import { FC, Fragment, ReactNode, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';

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
  width: number;
}

interface PaginationProps {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

const DataTableHead: FC<{
  columns: Column[];
  isSelected: boolean;
  onSelectAll: (value: any) => void;
  showAccordion?: boolean;
}> = ({ columns, isSelected, onSelectAll, showAccordion = false }) => (
  <TableHead>
    <TableRow sx={{ width: '100%' }}>
      {columns.map(c => (
        <TableCell key={c.fieldName + c.label} align={'left'} style={{ width: c.width }}>
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
      {showAccordion && (
        <TableCell align="left" style={{ width: 150 }}>
          Actions
        </TableCell>
      )}
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
  customRowRender?: (row: any) => ReactNode;
  showAccordion?: boolean;
  pagination?: PaginationProps;
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
  customRowRender,
  showAccordion = false,
  pagination,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

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

  const handleAccordionChange = (rowId: number) => {
    setExpandedRows(prev => 
      prev.includes(rowId) 
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    if (pagination) {
      pagination.onPageChange(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (pagination) {
      pagination.onRowsPerPageChange(parseInt(event.target.value, 10));
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // Reset to the first page when search term changes
    if (pagination) {
      pagination.onPageChange(0);
    }
  };

  const filteredData = data.filter(item => {
    if (!searchFields || searchFields.length === 0 || !searchTerm) {
      return true; // No search fields or search term, return all data
    }
    return searchFields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const paginatedData = pagination
    ? filteredData.slice(
        pagination.page * pagination.rowsPerPage,
        pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
      )
    : filteredData;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3 }}>
      {searchFields && searchFields.length > 0 && (
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
      <TableContainer sx={{ width: '100%' }}>
        <Table stickyHeader sx={{ width: '100%' }}>
          <DataTableHead
            columns={columns}
            isSelected={selectedItems.length === data.length}
            onSelectAll={value => {
              if (value) {
                updateSelectedItems(data.map(item => item.id));
              } else {
                updateSelectedItems([]);
              }
            }}
            showAccordion={showAccordion}
          />
          <TableBody>
            {paginatedData.map((row, index) => (
              <Fragment key={row.id}>
                {customRowRender ? (
                  customRowRender(row)
                ) : (
                  <>
                    <TableRow
                      hover
                      onClick={() => onClick && onClick(row)}
                      sx={{ cursor: onClick ? 'pointer' : 'default' }}
                    >
                      {columns.map(column => (
                        <DataTableCell
                          key={column.fieldName}
                          value={getValueByFieldName(column.fieldName, row)}
                          type={column.type}
                          onSelect={value => {
                            if (value) {
                              updateSelectedItems([...selectedItems, row.id]);
                            } else {
                              updateSelectedItems(selectedItems.filter(id => id !== row.id));
                            }
                          }}
                        />
                      ))}
                    </TableRow>
                    {showAccordion && (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} sx={{ py: 0 }}>
                          <Accordion
                            expanded={expandedRows.includes(row.id)}
                            onChange={() => handleAccordionChange(row.id)}
                            sx={{ boxShadow: 'none' }}
                          >
                            <AccordionDetails>
                              <Box sx={{ p: 2 }}>
                                <h4>Additional Details</h4>
                                <p>Client ID: {row.id}</p>
                                <p>Created Date: {new Date().toLocaleDateString()}</p>
                                {/* Add more details as needed */}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </Fragment>
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

      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default DataTable;
