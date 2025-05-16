import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoSpeedometerOutline } from "react-icons/io5";
import axios from 'axios';
import "../../styles/LoginPage/LoginPage.css";
import { Meta } from 'react-head';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3005/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Error occurred');
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

          <label className="login-label">New password</label>
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="login-label">Confirm password</label>
          <input
            type="password"
            className="login-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="login-button" onClick={handleReset}>
            Reset Password
          </button>

          {message && <p className="login-message">{message}</p>}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
