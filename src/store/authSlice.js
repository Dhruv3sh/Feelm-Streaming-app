import { createSlice } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../components/Firebase";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  profileData: null,
  profileLoading: false,
  profileError: null,
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
      state.profileData = null;
    },
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

// Async Thunks
export const listenToAuthChanges = () => (dispatch) => {
  dispatch(setLoading(true));
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const { uid, email } = currentUser;
      dispatch(setUser({ uid, email }));
      dispatch(fetchProfileData(uid)); // Fetch profile data for the logged-in user
    } else {
      dispatch(logout());
    }
    dispatch(setLoading(false));
  });
};

export const fetchProfileData = (uid) => async (dispatch) => {
  dispatch(setProfileLoading(true));
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      dispatch(setProfileData(docSnap.data()));
    } else {
      dispatch(setProfileData(null));
      console.error("No user data found.");
    }
  } catch (error) {
    dispatch(setProfileError(error.message));
    console.error("Error fetching profile data:", error.message);
  } finally {
    dispatch(setProfileLoading(false));
  }
};

export default authSlice.reducer;
