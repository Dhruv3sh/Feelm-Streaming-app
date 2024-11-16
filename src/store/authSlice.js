import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  profileData: null, // Merged from profileSlice
  profileLoading: false, // Merged from profileSlice
  profileError: null, // Merged from profileSlice
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.profileData = null; // Clear profile data on logout
    },
    // Profile-related reducers
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setProfileLoading: (state, action) => {
      state.profileLoading = action.payload;
    },
    setProfileError: (state, action) => {
      state.profileError = action.payload;
    },
  },
});

export const {
  setUser,
  setLoading,
  setError,
  logout,
  setProfileData,
  setProfileLoading,
  setProfileError,
} = authSlice.actions;

export default authSlice.reducer;
