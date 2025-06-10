import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, type DefaultTheme } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';
import { HomePage } from './pages/HomePage';
import { ErrorBoundary } from './components';
import { PhotoDetailsPage } from './pages/PhotoDetailsPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme as unknown as DefaultTheme}>
      <GlobalStyle />
      <Router>
        <ErrorBoundary>
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
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
};

export default App;