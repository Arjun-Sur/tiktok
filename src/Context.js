import React, { useEffect, useState } from 'react';
import { parseInterval, formatTimeRemaining } from './utils/time';
import './Context.css';

const timeIntervals = [
    { label: '10 seconds', value: '10s' },
    { label: '30 seconds', value: '30s' },
    { label: '1 minute', value: '1m' },
    { label: '5 minutes', value: '5m' },
    { label: '10 minutes', value: '10m' },
    { label: '30 minutes', value: '30m' },
    { label: '60 minutes', value: '60m' },
];

const timeLengths = [
    { label: '1 minute', value: '1m' },
    { label: '2 minutes', value: '2m' },
    { label: '3 minutes', value: '3m' },
    { label: '5 minutes', value: '5m' },
    { label: '10 minutes', value: '10m' },
];

function Context({ moods, wellnessActivityIsVideoState, setWellnessActivityIsVideo, isWellnessBreak, wellnessBreak, selectedInterval, setSelectedInterval, breakLength, setBreakLength, endWellnessBreak }) {
    const [nextBreakAt, setNextBreakAt] = useState(() => Date.now() + parseInterval(selectedInterval || '10m'));
    const [timeRemaining, setTimeRemaining] = useState(() => parseInterval(selectedInterval || '10m'));

    function handleForceBreak() {
        wellnessBreak();

        const ms = parseInterval(selectedInterval);
        const next = Date.now() + ms;
        setNextBreakAt(next);
        setTimeRemaining(ms);
    }

    // schedule/update next break whenever selectedInterval changes
    useEffect(() => {
        const ms = parseInterval(selectedInterval || '10m');
        const next = Date.now() + ms;
        setNextBreakAt(next);
        setTimeRemaining(ms);
    }, [selectedInterval]);

    // countdown interval to update remaining time and trigger alert when elapsed
    useEffect(() => {
        let rafId = null;
        let timerId = null;

        function tick() {
            const remaining = nextBreakAt - Date.now();
            setTimeRemaining(remaining);
            if (remaining <= 0) {
                // trigger alert and schedule next
                handleForceBreak();
            } else if (!isWellnessBreak) {
                rafId = requestAnimationFrame(tick);
            }
        }

        // use a small timeout first to avoid blocking render
        timerId = setTimeout(() => {
            rafId = requestAnimationFrame(tick);
        }, 200);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            if (timerId) clearTimeout(timerId);
        };
    }, [nextBreakAt, selectedInterval, isWellnessBreak]);

    useEffect(() => {
        const ms = parseInterval(selectedInterval);
        const next = Date.now() + ms;
        setNextBreakAt(next);
        setTimeRemaining(ms);
    }, [isWellnessBreak, selectedInterval]);

    // Helpers to compute mood trend for the last 7 days
    const SCORE_MAP = {
        Happy: 4,
        Excited: 4,
        Love: 4,
        Laugh: 3,
        Surprised: 3,
        Relieved: 3,
        Thinking: 2,
        Neutral: 2,
        Awkward: 1,
        Tired: 1,
        Sad: 0,
        Angry: 0,
    };


    // Build mood data by taking the latest 7 mood checks (no date bucketing)
    const buildMoodData = () => {
        const recent = (moods || []).slice(-7);
        const padCount = Math.max(0, 7 - recent.length);
        const padded = Array.from({ length: padCount }).map(() => null).concat(recent);

        return padded.map((m, i) => {
            const avg = m ? (SCORE_MAP[m.label] !== undefined ? SCORE_MAP[m.label] : 2) : null;
            const emoji = m ? m.emoji || null : null;
            return {
                date: null,
                label: '',
                avg,
                emoji,
            };
        });
    };

    const moodPoints = buildMoodData();

    return (
        <div className="context">
            This is a demo of the Wellness Features on TikTok. This UI is only partially functional (sound is muted on purpose).
            Below you can adjust the Wellness Feature settings:

            <div className="time-interval-setting">
                <fieldset>
                    <legend>Interval <i>between</i> Wellness Breaks</legend>

                    <button onClick={handleForceBreak} disabled={isWellnessBreak}>Force Break Now</button>

                    {timeIntervals.map((interval) => (
                        <div key={interval.value}>
                            <input type="radio" id={`ti-${interval.value}`} name="time-interval" value={interval.value} readOnly checked={selectedInterval === interval.value} onClick={() => setSelectedInterval(interval.value)} />
                            <label htmlFor={`ti-${interval.value}`}>{interval.label}</label>
                        </div>
                    ))}

                    <div style={{ marginTop: '8px' }}>
                        <strong>Next Wellness Break:</strong> {!isWellnessBreak ? new Date(nextBreakAt).toLocaleString() : '...'}
                    </div>
                    <div>
                        <strong>Time Remaining:</strong> {!isWellnessBreak ? formatTimeRemaining(timeRemaining) : '...'}
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Length <i>of</i>&nbsp; Wellness Breaks</legend>

                    <button onClick={() => endWellnessBreak()} disabled={!isWellnessBreak} >End Break Now</button>

                    {timeLengths.map((interval) => (
                        <div key={interval.value}>
                            <input type="radio" id={`tl-${interval.value}`} name={`time-length-${interval.value}`} readOnly value={interval.value} checked={breakLength === interval.value} onClick={() => setBreakLength(interval.value)} />
                            <label htmlFor={`tl-${interval.value}`}>{interval.label}</label>
                        </div>
                    ))}
                </fieldset>
                <fieldset>
                    <legend>Wellness Break Activity</legend>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <div key='video'>
                            <input type="radio" id='rd-video' name='video' readOnly checked={wellnessActivityIsVideoState} onClick={() => setWellnessActivityIsVideo(true)} />
                            <label htmlFor='rd-video'>Wellness Video</label>
                        </div>
                        <div key='chat'>
                            <input type="radio" id='rd-chat' name='chat' readOnly checked={!wellnessActivityIsVideoState} onClick={() => setWellnessActivityIsVideo(false)} />
                            <label htmlFor='rd-chat'>AI Companion</label>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Mood Check Trend</legend>
                    <div className="mood-chart-container" aria-hidden={false}>
                        <svg className="mood-chart-svg" viewBox="0 0 340 140" preserveAspectRatio="xMinYMin meet" role="img" aria-label="Mood trend for last 7 days">
                            {/* background grid lines (subtle) */}
                            <g className="grid-lines" stroke="#f3f4f6" strokeWidth="1">
                                <line x1="20" y1="20" x2="320" y2="20" />
                                <line x1="20" y1="70" x2="320" y2="70" />
                                <line x1="20" y1="120" x2="320" y2="120" />
                            </g>
                            {/* polyline connecting points */}
                            {
                                (() => {
                                    const w = 300; const h = 100; const marginX = 20; const marginY = 20;
                                    const maxScore = 4;
                                    const points = moodPoints.map((p, i) => {
                                        const x = marginX + (i * (w / (moodPoints.length - 1)));
                                        const value = p.avg === null ? 2 : p.avg;
                                        const y = marginY + (1 - (value / maxScore)) * h;
                                        return `${x},${y}`;
                                    }).join(' ');
                                    return <polyline fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />;
                                })()
                            }

                            {/* points & emojis */}
                            {
                                (() => {
                                    const w = 300; const h = 100; const marginX = 20; const marginY = 20;
                                    const maxScore = 4;
                                    return moodPoints.map((p, i) => {
                                        const x = marginX + (i * (w / (moodPoints.length - 1)));
                                        const value = p.avg === null ? 2 : p.avg;
                                        const y = marginY + (1 - (value / maxScore)) * h;
                                        const emoji = p.emoji || '';
                                        return (
                                            <g key={i} className="mood-point">
                                                <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="25">{emoji}</text>
                                            </g>
                                        );
                                    });
                                })()
                            }
                        </svg>
                    </div>
                </fieldset>
            </div>
        </div>
    );
}
export default Context;