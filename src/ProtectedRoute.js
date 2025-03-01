import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import config from './config';

  
const getCsrfToken = () => {
    const csrfCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="));
    return csrfCookie ? csrfCookie.split("=")[1] : "";
  };
const ProtectedRoute = () => {
  const user_name = sessionStorage.getItem("user_name");
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMfaStatus = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/get_mfa_status/`, {
          params: { user_id: sessionStorage.getItem("user_id") },
          withCredentials: true,
          headers: {
            "X-CSRFToken": getCsrfToken(),
          },
        });
  
        if (response.data.error === "Unauthorized") {
          window.location.href = "/login";
        } else {
          setMfaEnabled(response.data.mfa_enabled);
        }
      } catch (error) {
        console.error("Error fetching MFA status:", error);
      } finally {
        setLoading(false); // 👈 This ensures loading stops no matter what
      }
    };
  
    if (isLoggedIn) {
      fetchMfaStatus();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
        <h1>Bienvenido <b>{user_name}</b></h1>
        <h3>Este es el sitio principal de Creze</h3>
        <label>
            MFA Enabled:
            <input 
            type="checkbox" 
            checked={mfaEnabled} 
            onChange={async (e) => {
                const ischecked = e.target.checked;
                try {                
                    const paramData = { 
                        user_id: sessionStorage.getItem("user_id"),
                        mfa_enabled: ischecked
                    };
                    const response = await axios.post(`${config.baseURL}/update_mfa_enabledReact`, paramData, {
                        headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCsrfToken(),
                        },
                        withCredentials: true,
                    });
                    if (response.data.success) {
                        window.location.href = "/mainMenu";
                    } else {
                        console.log("Something happened")
                    }
                    setMfaEnabled(ischecked);
                } catch (error) {
                console.error('Error updating MFA status:', error);
                }
            }} 
            />
        </label>
    </div>

  );
};

export default ProtectedRoute;
