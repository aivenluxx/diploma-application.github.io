import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaClipboardList, FaUserCheck } from 'react-icons/fa';
import { IoSpeedometerOutline } from 'react-icons/io5';
import '../../styles/MainPage/MainPageLayout.css'; 

const MainPageLayout = ({ children }) => {
  return (
    <div className="main-page-container">
      <div className="side-panel">
        <div className="side-panel-header">
          <span>Speedster</span>
          <IoSpeedometerOutline style={{ fontSize: '32px', color: 'white' }} />
        </div>

        <nav className="side-panel-nav">
          <div className="side-panel-nav-item">
            <FaHome className="side-panel-icon" />
            <Link to="/">Home</Link>
          </div>

          <div className="side-panel-nav-item">
            <FaClipboardList className="side-panel-icon" />
            <Link to="/register">Registration</Link>
          </div>

          <div className="side-panel-nav-item">
            <FaUserCheck className="side-panel-icon" />
            <Link to="/login">Authentication</Link>
          </div>
        </nav>
      </div>
      <div className="background">{children}</div>
    </div>
  );
};

export default MainPageLayout;