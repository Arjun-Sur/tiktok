import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { formatElapsed } from '../utils/time';
import './FooterLeft.css';

export default function FooterLeft(props) {
  const { username, description, song, elapsed, setElapsed } = props;
  const accRef = useRef(elapsed * 1000); // accumulated visible time in ms
  const startRef = useRef(null); // timestamp when visibility became visible

  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        // start timing
        startRef.current = Date.now();
      } else {
        // accumulate and stop
        if (startRef.current) {
          accRef.current += Date.now() - startRef.current;
          startRef.current = null;
        }
      }
    }

    // initialize based on current visibility
    handleVisibility();

    const interval = setInterval(() => {
      let total = accRef.current;
      if (startRef.current) total += Date.now() - startRef.current;
      // call prop setter if available, otherwise do nothing
      if (typeof setElapsed === 'function') {
        setElapsed(Math.floor(total / 1000));
      }
    }, 1000);

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      // finalize accumulated time on unmount
      if (startRef.current) {
        accRef.current += Date.now() - startRef.current;
        startRef.current = null;
        if (typeof setElapsed === 'function') setElapsed(Math.floor(accRef.current / 1000));
      }
    };
  }, []);

  return (
    <div className="footer-container">
      <div className="footer-left">
        <div className="text">
          <h3>@{username}</h3>
          <p>{description}</p>
          <div className="ticker">
            <FontAwesomeIcon icon={faMusic} style={{ width: '30px' }} />
            {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
            <marquee direction="left" scrollamount="2">
              <span>{song}</span>
            </marquee>
          </div>
          <div className="ticker" style={{ marginTop: '10px'}}>
            <svg viewBox="0 0 640 512" transform="translate(5 0) scale(1.3, 1.3)" width="16.25" height="13" style={{marginRight: "1rem"}} fill="#4ade80">
              <g>
                <path d="M320 0a40 40 0 1 1 0 80 40 40 0 1 1 0-80zm44.7 164.3L375.8 253c1.6 13.2-7.7 25.1-20.8 26.8s-25.1-7.7-26.8-20.8l-4.4-35h-7.6l-4.4 35c-1.6 13.2-13.6 22.5-26.8 20.8s-22.5-13.6-20.8-26.8l11.1-88.8L255.5 181c-10.1 8.6-25.3 7.3-33.8-2.8s-7.3-25.3 2.8-33.8l27.9-23.6C271.3 104.8 295.3 96 320 96s48.7 8.8 67.6 24.7l27.9 23.6c10.1 8.6 11.4 23.7 2.8 33.8s-23.7 11.4-33.8 2.8l-19.8-16.7zM40 64c22.1 0 40 17.9 40 40v40 80 40.2c0 17 6.7 33.3 18.7 45.3l51.1 51.1c8.3 8.3 21.3 9.6 31 3.1c12.9-8.6 14.7-26.9 3.7-37.8l-15.2-15.2-32-32c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l32 32 15.2 15.2 0 0 25.3 25.3c21 21 32.8 49.5 32.8 79.2V464c0 26.5-21.5 48-48 48H173.3c-17 0-33.3-6.7-45.3-18.7L28.1 393.4C10.1 375.4 0 351 0 325.5V224 160 104C0 81.9 17.9 64 40 64zm560 0c22.1 0 40 17.9 40 40v56 64V325.5c0 25.5-10.1 49.9-28.1 67.9L512 493.3c-12 12-28.3 18.7-45.3 18.7H400c-26.5 0-48-21.5-48-48V385.1c0-29.7 11.8-58.2 32.8-79.2l25.3-25.3 0 0 15.2-15.2 32-32c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-32 32-15.2 15.2c-11 11-9.2 29.2 3.7 37.8c9.7 6.5 22.7 5.2 31-3.1l51.1-51.1c12-12 18.7-28.3 18.7-45.3V224 144 104c0-22.1 17.9-40 40-40z">
                  </path>
                </g>
            </svg>
            Time Watching: {formatElapsed(elapsed)}
          </div>
        </div>
      </div>
    </div>
  );
}