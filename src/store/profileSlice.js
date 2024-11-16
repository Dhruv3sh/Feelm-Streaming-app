// profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileData: null,
  profileLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setProfileLoading: (state, action) => {
      state.profileLoading = action.payload;
    },
    setProfileError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setProfileData, setProfileLoading, setProfileError } = profileSlice.actions;

export default profileSlice.reducer;
