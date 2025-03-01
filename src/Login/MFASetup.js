import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCsrfToken } from './utils/csrf'; 
import config from '../config';

export default function MFASetup() {
  const [qrCode, setQrCode] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${config.baseURL}/mfa_setupReact`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken(),
      }
    })
    .then(response => {
      if (response.data.redirect) {
        navigate('/mainMenu');
      } else {
        setQrCode(response.data.qrcode);
      }
    })
    .catch(error => {
      console.error("Error fetching MFA QR Code:", error.response);
      setErrorMessage(error.response?.data?.message || 'Error al cargar el código QR.');
    });
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${config.baseURL}/verify_mfa`, {
        otp_code: otpCode,
      }, { withCredentials: true });

      if (response.data.success) {
        navigate('/mainMenu');
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error al verificar el código OTP.');
    }
  };

  return (
    <div className="container">
      <h1>Configuración de MFA</h1>
      {qrCode && <img src={qrCode} alt="QR Code" />}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingrese el código OTP"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          maxLength="6"
          required
        />
        <button type="submit">Verify</button>
      </form>
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </div>
  );
}
