'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { playSong, pauseSong } from '../store/playbackSlice';
import songData from '../Component/songdata';
import image from '../../../public/images/tayabg.png';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddIcon from '@mui/icons-material/Add';

const Card = () => {
  const dispatch = useDispatch();
  const playingSongId = useSelector((state: RootState) => state.playback.playingSongId);
  const [hoveredSongId, setHoveredSongId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [songs, setSongs] = useState(songData);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', singer: '', songPath: '', imagePath: '', length: '' });

  const handleAddSongClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewSong({ title: '', singer: '', songPath: '', imagePath: '', length: '' }); // Reset new song details
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSong((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSongData = {
      ...newSong,
      id: 1, // Set the new song's ID to 1
    };
    // Adjust the ID of the existing songs
    const updatedSongs = songs.map(song => ({ ...song, id: song.id + 1 }));
    setSongs([newSongData, ...updatedSongs]); // Add new song to the beginning of the list
    handleModalClose(); // Close the modal
  };

  const handlePlayPauseClick = (songId: number) => {
    if (playingSongId === songId) {
      dispatch(pauseSong());
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      dispatch(playSong(songId));
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = (audioRef.current.duration * newProgress) / 100;
    }
  };

  const handleDeleteClick = (songId: number) => {
    setSongs(songs.filter(song => song.id !== songId));
  };

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateProgress);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, []);

  const playingSong = songs.find(song => song.id === playingSongId);

  return (
    <div className='flex flex-col overflow-y-auto w-[763px] h-[700px] rounded-[20px] pb-10 bg-custom-purple hide-scrollbar'>
      <div className='flex -mt-3'>
        <img
          src={playingSong ? playingSong.imagePath : image.src}
          className='rounded-[20px] h-[500px] w-[756px] zoomed-image'
          alt="Background"
        />
      </div>
      <div className='-mt-12 ml-[588px]'><AddIcon className='w-[35px] h-[35px]' onClick={handleAddSongClick} /></div>
      {/* Add Song Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 ">Add a New Song</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Song Title"
                value={newSong.title}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="singer"
                placeholder="Singer"
                value={newSong.singer}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="songPath"
                placeholder="Song File Path"
                value={newSong.songPath}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="imagePath"
                placeholder="Image File Path"
                value={newSong.imagePath}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="length"
                placeholder="Song Length (e.g., 3:30)"
                value={newSong.length}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
                required
              />
              <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Song</button>
            </form>
            <button onClick={handleModalClose} className="mt-2 text-gray-500 hover:underline">Cancel</button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md mx-auto flex flex-col items-center mt-5">
        {/* Seek Bar */}
        <input
          type="range"
          value={progress}
          onChange={handleProgressChange}
          className="w-full mb-4 appearance-none h-1 bg-gray-300 rounded outline-none"
        />

        {/* Control Buttons */}
        <div className="flex items-center space-x-4">
          <ShuffleIcon className="text-white hover:text-gray-300 cursor-pointer" />
          <SkipPreviousIcon className="text-white hover:text-gray-300 cursor-pointer" />
          <div
            onClick={() => handlePlayPauseClick(playingSongId!)}
            className="bg-white text-purple-700 rounded-full p-2 cursor-pointer hover:bg-gray-300 transition"
          >
            {isPlaying ? (
              <PauseIcon style={{ width: '30px', height: '30px' }} />
            ) : (
              <PlayArrowRoundedIcon style={{ width: '30px', height: '30px' }} />
            )}
          </div>
          <SkipNextIcon className="text-white hover:text-gray-300 cursor-pointer" />
        </div>
      </div>

      {songs.map((song) => (
        <div
          key={song.id}
          className='hover-box ml-16 mt-6 hover:bg-[#A584A4] hover:w-[605px] hover:h-[100px] hover:relative hover:rounded-[10px]'
          onMouseEnter={() => setHoveredSongId(song.id)}
          onMouseLeave={() => setHoveredSongId(null)} >
          <div className='flex flex-row gap-4 child-box'>
            <div className='flex mt-4'>
              {hoveredSongId === song.id ? (
                isPlaying && playingSongId === song.id ? (
                  <PauseIcon
                    style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                    onClick={() => handlePlayPauseClick(song.id)}
                  />
                ) : (
                  <PlayArrowRoundedIcon
                    style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                    onClick={() => handlePlayPauseClick(song.id)}
                  />
                )
              ) : (
                <div>
                  {playingSongId === song.id && (
                    <div className="visualizer">
                      <div className="bar" style={{ animationDelay: '0s' }}></div>
                      <div className="bar" style={{ animationDelay: '0.1s' }}></div>
                      <div className="bar" style={{ animationDelay: '0.2s' }}></div>
                      <div className="bar" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  )}
                </div>
              )}
              {/* Show song ID only if not playing or hovered */}
              {!(playingSongId === song.id && isPlaying) && hoveredSongId !== song.id && song.id}
            </div>
            <img src={song.imagePath} alt="" className='w-[56px] h-[52px] rounded-[5px]' />
            <div className='flex flex-col'>
              <div className='mt-1 text-normal text-[18px]'>{song.singer}</div>
              <div className='-mt-1 text-normal text-[12px]'>{song.title}</div>
            </div>
          </div>
          <div className='ml-[550px] -mt-9 text-normal text-[12px] flex items-center'>
            {song.length}
            {hoveredSongId === song.id && (
              <DeleteRoundedIcon
                style={{ width: '20px', height: '20px', cursor: 'pointer', marginLeft: '8px' }}
                onClick={() => handleDeleteClick(song.id)}
              />
            )}
          </div>
        </div>
      ))}

      {playingSong && playingSong.songPath && (
        <audio ref={audioRef} src={playingSong.songPath} autoPlay />
      )}
    </div>
  );
};

export default Card;