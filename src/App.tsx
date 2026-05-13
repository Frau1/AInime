import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage'
import ResultsPage from './pages/ResultsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import './styles/globals.css'; // Import global styles

function App() {
  return (
    <AuthProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;