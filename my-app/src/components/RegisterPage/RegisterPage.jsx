import React, { useState } from 'react';
import '../../styles/RegisterPage/RegisterPage.css';
import { IoSpeedometerOutline } from "react-icons/io5";
import { Meta } from 'react-head';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    repeatPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(''); // Ошибка с сервера
  const [loading, setLoading] = useState(false); // Для индикации загрузки

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Enter your name';
    if (!form.email.trim()) newErrors.email = 'Enter e-mail';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Uncorrect e-mail';

    if (!form.phone.trim()) newErrors.phone = 'Enter your phone number';
    if (!form.password) {
      newErrors.password = 'Enter your password';
    } else {
      if (form.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      } else if (!/[a-z]/.test(form.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/[A-Z]/.test(form.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/[0-9]/.test(form.password)) {
        newErrors.password = 'Password must contain at least one digit';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
        newErrors.password = 'Password must contain at least one special character';
      } else if (/(.)\1\1/.test(form.password)) {
        newErrors.password = 'Password cannot contain the same character 3 or more times in a row';
      }
    }

    if (form.repeatPassword !== form.password) {
      newErrors.repeatPassword = 'Passwords don`t match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setServerError('');
    if (validate()) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3005/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setServerError(data.message || 'Error of connection');
        } else {
          alert(data.message || 'Registration completed successfully!');
          navigate('/emailconfirmationletter');
        }
      } catch (error) {
        setServerError('Error connecting to the server');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <div className="registration-background">
        <div className="registration-container">
          <h2 className="registration-title">
            Speedster <IoSpeedometerOutline style={{ fontSize: '28px', color: 'white' }} />
          </h2>

          <label className="registration-label">Name</label>
          <input
            type="text"
            name="name"
            className="registration-input"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.name && <div className="error-text">{errors.name}</div>}

          <label className="registration-label">E-mail</label>
          <input
            type="email"
            name="email"
            className="registration-input"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && <div className="error-text">{errors.email}</div>}

          <label className="registration-label">Phone number</label>
          <input
            type="tel"
            name="phone"
            className="registration-input"
            value={form.phone}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.phone && <div className="error-text">{errors.phone}</div>}

          <label className="registration-label">Password</label>
          <input
            type="password"
            name="password"
            className="registration-input"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.password && <div className="error-text">{errors.password}</div>}

          <label className="registration-label">Repeat password</label>
          <input
            type="password"
            name="repeatPassword"
            className="registration-input"
            value={form.repeatPassword}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.repeatPassword && <div className="error-text">{errors.repeatPassword}</div>}

          {serverError && <div className="error-text" style={{ marginBottom: '10px' }}>{serverError}</div>}

          <button
            className="registration-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Complete registration'}
          </button>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
