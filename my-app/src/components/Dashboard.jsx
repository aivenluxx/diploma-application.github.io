import React from 'react';
import '../styles/Dashboard.css'; 

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <img src="/path/to/your/image.jpg" alt="Dashboard" className="dashboard-image" />
      <button className="start-button">Start</button>
      <div className="unit-buttons">
        <button className="unit-button">Analog</button>
        <button className="unit-button">Digital</button>
      </div>
      <div className="speed-units">
        <button className="unit-button">mps</button>
        <button className="unit-button">mph</button>
        <button className="unit-button">kph</button>
      </div>
      {/* Индикатор или стрелка можно добавить через CSS Background или SVG */}
    </div>
  );
};

export default Dashboard;

