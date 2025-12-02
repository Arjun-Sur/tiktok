import React, {useEffect, useState} from 'react';
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

function Context({moods, wellnessActivityIsVideoState, setWellnessActivityIsVideo, isWellnessBreak, wellnessBreak, selectedInterval, setSelectedInterval, breakLength, setBreakLength, endWellnessBreak}) {
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
    }, [isWellnessBreak]);

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

                <div style={{marginTop: '8px'}}>
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
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
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
                <legend>Mood Check Chart</legend>
                <i>Not implemented yet</i>
            </fieldset>
        </div>
    </div>
);
}
export default Context;