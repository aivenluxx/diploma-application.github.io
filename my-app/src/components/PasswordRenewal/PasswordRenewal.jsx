import React, { useState } from 'react';
import "../../styles/LoginPage/LoginPage.css";
import { IoSpeedometerOutline } from "react-icons/io5";
import { Meta } from 'react-head';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PasswordRenewal = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRecoverPassword = async () => {
    try {
      const res = await axios.post('http://localhost:3005/forgot-password', { email });
      setMessage(res.data.message);

      setTimeout(() => {
        navigate('/emailpasswordrecovery');
      }, 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <>
      <Meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <div className="login-background">
        <div className="login-container">
          <h2 className="login-title">
            Speedster <IoSpeedometerOutline style={{ fontSize: '28px', color: 'white' }} />
          </h2>

          <label className="login-label">E-mail</label>
          <input
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="login-button" onClick={handleRecoverPassword}>
            Recover password
          </button>

          {message && <p className="login-message">{message}</p>}
        </div>
      </div>
    </>
  );
};

export default PasswordRenewal;
