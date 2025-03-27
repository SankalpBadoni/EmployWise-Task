import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import UsersList from './pages/UsersList'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
 
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        setIsAuthenticated(!!e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/users" /> : <Login setIsAuthenticated={setIsAuthenticated} />
        } />
        <Route path="/users" element={
          isAuthenticated ? <UsersList setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />
        } />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/users" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
