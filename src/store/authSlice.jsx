import { createSlice } from "@reduxjs/toolkit";

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


//** Async Thunks **//
//** Fetch profile data for the logged-in user **//

export const listenToAuthChanges = () => async (dispatch) => {
  dispatch(setLoading(true));
  const [{ onAuthStateChanged }, { auth }] = await Promise.all([
    import("firebase/auth"),
    import("../components/firebase/firebaseAuth"),
  ]);

  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const { uid, email } = currentUser;
      dispatch(setUser({ uid, email }));
      dispatch(fetchProfileData(uid)); 
    } else {
      dispatch(logout());
    }
    dispatch(setLoading(false));
  });
};

export const fetchProfileData = (uid) => async (dispatch) => {
  dispatch(setProfileLoading(true));
  try {
    const [{ doc, getDoc }, { db }] = await Promise.all([
      import("firebase/firestore"),
      import("../components/firebase/firebaseDb"),
    ]);
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
