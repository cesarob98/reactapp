import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { getCsrfToken } from './utils/csrf';

export default function Login({ setIsLoggedIn }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/mainMenu');
    }
  }, [navigate]);
  const handleClose = () => setShow(false);  
  const handleShow = () => setShow(true);   

  const handleSubmit = async (event) => {
    event.preventDefault();

    const loginData = {
      user_name: userName,
      password: password,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/loginReact', loginData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        withCredentials: true,
      });
      console.log(response.data.success, response.data.redirect)
      if (response.data.success) {
        sessionStorage.setItem("user_id", response.data.user_id);
        sessionStorage.setItem("user_name", response.data.user_name);
        setIsLoggedIn(true);
        setUserId(response.data.user_id);

        if (response.data.redirect === 'mfa_setup') {
          setQrCode(response.data.qrcode);
          handleShow(true);
        } else if (response.data.redirect === 'mainMenu') {
          window.location.href = '/mainMenu';
        }
      } else {
        setErrorMessage(response.data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error response:', error.response);
      setErrorMessage('Error: ' + error.response.data.message);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/verify_mfaReact', 
        { otp_code: otpCode, user_id: userId },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        window.location.href = '/mainMenu';
      } else {
        setErrorMessage(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      setErrorMessage('Error: ' + error.response?.data?.message || 'Failed to verify OTP');
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
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
          Iniciar sesión
        </Button>
      </Form>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Verify OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleOtpSubmit}>
            <p>Scan the QR Code to enable MFA:</p>
            {qrCode && <img src={qrCode} alt="QR Code" style={{ width: '100%' }} />}
            <Form.Group className="mb-3" controlId="otpCode">
              <Form.Label>OTP Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength="6"
                required
              />
            </Form.Group>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <Button variant="primary" type="submit">
              Verify OTP
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
