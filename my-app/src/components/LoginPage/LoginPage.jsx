import React from "react";
import "../../styles/LoginPage/LoginPage.css";
import { IoSpeedometerOutline } from "react-icons/io5";
import { Meta } from 'react-head';

const LoginForm = () => {
  return (
     <>
    <Meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <div className="login-background">
      <div className="login-container">
        <h2 className="login-title">
          Speedster  <IoSpeedometerOutline style={{ fontSize: '28px', color: 'white' }} />
        </h2>
        <label className="login-label">Login (e-mail/phone number)</label>
        <input type="text" className="login-input" />

        <label className="login-label">Password</label>
        <input type="password" className="login-input" />

        <div className="login-links">
          <a href="#">Not registered?</a>
          <a href="#">Forgot password?</a>
        </div>

        <button className="login-button">Login</button>
      </div>
    </div>
    </>
  );
};

export default LoginForm;
