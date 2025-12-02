import './WellnessBreak.css';
import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { formatElapsed, parseInterval } from '../utils/time';

function WellnessBreak({ chat, setChat, elapsedTime, length = '2m', onEnd = () => {} }) {

        const totalMs = parseInterval(length);
        const [elapsed, setElapsed] = useState(0);
        const startRef = useRef(Date.now());

        const autoplay = true;
        const videoRef = useRef(null);
        const videos = [require('../videos/wellness1.mp4')]

        useEffect(() => {
            if (autoplay) {
                try {
                    videoRef.current.play();
                } catch (error) {
                    console.error('Error attempting to play', error);
                }
            }
        }, [autoplay]);

        const onVideoPress = () => {
            try {
                if (videoRef.current.paused) {
                videoRef.current.play();
                } else {
                videoRef.current.pause();
                }
            } catch (error) {
                console.error('Error attempting to interact with video', error);
            }
        };

        useEffect(() => {
            startRef.current = Date.now();
            setElapsed(0);
            const interval = setInterval(() => {
                const now = Date.now();
                const e = now - startRef.current;
                setElapsed(e);
                if (e >= totalMs) {
                    clearInterval(interval);
                    onEnd();
                }
            }, 200);
            return () => clearInterval(interval);
        }, [length, totalMs, onEnd]);

        const pct = Math.min(100, (elapsed / totalMs) * 100);
        const remainingMs = Math.max(0, totalMs - elapsed);
        const totalSeconds = Math.ceil(remainingMs / 1000);
        const remainingText = totalSeconds < 60 ? `${totalSeconds}s` : `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;

        return (
            <div className="mood-check-container">
                        {chat ? (
                            <>
                                <svg style={{marginTop: '2rem'}}viewBox="0 0 640 512" transform="scale(3, 3)" width="16.25" height="13" fill="#4ade80">
                                        <g>
                                        <path d="M320 0a40 40 0 1 1 0 80 40 40 0 1 1 0-80zm44.7 164.3L375.8 253c1.6 13.2-7.7 25.1-20.8 26.8s-25.1-7.7-26.8-20.8l-4.4-35h-7.6l-4.4 35c-1.6 13.2-13.6 22.5-26.8 20.8s-22.5-13.6-20.8-26.8l11.1-88.8L255.5 181c-10.1 8.6-25.3 7.3-33.8-2.8s-7.3-25.3 2.8-33.8l27.9-23.6C271.3 104.8 295.3 96 320 96s48.7 8.8 67.6 24.7l27.9 23.6c10.1 8.6 11.4 23.7 2.8 33.8s-23.7 11.4-33.8 2.8l-19.8-16.7zM40 64c22.1 0 40 17.9 40 40v40 80 40.2c0 17 6.7 33.3 18.7 45.3l51.1 51.1c8.3 8.3 21.3 9.6 31 3.1c12.9-8.6 14.7-26.9 3.7-37.8l-15.2-15.2-32-32c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l32 32 15.2 15.2 0 0 25.3 25.3c21 21 32.8 49.5 32.8 79.2V464c0 26.5-21.5 48-48 48H173.3c-17 0-33.3-6.7-45.3-18.7L28.1 393.4C10.1 375.4 0 351 0 325.5V224 160 104C0 81.9 17.9 64 40 64zm560 0c22.1 0 40 17.9 40 40v56 64V325.5c0 25.5-10.1 49.9-28.1 67.9L512 493.3c-12 12-28.3 18.7-45.3 18.7H400c-26.5 0-48-21.5-48-48V385.1c0-29.7 11.8-58.2 32.8-79.2l25.3-25.3 0 0 15.2-15.2 32-32c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-32 32-15.2 15.2c-11 11-9.2 29.2 3.7 37.8c9.7 6.5 22.7 5.2 31-3.1l51.1-51.1c12-12 18.7-28.3 18.7-45.3V224 144 104c0-22.1 17.9-40 40-40z">
                                        </path>
                                        </g>
                                </svg>
                                <h2>Take a Moment</h2>
                                <h3>You've been browsing for<br></br>{formatElapsed(elapsedTime)}</h3>
                                <div className="wellness-video">
                                    <video
                                        className="wc-player"
                                        onClick={onVideoPress}
                                        ref={(ref) => {
                                            videoRef.current = ref;
                                        }}
                                        loop
                                        muted
                                        src={videos[0]}
                                    ></video>
                                </div>
                                <small className="hint">Not interested in the video?</small>
                                <button className="ai-chat-button" onClick={() => setChat(false)}>Chat with AI Wellness Companion Instead</button>
                            </>
                        ) : (
                          <>
                            <div className="warning-message">
                                As this is a prototype, this is an example prompt generated by the AI Wellness Companion and you may not interact with the UI.
                            </div>
                            <div className="chat-header">
                                <button className="back-button" onClick={() => setChat(true)}>
                                    <FontAwesomeIcon icon={faAngleLeft} style={{ width: '17px', height: '17px', color: '#333333' }} />
                                    Back to video
                                </button>
                                <svg viewBox="0 0 640 512" transform="translate(-15, 0) scale(3, 3)" width="16.25" height="13" fill="#4ade80">
                                    <g>
                                    <path d="M320 0a40 40 0 1 1 0 80 40 40 0 1 1 0-80zm44.7 164.3L375.8 253c1.6 13.2-7.7 25.1-20.8 26.8s-25.1-7.7-26.8-20.8l-4.4-35h-7.6l-4.4 35c-1.6 13.2-13.6 22.5-26.8 20.8s-22.5-13.6-20.8-26.8l11.1-88.8L255.5 181c-10.1 8.6-25.3 7.3-33.8-2.8s-7.3-25.3 2.8-33.8l27.9-23.6C271.3 104.8 295.3 96 320 96s48.7 8.8 67.6 24.7l27.9 23.6c10.1 8.6 11.4 23.7 2.8 33.8s-23.7 11.4-33.8 2.8l-19.8-16.7zM40 64c22.1 0 40 17.9 40 40v40 80 40.2c0 17 6.7 33.3 18.7 45.3l51.1 51.1c8.3 8.3 21.3 9.6 31 3.1c12.9-8.6 14.7-26.9 3.7-37.8l-15.2-15.2-32-32c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l32 32 15.2 15.2 0 0 25.3 25.3c21 21 32.8 49.5 32.8 79.2V464c0 26.5-21.5 48-48 48H173.3c-17 0-33.3-6.7-45.3-18.7L28.1 393.4C10.1 375.4 0 351 0 325.5V224 160 104C0 81.9 17.9 64 40 64zm560 0c22.1 0 40 17.9 40 40v56 64V325.5c0 25.5-10.1 49.9-28.1 67.9L512 493.3c-12 12-28.3 18.7-45.3 18.7H400c-26.5 0-48-21.5-48-48V385.1c0-29.7 11.8-58.2 32.8-79.2l25.3-25.3 0 0 15.2-15.2 32-32c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-32 32-15.2 15.2c-11 11-9.2 29.2 3.7 37.8c9.7 6.5 22.7 5.2 31-3.1l51.1-51.1c12-12 18.7-28.3 18.7-45.3V224 144 104c0-22.1 17.9-40 40-40z">
                                    </path>
                                    </g>
                                </svg>
                            </div>
                            <h2>AI Wellness Companion</h2>
                            <div className="wellness-chat">
                                <div className="wc-summary">
                                    <p className="wc-summary-text">You saw 165 videos, 3 lives, and 30 advertisements in the past {formatElapsed(elapsedTime)}. I noticed x, y, and z. How are you feeling right now after {formatElapsed(elapsedTime)} of scrolling?</p>
                                </div>

                                <div className="wc-options">
                                    <button className="wc-option">Motivated 🎯</button>
                                    <button className="wc-option">Happy 😊</button>
                                    <button className="wc-option">Sad 😔</button>
                                    <button className="wc-option">Anxious 😨</button>
                                </div>

                                <div className="wc-divider"><span>or...</span></div>

                                <div className="wc-input-row">
                                    <textarea className="wc-textarea" aria-label="how are you feeling" placeholder="Write how you're feeling..." value={''} onChange={() => {}} rows={1} />
                                    <button className="wc-mic" aria-label="voice input">
                                        <svg viewBox="0 0 384 512" width="9.75" height="13" fill="#333333"><g><path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"></path></g></svg>
                                    </button>
                                </div>
                            </div>
                            <small className="hint" style={{marginLeft: '40px', marginRight: '40px'}}>This is AI. Not a substitute for professional help or treatment. Cannot diagnose.</small>
                          </>  
                        )}
                        <div className="wb-footer">
                            <div className="wb-footer-meta">
                                <small>Break time:</small>
                                <div className="wb-progress">
                                    <div className="wb-progress-fill" style={{width: `${pct}%`}} />
                                </div>
                                <small className="wb-remaining">({remainingText} left)</small>
                            </div>
                        </div>
                </div>
        )
}
export default WellnessBreak;