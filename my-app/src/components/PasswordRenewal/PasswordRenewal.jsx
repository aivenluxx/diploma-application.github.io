import React from 'react';
import "../../styles/LoginPage/LoginPage.css";
import { IoSpeedometerOutline } from "react-icons/io5";
import { Meta } from 'react-head';
import { useNavigate } from 'react-router-dom';

const PasswordRenewal = () => {
  const navigate = useNavigate();

  const handleRecoverPassword = () => {
    navigate('/emailpasswordrecovery');
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
          <input type="text" className="login-input" />

          <button className="login-button" onClick={handleRecoverPassword}>
            Recover password
          </button>
        </div>
      </div>
    </>
  );
};

export default PasswordRenewal;
