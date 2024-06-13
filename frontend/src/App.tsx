import React from 'react';
import logo from './logo.svg';
import './App.css';

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import ThemeProvider from "src/ThemeProvider";
import Container from '@mui/material/Container';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AuthContextProvider } from './AuthContext';
import Router from "src/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContextProvider } from 'src/ToastContext';
import Toasts from 'src/components/Toasts';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <HelmetProvider>
          <Helmet>
            <title>Tozo</title>
          </Helmet>
          <ThemeProvider>
            <ToastContextProvider>
              <Container maxWidth="md">
                <Toasts />
                <Router />
              </Container>
            </ToastContextProvider>
          </ThemeProvider>
        </HelmetProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}

export default App;
