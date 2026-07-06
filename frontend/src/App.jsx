import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/notFound';

function App() {
  // Simple fake auth state for frontend-only implementation
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  function handleLogin() {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  }

  function handleLogout() {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
