import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { getCsrfToken } from './utils/csrf';
import config from '../config';

export default function Register({ setIsLoggedIn }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/mainMenu');
    }
  }, [navigate]); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      user_name: userName,
      password: password,
    };

    try {
        const response = await axios.post(`${config.baseURL}/registerReact`, loginData, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
          },
          withCredentials: true,
        });
      
        console.log(response.data.success, response.data.redirect);
        if (response.data.success) {
          sessionStorage.setItem("user_id", response.data.user_id);
          sessionStorage.setItem("user_name", response.data.user_name);
          setIsLoggedIn(true);
          setUserId(response.data.user_id);
          window.location.href = '/mainMenu';
        } else {
          setErrorMessage(response.data.message || 'An error occurred.');
        }
      } catch (error) {
        if (error.response) {
          console.error('Error response:', error.response);
          setErrorMessage('Error: ' + error.response.data.message);
        } else if (error.message) {
          console.error('Error message:', error.message);
          setErrorMessage('Error: ' + error.message);
        } else {
          console.error('Unknown error:', error);
          setErrorMessage('An unexpected error occurred');
        }
      }
  };


  return (
    <div className="container">
      <h1>Registro de Usuarios</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Usuario"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {errorMessage && <p className="text-danger">{errorMessage}</p>}

        <Button variant="primary" type="submit">
          Registrate
        </Button>
      </Form>

    </div>
  );
}
