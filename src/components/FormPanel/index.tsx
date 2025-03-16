import EditIcon from '@mui/icons-material/Edit';
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import React, {
  Children,
  Dispatch,
  FC,
  ReactElement,
  ReactNode,
  isValidElement,
  useContext,
  useReducer,
  useState,
} from 'react';

import Button from 'components/Button';

import statusEnumToReadable from 'utils/status-enum-to-readable';

import validate, { Validators } from '../../utils/text-validators';
import ErrorMessage from '../ErrorMessage';
import LoadingButton from '../LoadingButton';
import UploadInput from '../UploadInput';
import FormPanelContext from './formPanelContext';
import reducer, {
  ActionType,
  ResetFormActionType,
  UpdateErrorsActionType,
  UpdateStateActionType,
} from './formPanelReducer';
import { getFormInputElements, getReactElementClones } from './process-form-panel-children';
import theme from './theme.module.scss';

type FormInputProps = {
  fieldName: string;
  defaultValue: any;
  label: string;
  helperText?: string;
  editable?: boolean;
  readOnlyMode?: boolean;
  options?: {
    label: string;
    value: string;
  }[];
  statusOptions?: string[];
  validators?: Validators;
  fullWidth?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  placeholder?: string;
  conditionsToShow?: {
    matches: {
      field: string;
      condition: '===' | '!==' | '>' | '<' | '>=' | '<=';
      value: string;
    }[];
    type?: 'every' | 'some';
  };
  dangerouslySetInnerHTML?: { __html: string };
  customInput?: React.ElementType;
} & (
  | {
      type:
        | 'string'
        | 'number'
        | 'password'
        | 'status_select'
        | 'select'
        | 'select_with_search'
        | 'textarea'
        | 'currency'
        | 'upload'
        | 'date'
        | 'switch'
        | 'image_url'
        | 'date-range'
        | 'radio-group'
        | 'checkbox'
        | 'custom';
      defaultValue: any;
    }
  | {
      type: 'multi_select';
      defaultValue: any[];
    }
);

const FormInput: FC<FormInputProps> = ({
  fieldName,
  type,
  defaultValue,
  label,
  helperText,
  editable = true,
  readOnlyMode = false,
  options,
  statusOptions,
  fullWidth = false,
  validators,
  minDate,
  maxDate,
  placeholder,
  conditionsToShow,
  dangerouslySetInnerHTML,
  customInput,
}) => {
  const { formState, formDispatch } = useContext(FormPanelContext);
  const updateStateDispatch: Dispatch<ActionType & UpdateStateActionType> = formDispatch;

  function hideFormInput() {
    if (!conditionsToShow) return false;
    if (!conditionsToShow.matches.length) return false;

    if (conditionsToShow.type === 'some')
      return !conditionsToShow.matches.some(c => {
        // eslint-disable-next-line
        return eval(`"${formState.data[c.field]}" ${c.condition} "${c.value}"`);
      });
    else
      return !conditionsToShow.matches.every(c => {
        // eslint-disable-next-line
        return eval(`"${formState.data[c.field]}" ${c.condition} "${c.value}"`);
      });
  }

  if (validators) {
    if (validators.required) {
      validators.required = !hideFormInput();
    }
    if (validators.isPhoneNumber) {
      validators.isPhoneNumber = !hideFormInput();
    }
  }

  const handleChange = value =>
    updateStateDispatch({
      type: 'UPDATE_STATE',
      payload: {
        fieldName,
        value,
      },
    });

  if (hideFormInput()) {
    return null;
  }

  const inputField = () => {
    switch (type) {
      case 'string':
        return (
          <TextField
            size="small"
            placeholder={placeholder}
            fullWidth={fullWidth}
            value={formState.data[fieldName]}
            error={!!(formState.errors && formState.errors[fieldName])}
            onChange={e => handleChange(e.target.value)}
            helperText={formState.errors ? formState.errors[fieldName] : ''}
          />
        );
      case 'number':
        return (
          <TextField
            type="number"
            fullWidth={fullWidth}
            placeholder={placeholder}
            size="small"
            value={formState.data[fieldName]}
            error={!!(formState.errors && formState.errors[fieldName])}
            onChange={e => handleChange(e.target.value ? parseFloat(e.target.value) : '')}
            helperText={formState.errors ? formState.errors[fieldName] : ''}
          />
        );
      case 'password':
        return (
          <TextField
            size="small"
            type="password"
            placeholder={placeholder}
            fullWidth={fullWidth}
            value={formState.data[fieldName]}
            error={!!(formState.errors && formState.errors[fieldName])}
            onChange={e => handleChange(e.target.value)}
            helperText={formState.errors ? formState.errors[fieldName] : ''}
          />
        );
      case 'currency':
        return (
          <TextField
            type="number"
            fullWidth={fullWidth}
            placeholder={placeholder}
            size="small"
            value={formState.data[fieldName]}
            error={!!(formState.errors && formState.errors[fieldName])}
            onChange={e => handleChange(e.target.value ? parseFloat(e.target.value) : '')}
            helperText={formState.errors ? formState.errors[fieldName] : ''}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        );
      case 'select':
        return (
          <>
            <Select
              size="small"
              fullWidth={fullWidth}
              placeholder={placeholder}
              value={formState.data[fieldName]}
              error={!!(formState.errors && formState.errors[fieldName])}
              onChange={e => handleChange(e.target.value)}
            >
              {options &&
                options.map(o => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
            </Select>
            <p className={theme.helperTextError}>
              {formState.errors && formState.errors[fieldName]}
            </p>
          </>
        );
      case 'multi_select':
        return (
          <>
            <Select
              size="small"
              fullWidth={fullWidth}
              placeholder={placeholder}
              multiple
              value={formState.data[fieldName]}
              error={!!(formState.errors && formState.errors[fieldName])}
              onChange={e => handleChange(e.target.value)}
            >
              {options &&
                options.map(o => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
            </Select>
            <p className={theme.helperTextError}>
              {formState.errors && formState.errors[fieldName]}
            </p>
          </>
        );
      case 'status_select':
        return (
          <>
            <Select
              size="small"
              fullWidth={fullWidth}
              placeholder={placeholder}
              value={formState.data[fieldName]}
              error={!!(formState.errors && formState.errors[fieldName])}
              onChange={e => handleChange(e.target.value)}
            >
              {statusOptions &&
                statusOptions.map(o => {
                  const { label, color } = statusEnumToReadable(o);

                  return (
                    <MenuItem key={o} value={o}>
                      <div className={theme.statusBadge}>
                        <div className={theme.indicator} style={{ backgroundColor: color }} />
                        {label}
                      </div>
                    </MenuItem>
                  );
                })}
            </Select>
            <p className={theme.helperTextError}>
              {formState.errors && formState.errors[fieldName]}
            </p>
          </>
        );
      case 'select_with_search':
        return (
          <>
            <Autocomplete<{ label: string; value: string }>
              fullWidth
              disablePortal
              size="small"
              options={options || []}
              getOptionLabel={option => option.label}
              onChange={(_, newValue) => handleChange(newValue?.value || '')}
              renderInput={params => (
                <TextField {...params} placeholder={placeholder} size="small" />
              )}
            />
            <p className={theme.helperTextError}>
              {formState.errors && formState.errors[fieldName]}
            </p>
          </>
        );
      case 'switch':
        return (
          <Switch
            checked={formState.data[fieldName]}
            onChange={e => handleChange(e.target.checked)}
          />
        );
      case 'textarea':
        return (
          <TextField
            multiline
            minRows={3}
            fullWidth={fullWidth}
            placeholder={placeholder}
            value={formState.data[fieldName]}
            onChange={e => handleChange(e.target.value)}
            className={theme.textarea}
            error={!!(formState.errors && formState.errors[fieldName])}
            helperText={formState.errors ? formState.errors[fieldName] : ''}
          />
        );
      case 'upload':
        return (
          <UploadInput
            value={formState.data[fieldName]}
            onChange={([file]) => handleChange(file)}
            helperText={formState.errors ? formState.errors[fieldName] : ''}
          />
        );
      case 'image_url':
        return (
          <TextField
            size="small"
            fullWidth={fullWidth}
            value={formState.data[fieldName]}
            error={!!(formState.errors && formState.errors[fieldName])}
            onChange={e => handleChange(e.target.value)}
            helperText={formState.errors ? formState.errors[fieldName] : ''}
          />
        );
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={formState.data[fieldName]}
              onChange={newValue => handleChange(newValue)}
              minDate={minDate}
              maxDate={maxDate}
              slotProps={{
                textField: {
                  fullWidth: fullWidth,
                  size: "small"
                }
              }}
              format="DD/MM/YYYY"
            />
            <p className={theme.helperTextError}>
              {formState.errors && formState.errors[fieldName]}
            </p>
          </LocalizationProvider>
        );
      case 'date-range':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              value={formState.data[fieldName]}
              onChange={newValue => handleChange(newValue)}
              slotProps={{
                textField: {
                  fullWidth: fullWidth,
                  size: "small"
                },
                popper: {
                  placement: 'bottom-start'
                }
              }}
              minDate={minDate}
              maxDate={maxDate}
              format="DD/MM/YYYY"
            />
            <p className={theme.helperTextError}>
              {formState.errors && formState.errors[fieldName]}
            </p>
          </LocalizationProvider>
        );
      case 'radio-group':
        return (
          <RadioGroup
            value={formState.data[fieldName]}
            onChange={event => handleChange((event.target as HTMLInputElement).value)}
          >
            {options &&
              options.map(o => (
                <FormControlLabel
                  key={o.label}
                  value={o.value}
                  control={<Radio />}
                  label={o.label}
                />
              ))}
          </RadioGroup>
        );
      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(formState.data[fieldName])}
                onChange={event => handleChange((event.target as HTMLInputElement).checked)}
              />
            }
            label={label}
          />
        );
      case 'custom':
        const CustomInput = customInput ? customInput : () => <></>;
        return (
          <>
            <CustomInput
              value={formState.data[fieldName]}
              onChange={newValue => handleChange(newValue)}
            />
            <p className={theme.helperTextError}>
              {formState.errors && formState.errors[fieldName]}
            </p>
          </>
        );
      default:
        return (
          <TextField
            size="small"
            fullWidth={fullWidth}
            value={formState.data[fieldName]}
            error={!!(formState.errors && formState.errors[fieldName])}
            onChange={e => handleChange(e.target.value)}
            helperText={formState.errors ? formState.errors[fieldName] : ''}
          />
        );
    }
  };

  const staticText = () => {
    if (type === 'string' || type === 'textarea') {
      return formState.data[fieldName] ? formState.data[fieldName] : '-';
    }

    if (type === 'currency') {
      if (formState.data[fieldName] === undefined || formState.data[fieldName] === null) {
        return '-';
      }
      return `₹ ${formState.data[fieldName].toLocaleString('en-IN')}`;
    }

    if (type === 'switch') {
      return <Switch checked={formState.data[fieldName]} disabled />;
    }

    if (type === 'checkbox') {
      return (
        <FormControlLabel
          control={<Checkbox checked={Boolean(formState.data[fieldName])} disabled />}
          label={label}
        />
      );
    }

    if (type === 'radio-group') {
      return (
        <RadioGroup value={formState.data[fieldName]}>
          {options &&
            options.map(o => (
              <FormControlLabel
                key={o.label}
                value={o.value}
                control={<Radio disabled />}
                label={o.label}
              />
            ))}
        </RadioGroup>
      );
    }

    if (type === 'select') {
      const option = options?.find(o => o.value === formState.data[fieldName]);
      return <span>{option ? option.label : '-'}</span>;
    }

    if (type === 'status_select') {
      const { label, color } = statusEnumToReadable(formState.data[fieldName]);

      return (
        <div className={theme.statusBadge}>
          <div className={theme.indicator} style={{ backgroundColor: color }} />
          {label}
        </div>
      );
    }

    if (type === 'image_url') {
      return formState.data[fieldName] ? (
        <img src={formState.data[fieldName]} alt={formState.data[fieldName]} height={50} />
      ) : (
        '-'
      );
    }

    if (type === 'upload') {
      if (!formState.data[fieldName]) return <span>-</span>;

      if (typeof formState.data[fieldName] == 'string') {
        return <img src={formState.data[fieldName]} alt={formState.data[fieldName]} height={50} />;
      }

      return (
        <Button
          onClick={() =>
            formState.data[fieldName].url
              ? window.open(formState.data[fieldName].url, '_blank')
              : window.open(URL.createObjectURL(formState.data[fieldName]), '_blank')
          }
        >
          {formState.data[fieldName].name}
        </Button>
      );
    }

    if (type === 'date') {
      return (
        <div className={theme.value}>
          {formState.data[fieldName] ? dayjs(formState.data[fieldName]).format('DD/MM/YYYY') : '-'}
        </div>
      );
    }

    if (type === 'date-range') {
      const startDate = formState.data.date[0].format('DD/MM/YYYY');
      const endDate = formState.data.date[1].format('DD/MM/YYYY');
      return <div className={theme.value}>{`${startDate} ${endDate}`}</div>;
    }

    if (type === 'custom') {
      const CustomInput = customInput ? customInput : () => <></>;
      return (
        <CustomInput
          onChange={newValue => handleChange(newValue)}
          value={formState.data[fieldName]}
          readMode={readOnlyMode || !editable}
        />
      );
    }

    if (dangerouslySetInnerHTML) {
      return <div dangerouslySetInnerHTML={{ __html: formState.data[fieldName] }} />;
    }

    return (
      <span style={{ overflowWrap: 'anywhere', marginTop: 0 }}>
        {formState.data[fieldName] !== (undefined || null) ? formState.data[fieldName] : '-'}
      </span>
    );
  };

  if (validators?.dependsOn && !formState.data[validators.dependsOn]) {
    return null;
  }

  return (
    <div className={theme.dataContainer}>
      {type !== 'checkbox' ? <p className={theme.label}>{label}</p> : null}
      {helperText ? <p className={theme.helperText}>{helperText}</p> : null}
      <div className={theme.value}>{readOnlyMode || !editable ? staticText() : inputField()}</div>
    </div>
  );
};

function getInitialDataAndValidatorsFromChildren(children: ReactNode) {
  let initialData = {};
  let validators = {};
  Children.forEach(children, element => {
    if (!isValidElement(element)) return;

    initialData = { ...initialData, [element.props.fieldName]: element.props.defaultValue };
    validators = { ...validators, [element.props.fieldName]: element.props.validators };
  });

  return [initialData, validators];
}

const FormPanel: FC<{
  children: ReactElement | ReactElement[];
  onSubmit: (data: any) => void;
  loading: boolean;
  error: any;
  onCancel?: () => void;
  cancelButtonLabel?: string;
  onReset?: () => void;
  submitButtonLabel?: string;
  needConfirmation?: boolean;
  disableSubmit?: boolean;
  buttonRef?: any;
}> = ({ disableSubmit = false, ...props }) => {
  const formInputElements = getFormInputElements(props.children);

  const [initialData, validators] = getInitialDataAndValidatorsFromChildren(formInputElements);
  const [formState, formDispatch] = useReducer(reducer, { data: initialData });
  const [showConfirmation, toggleConfirmation] = useState(false);

  const formContext = { formState, formDispatch };

  const updateErrorsDispatch: Dispatch<ActionType & UpdateErrorsActionType> = formDispatch;
  const resetFormDispatch: Dispatch<ActionType & ResetFormActionType> = formDispatch;

  const reactElementClones = getReactElementClones(props.children);

  function validateForm() {
    let errors = {};
    Object.keys(formState.data).forEach(f => {
      if (validators[f]) {
        const error = validate(validators[f], formState, formState.data[f]);
        if (error) {
          errors = { ...errors, [f]: error };
        }
      }
    });

    formInputElements.forEach(c => {
      if (
        // @ts-ignore
        c.props.type === 'date-range' &&
        // @ts-ignore
        formState.data[c.props.fieldName][0] > formState.data[c.props.fieldName][1]
      ) {
        // @ts-ignore
        errors = { ...errors, [c.props.fieldName]: "'From Date' must be before 'To Date'" };
      }
    });

    updateErrorsDispatch({
      type: 'UPDATE_ERRORS',
      payload: { errors },
    });

    return errors;
  }

  function handleSubmit() {
    const errors = validateForm();
    if (Object.keys(errors).length < 1) {
      props.needConfirmation ? toggleConfirmation(true) : props.onSubmit(formState.data);
    }
  }

  function handleCancel() {
    if (props.onCancel) props.onCancel();
  }

  function handleReset() {
    resetFormDispatch({
      type: 'RESET_FORM',
      payload: { initialData },
    });
    if (props.onReset) props.onReset();
  }

  if (props.buttonRef) {
    props.buttonRef.current = {
      submit: handleSubmit,
      cancel: handleCancel,
      reset: handleReset,
    };
  }

  return (
    <FormPanelContext.Provider value={formContext}>
      <div className={theme.formPanel}>
        {reactElementClones}
        {props.error ? <ErrorMessage type="alert" error={props.error} /> : null}

        {showConfirmation ? (
          <div className={theme.confirmationContainer}>
            <p>Are you sure you want to update?</p>
            <div className={theme.buttonWrapper}>
              <Button onClick={() => toggleConfirmation(false)} variant="text">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  props.onSubmit(formState.data);
                  toggleConfirmation(false);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        ) : null}
        {!props.needConfirmation && !props.buttonRef ? (
          <div className={theme.buttonContainer}>
            <LoadingButton
              className={theme.submitButton}
              disabled={disableSubmit}
              loading={props.loading}
              onClick={handleSubmit}
            >
              {/* @ts-ignore */}
              {props.submitButtonLabel ? props.submitButtonLabel : 'Submit'}
            </LoadingButton>

            {props.onCancel ? (
              <Button onClick={handleCancel} className={theme.cancelButton}>
                {props.cancelButtonLabel ? props.cancelButtonLabel : 'Cancel'}
              </Button>
            ) : null}
            {props.onReset ? <Button onClick={handleReset}>Reset</Button> : null}
          </div>
        ) : null}
      </div>
    </FormPanelContext.Provider>
  );
};

const FormPanelWithReadMode: FC<{
  children: ReactElement | ReactElement[];
  onSubmit: (data: any) => void;
  loading: boolean;
  error: any;
  cancelButtonLabel?: string;
  submitButtonLabel?: string;
  disableEdit?: boolean;
  title?: string;
  buttonRef?: any;
}> = props => {
  const formInputElements = getFormInputElements(props.children);
  const [initialData, validators] = getInitialDataAndValidatorsFromChildren(formInputElements);

  const [readOnlyMode, toggleReadOnlyMode] = useState(true);
  const [formState, formDispatch] = useReducer(reducer, { data: initialData });

  const formContext = { formState, formDispatch };
  const readOrEditModeTheme = readOnlyMode ? theme.withReadMode : theme.withEditMode;

  const updateErrorsDispatch: Dispatch<ActionType & UpdateErrorsActionType> = formDispatch;
  const resetFormDispatch: Dispatch<ActionType & ResetFormActionType> = formDispatch;

  const reactElementClones = getReactElementClones(props.children, readOnlyMode);

  function validateForm() {
    let errors = {};
    Object.keys(formState.data).forEach(f => {
      if (validators[f]) {
        const error = validate(validators[f], formState, formState.data[f]);
        if (error) {
          errors = { ...errors, [f]: error };
        }
      }
    });

    formInputElements.forEach(c => {
      if (
        // @ts-ignore
        c.props.type === 'date-range' &&
        // @ts-ignore
        formState.data[c.props.fieldName][0] > formState.data[c.props.fieldName][1]
      ) {
        // @ts-ignore
        errors = { ...errors, [c.props.fieldName]: "'From Date' must be before 'To Date'" };
      }
    });

    updateErrorsDispatch({
      type: 'UPDATE_ERRORS',
      payload: { errors },
    });

    return errors;
  }

  function handleSubmit() {
    const errors = validateForm();
    if (Object.keys(errors).length < 1) {
      props.onSubmit(formState.data);
      toggleReadOnlyMode(true);
    }
  }

  function handleCancel() {
    resetFormDispatch({
      type: 'RESET_FORM',
      payload: { initialData },
    });
    toggleReadOnlyMode(true);
  }

  if (props.buttonRef) {
    props.buttonRef.current = {
      submit: handleSubmit,
      cancel: handleCancel,
    };
  }

  function formActions() {
    if (props.disableEdit) {
      return null;
    }

    if (readOnlyMode) {
      return (
        <IconButton
          className={theme.editButton}
          size="small"
          onClick={() => toggleReadOnlyMode(false)}
        >
          <EditIcon sx={{ fontSize: 22 }} />
        </IconButton>
      );
    }

    return (
      <div className={theme.buttonContainer}>
        <LoadingButton
          loading={props.loading}
          className={theme.submitButton}
          onClick={handleSubmit}
        >
          {/* @ts-ignore */}
          {props.submitButtonLabel ? props.submitButtonLabel : 'Submit'}
        </LoadingButton>
        <Button variant="text" onClick={handleCancel}>
          {props.cancelButtonLabel ? props.cancelButtonLabel : 'Cancel'}
        </Button>
      </div>
    );
  }

  return (
    <FormPanelContext.Provider value={formContext}>
      <div className={classNames(theme.formPanel, readOrEditModeTheme)}>
        <div className={theme.inner}>
          {props.title && <div className={theme.titleContainer}>{props.title}</div>}
          {reactElementClones}
          {props.error ? <ErrorMessage type="alert" error={props.error} /> : null}
          {formActions()}
        </div>
      </div>
    </FormPanelContext.Provider>
  );
};

export { FormPanel, FormPanelWithReadMode, FormInput };
