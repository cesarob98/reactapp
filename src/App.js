import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import NavbarIn from './NavbarIn';
import Login from './Login/Login';
import { useState, useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <NavbarIn setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Navbar setIsLoggedIn={setIsLoggedIn} />
      )}

      <div className="container">
        <Routes>
          <Route path="/" element={
            <div>
              <h3>Este es el sitio principal de Creze</h3>
              <p>Este texto es únicamente una prueba.</p>
              <p>Presiona en iniciar sesión para comenzar la demo.</p>
            </div>
          } />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/mainMenu" element={
            <ProtectedRoute />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
