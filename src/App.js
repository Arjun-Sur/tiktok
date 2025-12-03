import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import VideoCard from './components/VideoCard';
import BottomNavbar from './components/BottomNavbar';
import TopNavbar from './components/TopNavbar';
import Context from './Context';
import WellnessBreak from './components/WellnessBreak';

// This array holds information about different videos
const videoUrls = [
  {
    url: 'https://content.arjunsur.me/infotiktok/tiktok1.mp4',
    profilePic: 'https://content.arjunsur.me/infotiktok/tiktok1.webp',
    username: 'nyc.marr',
    description: 'ode rain like wtf #nyc',
    song: 'original sound - Emotionallove2x',
    likes: '357.6K',
    comments: 1335,
    saves: '30.6K',
    shares: '39.6K',
  },
  {
    url: 'https://content.arjunsur.me/infotiktok/tiktok2.mp4',
    profilePic: 'https://content.arjunsur.me/infotiktok/tiktok2.webp',
    username: 'rsasmircompilation1',
    description: '✨ ASMR Random Restocks 🐝🍓🍯💫 | Sweet, Soft & Crazy Satisfying Sounds 🎧 — Tap to shop your faves 🛒 #AS',
    song: 'original sound - Rsasmircompilation1',
    likes: '47.3K',
    comments: 102,
    saves: 2793,
    shares: 1158,
  },
  {
    url: 'https://content.arjunsur.me/infotiktok/tiktok3.mp4',
    profilePic: 'https://content.arjunsur.me/infotiktok/tiktok3.webp',
    username: 'luv_layla.j',
    description: 'Your future doctors🙏🏻#biology #fyp',
    song: 'original sound - Layla J',
    likes: '937.6K',
    comments: 2949,
    saves: '29.3K',
    shares: '52.8K',
  },
  {
    url: 'https://content.arjunsur.me/infotiktok/tiktok4.mp4',
    profilePic: 'https://content.arjunsur.me/infotiktok/tiktok4.webp',
    username: 'tilova123',
    description: 'Look at her smiley fa e',
    song: 'original sound - Tilova For Africa',
    likes: '12.1K',
    comments: 78,
    saves: 148,
    shares: 51,
  },
];

function App() {
  const [videos, setVideos] = useState([]);
  const [wellnessBreak, setWellnessBreak] = useState(false); // false
  const [wellnessActivityIsVideo, setWellnessActivityIsVideo] = useState(true); // true
  const [selectedInterval, setSelectedInterval] = useState('10m');
  const [breakLength, setBreakLength] = useState('2m');
  const [elapsed, setElapsed] = useState(0);
  const [reactions, setReactions] = useState([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    setVideos(videoUrls);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8, // Adjust this value to change the scroll trigger point
    };

    // This function handles the intersection of videos
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        try {
          if (entry.isIntersecting) {
            const videoElement = entry.target;
            videoElement.play();
          } else {
            const videoElement = entry.target;
            videoElement.pause();
          }
        } catch (error) {
          console.error('Error handling intersection', error);
        }
      });
    }

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // We observe each video reference to trigger play/pause
    videoRefs.current.forEach((videoRef) => {
      observer.observe(videoRef);
    });

    // We disconnect the observer when the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, [videos]);

  // This function handles the reference of each video
  const handleVideoRef = (index) => (ref) => {
    videoRefs.current[index] = ref;
  };

  function wellnessBreakFunc() {
    setWellnessBreak(true);
  };

  function handleAddReaction(reaction) {
    // reaction: { emoji, label, videoIndex, time }
    setReactions((prev) => [...prev, reaction]);
  }

  return (
    <>
      <div className="app">
        <Context moods={reactions} wellnessActivityIsVideoState={wellnessActivityIsVideo} setWellnessActivityIsVideo={setWellnessActivityIsVideo} isWellnessBreak={wellnessBreak} wellnessBreak={wellnessBreakFunc} selectedInterval={selectedInterval} setSelectedInterval={setSelectedInterval} breakLength={breakLength} setBreakLength={setBreakLength} endWellnessBreak={() => setWellnessBreak(false)} />
        <div>
          <div className="container">
            {(wellnessBreak) ?
              <WellnessBreak chat={wellnessActivityIsVideo} setChat={setWellnessActivityIsVideo} elapsedTime={elapsed} length={breakLength} onEnd={() => setWellnessBreak(false)} />
              : (
                <>
                  <TopNavbar className="top-navbar" />
                  {/* Here we map over the videos array and create VideoCard components */}
                  {videos.map((video, index) => (
                    <VideoCard
                      key={index}
                      index={index}
                      username={video.username}
                      description={video.description}
                      song={video.song}
                      likes={video.likes}
                      saves={video.saves}
                      comments={video.comments}
                      shares={video.shares}
                      url={video.url}
                      profilePic={video.profilePic}
                      setVideoRef={handleVideoRef(index)}
                      elapsed={elapsed}
                      setElapsed={setElapsed}
                      autoplay={index === 0}
                      onAddReaction={handleAddReaction}
                    />
                  ))}
                  <BottomNavbar className="bottom-navbar" />
                </>
              )}
          </div>
          {(wellnessBreak && !wellnessActivityIsVideo) && (
            <div className="warning-message">
              As this is a prototype, this is an example prompt generated by the AI Wellness Companion and you may not interact with the UI.
            </div>
          )}
        </div>
      </div>

    </>
  );

}

export default App;
