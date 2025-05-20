import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { IoSpeedometerOutline } from 'react-icons/io5';
import { FaTelegram } from "react-icons/fa6";
import '../../styles/MainPage/MainPageLayout.css'; 

const DashboardLayout = ({ children }) => {
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
            <FaTelegram className="side-panel-icon" />
            <a href='https://t.me/Sp33dsterBot'>Telegram Bot</a>
          </div>
        </nav>
      </div>
      <div className="background">{children}</div>
    </div>
  );
};

export default DashboardLayout;