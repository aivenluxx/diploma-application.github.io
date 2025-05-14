import React, { useState } from 'react';
import '../../styles/MainPage/Speedometer.css';

const Speedometer = () => {
  const [speed, setSpeed] = useState(0);
  const [isAnalog, setIsAnalog] = useState(true);
  const [unit, setUnit] = useState('kph');

  const getSpeedInUnit = () => {
    switch (unit) {
      case 'mps':
        return (speed * 0.277778).toFixed(2);
      case 'mph':
        return (speed * 0.621371).toFixed(2);
      default:
        return speed;
    }
  };

  const accelerate = () => {
    setSpeed((prevSpeed) => Math.min(prevSpeed + 10, 330));
  };

  const decelerate = () => {
    setSpeed((prevSpeed) => Math.max(prevSpeed - 10, 0));
  };

  const toggleSpeedometerType = () => {
    setIsAnalog(!isAnalog);
  };

  const changeUnit = (newUnit) => {
    setUnit(newUnit);
  };

  return (
    <div className="app-container">
      <main className="content">
        <div className="speedometer-section">
          <div className="toggle-buttons">
            <button onClick={toggleSpeedometerType}>
              {isAnalog ? 'Digital' : 'Analog'}
            </button>
          </div>

          <div className="speedometer-container">
            <div className="speedometer-unit-wrapper">
              <div className="speedometer-display">
                {isAnalog ? (
                  <div className="analog-speedometer">
                    <img src="https://habrastorage.org/r/w1560/getpro/habr/post_images/c3c/9a8/456/c3c9a8456303a4f574b2b14dc4c8d499.png"/>
                    <div
                      className="speedometer-needle"
                      style={{
                        transform: `rotate(${speed * 0.642857}deg)`,
                      }}
                    ></div>
                  </div>
                ) : (
                  <div className="digital-speedometer">
                    <p>
                      {getSpeedInUnit()} {unit}
                    </p>
                  </div>
                )}
              </div>
              <aside className="unit-selector">
                <button onClick={() => changeUnit('mps')}>m/s</button>
                <button onClick={() => changeUnit('mph')}>mph</button>
                <button onClick={() => changeUnit('kph')}>km/h</button>
              </aside>
            </div>
          </div>

          <div className="speed-controls">
            <div className="speed-control-buttons">
              <button onClick={accelerate}>Accelerate</button>
              <button onClick={decelerate}>Decelerate</button>
            </div>
            <button className="start-button">Start</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Speedometer;