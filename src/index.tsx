import React from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './routes';
import { FormProvider } from 'context/FormContext';
import { ToastContainer } from 'react-toastify';


const theme = createTheme({
  palette: {
    primary: {
      main: '#fa9602',
    },
  },
  typography: {
    fontFamily: `'Inter', sans-serif`,
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputBase: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiMenuItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          zIndex: 2,
        },
      },
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <ToastContainer />
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormProvider>
      <App />
    </FormProvider>
      </LocalizationProvider>
    </ThemeProvider>
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
