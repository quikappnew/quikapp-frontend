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


const theme = createTheme({
  palette: {
    primary: {
      main: '#fa9602',
    },
  },
  typography: {
    fontFamily: `'Inter', sans-serif`,
  },
});

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
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
