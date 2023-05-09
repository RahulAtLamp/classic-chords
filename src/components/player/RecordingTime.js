import React, { useState, useEffect } from "react";

function RecordingTime() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = new Date(seconds * 1000).toISOString().substr(11, 8);

  return (
    <span className="recording-timer">Recording time: {formattedTime}</span>
  );
}

export default RecordingTime;
