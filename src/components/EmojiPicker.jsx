import React from 'react';
import './EmojiPicker.css';

const EMOJIS = [
  { emoji: '😀', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😲', label: 'Surprised' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😍', label: 'Love' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤩', label: 'Excited' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😬', label: 'Awkward' },
  { emoji: '😮‍💨', label: 'Relieved' }
];

function EmojiPicker({ visible, onSelect, onClose }) {
  if (!visible) return null;

  const handleSelect = (e) => {
    const { emoji, label } = e.currentTarget.dataset;
    if (onSelect) onSelect({ emoji, label });
  };

  return (
    <div className="emoji-picker" role="dialog" aria-label="Emoji picker">
      <div className="emoji-scroll">
        {EMOJIS.map((e, i) => (
          <button key={i} className="emoji-item" data-emoji={e.emoji} data-label={e.label} onClick={handleSelect}>
            <div className="emoji-char">{e.emoji}</div>
            <div className="emoji-label">{e.label}</div>
          </button>
        ))}
      </div>
      <button className="emoji-close" onClick={onClose} aria-label="Close emoji picker">×</button>
    </div>
  );
}

export default EmojiPicker;
