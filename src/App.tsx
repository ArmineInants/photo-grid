import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/photo/:id" element={<div>Photo Details</div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;