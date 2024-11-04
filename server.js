// card.tsx
import React from 'react';
import songData from './songdata';

const Card = () => {
  return (
    <div>
      {songData.map(song => (
        <div key={song.id}>
          <img src={song.imagePath} alt={song.title} />
          <h2>{song.title}</h2>
          <p>{song.singer}</p>
          <p>{song.length}</p>
          <audio controls>
            <source src={song.songPath} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
};

export default Card;