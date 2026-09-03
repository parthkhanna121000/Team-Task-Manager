import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import DashboardPage from './pages/DashboardPage';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Landing page as the public root view */}
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/projects" element={
          <ProtectedRoute><ProjectsPage /></ProtectedRoute>
        } />

        <Route path="/projects/:projectId" element={
          <ProtectedRoute><ProjectDetailPage /></ProtectedRoute>
        } />

        <Route path="/projects/:projectId/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;