import React, { useRef, useEffect, useState } from 'react';
import FooterLeft from './FooterLeft';
import FooterRight from './FooterRight';
import EmojiPicker from './EmojiPicker';
import './VideoCard.css';

const VideoCard = (props) => {
  const { url, username, description, song, likes, shares, comments, saves, profilePic, setVideoRef, autoplay, elapsed, setElapsed, onAddReaction, index } = props;
  const videoRef = useRef(null);
  const [pickerVisible, setPickerVisible] = useState(false);

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
      {pickerVisible && (
        <EmojiPicker visible={pickerVisible} onClose={() => setPickerVisible(false)} onSelect={(emojiObj) => {
          if (onAddReaction) {
            onAddReaction({ ...emojiObj, videoIndex: index, time: Date.now() });
          }
          setPickerVisible(false);
        }} />
      )}
      <div className="bottom-controls">
        {/* The left part of the container */}
        <FooterLeft username={username} description={description} song={song} elapsed={elapsed} setElapsed={setElapsed} />
        {/* The right part of the container */}
        <FooterRight likes={likes} shares={shares} comments={comments} saves={saves} profilePic={profilePic} onAddReaction={onAddReaction} videoIndex={index} openPicker={setPickerVisible} pickerVisible={pickerVisible} />
      </div>
    </div>
  );
};

export default VideoCard;
