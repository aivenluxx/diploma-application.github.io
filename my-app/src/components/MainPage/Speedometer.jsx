import React, { useState, useEffect, useRef } from 'react';

const Speedometer = () => {
  const [speed, setSpeed] = useState(0); // in km/h
  const [unit, setUnit] = useState('kph');
  const watchId = useRef(null);
  const prevPos = useRef(null);

  const getSpeedInUnit = () => {
    switch (unit) {
      case 'mps':
        return Math.round(speed / 3.6); // km/h -> m/s (rounded to whole number)
      case 'mph':
        return Math.round(speed * 0.621371); // km/h -> mph (rounded to whole number)
      default:
        return Math.round(speed); // km/h (rounded to whole number)
    }
  };

  const changeUnit = (newUnit) => {
    setUnit(newUnit);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371000; // Earth radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // in meters
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
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentTime = position.timestamp;

        if (prevPos.current) {
          const { latitude: prevLat, longitude: prevLon, time: prevTime } = prevPos.current;

          const dist = calculateDistance(prevLat, prevLon, latitude, longitude); // in meters
          const timeElapsed = (currentTime - prevTime) / 1000; // in seconds

          if (timeElapsed > 0) {
            const speedMps = dist / timeElapsed; // speed in m/s
            const speedKph = speedMps * 3.6; // speed in km/h
            setSpeed(speedKph);
          }
        }

        prevPos.current = { latitude, longitude, time: currentTime };
      },
      (error) => {
        // Ignore timeouts to avoid showing errors when position doesn't update
        if (error.code === error.TIMEOUT) {
          console.warn('Geolocation timeout - position did not change');
          return;
        }
        console.error('Error getting position:', error);
        alert('Error getting geolocation');
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 0, 
        timeout: 1000 // Reduced from 3000ms to 1000ms for more frequent updates
      }
    );
  };

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
      <main className="w-full max-w-md p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="mb-8 text-center">
              <div className="bg-gray-900 text-white rounded-lg p-8 mb-4">
                <div className="text-7xl font-bold tabular-nums">
                  {getSpeedInUnit()}
                </div>
                <div className="text-xl mt-2 uppercase font-semibold">
                  {unit}
                </div>
              </div>
              <div className="flex justify-center space-x-2">
                <button 
                  onClick={() => changeUnit('mps')}
                  className={`px-3 py-2 rounded ${unit === 'mps' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                >
                  m/s
                </button>
                <button 
                  onClick={() => changeUnit('mph')}
                  className={`px-3 py-2 rounded ${unit === 'mph' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                >
                  mph
                </button>
                <button 
                  onClick={() => changeUnit('kph')}
                  className={`px-3 py-2 rounded ${unit === 'kph' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                >
                  km/h
                </button>
              </div>
            </div>

            <button 
              className={`w-full py-3 rounded-lg text-white font-bold text-lg ${watchId.current === null ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              onClick={startTracking}
            >
              {watchId.current === null ? 'Start' : 'Stop'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Speedometer;
