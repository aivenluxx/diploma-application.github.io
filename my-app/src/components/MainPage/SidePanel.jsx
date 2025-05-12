import React from 'react';
import { FaHome, FaClipboardList, FaUserCheck } from 'react-icons/fa';
import { IoSpeedometerOutline } from "react-icons/io5";
import '../../styles/MainPage/SidePanel.css'; 

const SidePanel = () => {
  return (
    <div className="side-panel">
      <div className="side-panel-header">
        <span>Speedster</span>
        <IoSpeedometerOutline style={{ fontSize: '32px', color: 'white' }} />
      </div>

      <nav className="side-panel-nav">
        <div className="side-panel-nav-item">
          <FaHome className="side-panel-icon" />
          <span>Home</span>
        </div>

        <div className="side-panel-nav-item">
          <FaClipboardList className="side-panel-icon" />
          <span>Registration</span>
        </div>

        <div className="side-panel-nav-item">
          <FaUserCheck className="side-panel-icon" />
          <span>Authentication</span>
        </div>
      </nav>
    </div>
  );
};

export default SidePanel;
