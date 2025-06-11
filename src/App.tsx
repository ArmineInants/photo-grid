import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, type DefaultTheme } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';
import { ErrorBoundary } from './components';
import { LoadingState } from './components/LoadingState/LoadingState';

const HomePage = lazy(() => import('./pages/HomePage').then(mod => ({ default: mod.HomePage })));
const PhotoDetailsPage = lazy(() => import('./pages/PhotoDetailsPage').then(mod => ({ default: mod.PhotoDetailsPage })));

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme as unknown as DefaultTheme}>
      <GlobalStyle />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingState count={3} />}>
            <Routes>
              <Route path="/" element={
                <ErrorBoundary>
                  <HomePage />
                </ErrorBoundary>
              } />
              <Route path="/photo/:id" element={
                <ErrorBoundary>
                  <PhotoDetailsPage />
                </ErrorBoundary>
              } />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
};

export default App;