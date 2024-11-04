import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlaybackState {
  playingSongId: number | null;
}

const initialState: PlaybackState = {
  playingSongId: null,
};

const playbackSlice = createSlice({
  name: 'playback',
  initialState,
  reducers: {
    playSong: (state, action: PayloadAction<number>) => {
      state.playingSongId = action.payload;
    },
    pauseSong: (state) => {
      state.playingSongId = null;
    },
  },
});

export const { playSong, pauseSong } = playbackSlice.actions;
export default playbackSlice.reducer;
