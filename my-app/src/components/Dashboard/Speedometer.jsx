import React, { useState, useEffect, useRef } from 'react';
import '../../styles/MainPage/Speedometer.css';

const Speedometer = () => {
  const [speed, setSpeed] = useState(0); 
  const [unit, setUnit] = useState('kph');
  const watchId = useRef(null);
  const prevPos = useRef(null);
  const audioRef = useRef(null);
  const speedLimit = 60; 
  const isAlertPlaying = useRef(false);

  const getSpeedInUnit = () => {
    switch (unit) {
      case 'mps':
        return (speed / 3.6).toFixed(2); // km/h -> m/s
      case 'mph':
        return (speed * 0.621371).toFixed(2); // km/h -> mph
      default:
        return speed.toFixed(2);
    }
  };

  const changeUnit = (newUnit) => {
    setUnit(newUnit);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371000; 
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setSpeed(0);
      prevPos.current = null;
      stopAlert();
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentTime = position.timestamp;

        if (prevPos.current) {
          const { latitude: prevLat, longitude: prevLon, time: prevTime } = prevPos.current;

          const dist = calculateDistance(prevLat, prevLon, latitude, longitude); 
          const timeElapsed = (currentTime - prevTime) / 1000; 
          if (timeElapsed > 0) {
            const speedMps = dist / timeElapsed; 
            const speedKph = speedMps * 3.6; 
            setSpeed(speedKph);

            if (speedKph > speedLimit) {
              playAlert();
            } else {
              stopAlert();
            }
          }
        }

        prevPos.current = { latitude, longitude, time: currentTime };
      },
      (error) => {
        if (error.code === error.TIMEOUT) {
          console.warn('Geolocation timeout - position did not change');
          return;
        }
        console.error('Error getting position:', error);
        alert('Ошибка получения геолокации');
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 3000 }
    );
  };

  const playAlert = () => {
    if (!isAlertPlaying.current && audioRef.current) {
      audioRef.current.play();
      isAlertPlaying.current = true;
    }
  };

  const stopAlert = () => {
    if (isAlertPlaying.current && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isAlertPlaying.current = false;
    }
  };

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      stopAlert();
    };
  }, []);

  return (
    <div className="app-container">
      <main className="content">
        <div className="speedometer-section">
          <div className="speedometer-container">
            <div className="speedometer-unit-wrapper">
              <div className="speedometer-display">
                <div className="digital-speedometer">
                  <p>
                    {getSpeedInUnit()} {unit}
                  </p>
                </div>
              </div>
              <aside className="unit-selector">
                <button onClick={() => changeUnit('mps')}>m/s</button>
                <button onClick={() => changeUnit('mph')}>mph</button>
                <button onClick={() => changeUnit('kph')}>km/h</button>
              </aside>
            </div>
          </div>

          <div className="speed-controls">
            <button className="start-button" onClick={startTracking}>
              {watchId.current === null ? 'Start' : 'Stop'}
            </button>
          </div>

          {/* Аудио с простым beep сигналом */}
          <audio
            ref={audioRef}
            src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
            preload="auto"
          />
        </div>
      </main>
    </div>
  );
};

export default Speedometer;
