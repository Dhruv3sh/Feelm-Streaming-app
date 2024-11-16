import React, { createContext, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore imports
import { auth, db } from "../components/Firebase"; // Adjust the path if necessary
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setProfileData } from "../store/authSlice"; // Redux actions

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, loading, profileData } = useSelector((state) => state.auth); // Fetch state from Redux

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      dispatch(setLoading(true));

      if (currentUser) {
        const { uid, Name, email, profileImageUrl } = currentUser;
        // Dispatch serialized user to Redux
        dispatch(setUser({ uid, Name, email, profileImageUrl }));

        // Fetch and set profile data
        await fetchProfileData(uid);
      } else {
        dispatch(setUser(null)); // Clear user from Redux
        dispatch(setProfileData(null)); // Clear profile data from Redux
      }

      dispatch(setLoading(false)); // Update loading state
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Function to fetch profile data
  const fetchProfileData = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        dispatch(setProfileData(docSnap.data())); // Update profile data in Redux
      } else {
        console.error("No user data found.");
        dispatch(setProfileData(null));
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
      dispatch(setProfileData(null));
    }
  };

  const value = {
    user, // Authenticated user
    loading, // Loading state
    profileData, // Profile data
    fetchProfileData, // Function to fetch profile data manually
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
