import React, { useState } from "react";
import "../../styles/LoginPage/LoginPage.css";
import { IoSpeedometerOutline } from "react-icons/io5";
import { Meta } from 'react-head';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError('');

    try {
      const response = await fetch('http://localhost:3005/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: form.login,
          password: form.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        navigate('/dashboard'); 
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
      console.error('Login error:', err);
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

          <label className="login-label">Login (e-mail/phone number)</label>
          <input
            type="text"
            name="login"
            className="login-input"
            value={form.login}
            onChange={handleChange}
          />

          <label className="login-label">Password</label>
          <input
            type="password"
            name="password"
            className="login-input"
            value={form.password}
            onChange={handleChange}
          />

          {error && <div className="error-text">{error}</div>}

          <div className="login-links">
            <Link to="/register">Not registered?</Link>
            <Link to="/passwordrecovery">Forgot password?</Link>
          </div>

          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginForm;

