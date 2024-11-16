import React, { createContext, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../components/Firebase"; // Adjust the path if necessary
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading } from "../store/authSlice"; // Redux actions

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth); // Fetch state from Redux

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const { uid, email, displayName, photoURL } = currentUser;
        // Dispatch serialized user to Redux
        dispatch(setUser({ uid, email, displayName, photoURL }));
      } else {
        dispatch(setUser(null)); // Clear user from Redux
      }
      dispatch(setLoading(false)); // Update loading state
    });

    return () => unsubscribe();
  }, [dispatch]);

  const value = {
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
