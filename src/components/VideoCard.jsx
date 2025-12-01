import React, { useRef, useEffect } from 'react';
import FooterLeft from './FooterLeft';
import FooterRight from './FooterRight';
import './VideoCard.css';

const VideoCard = (props) => {
  const { url, username, description, song, likes, shares, comments, saves, profilePic, setVideoRef, autoplay, elapsed, setElapsed } = props;
  const videoRef = useRef(null);

  useEffect(() => {
    if (autoplay) {
      videoRef.current.play();
    }
  }, [autoplay]);

  const onVideoPress = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <div className="video">
      {/* The video element */}
      <video
        className="player"
        onClick={onVideoPress}
        ref={(ref) => {
          videoRef.current = ref;
          setVideoRef(ref);
        }}
        loop
        muted
        src={url}
      ></video>
      <div className="bottom-controls">
        {/* The left part of the container */}
        <FooterLeft username={username} description={description} song={song} elapsed={elapsed} setElapsed={setElapsed} />
        {/* The right part of the container */}
        <FooterRight likes={likes} shares={shares} comments={comments} saves={saves} profilePic={profilePic} />
      </div>
    </div>
  );
};

export default VideoCard;
