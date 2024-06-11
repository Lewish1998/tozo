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

const App = () => {
  return (
    <AuthContextProvider>
      <HelmetProvider>
        <Helmet>
          <title>Tozo</title>
        </Helmet>
        <ThemeProvider>
          <Container maxWidth="md">
            <Router />
          </Container>
        </ThemeProvider>
      </HelmetProvider>
    </AuthContextProvider>
  )
}

export default App;
