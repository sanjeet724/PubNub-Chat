import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../App.css';

const Timer = () => {
  const [currTime, setCurrTime] = useState(
    moment().format('MMMM Do YYYY, h:mm a')
  );

  const showTime = () => {
    const time = moment().format('MMMM Do YYYY, h:mm a');
    setCurrTime(time);
  };

  const timer = () => {
    return setInterval(showTime, 1000);
  };

  useEffect(() => {
    const timerId = timer();
    return () => {
      clearInterval(timerId);
      // console.log('Cleaning up...');
    };
  });

  return <div className="time">{currTime}</div>;
};

export default Timer;
