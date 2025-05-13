import React from 'react';
import '../../styles/RegisterPage/RegisterPage.css';
import { IoSpeedometerOutline } from "react-icons/io5";
import { Meta } from 'react-head';

const RegisterPage = () => {
  return (
    <>
      <Meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <div className="registration-background">
        <div className="registration-container">
          <h2 className="registration-title">
            Speedster <IoSpeedometerOutline style={{ fontSize: '28px', color: 'white' }} />
          </h2>

          <label className="registration-label">Name</label>
          <input type="text" className="registration-input" />

          <label className="registration-label">E-mail</label>
          <input type="email" className="registration-input" />

          <label className="registration-label">Phone number</label>
          <input type="tel" className="registration-input" />

          <label className="registration-label">Password</label>
          <input type="password" className="registration-input" />

          <label className="registration-label">Repeat password</label>
          <input type="password" className="registration-input" />

          <button className="registration-button">Complete registration</button>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
