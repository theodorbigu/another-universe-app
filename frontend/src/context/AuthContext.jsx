import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUserIdToken } from "../services/auth";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Set up the auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Get the ID token
          const idToken = await getCurrentUserIdToken();
          setToken(idToken);

          // Store auth user and token in localStorage
          localStorage.setItem(
            "authUser",
            JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              token: idToken,
            })
          );
        } catch (error) {
          console.error("Error getting ID token:", error);
        }
      } else {
        // Clear token and localStorage when logged out
        setToken(null);
        localStorage.removeItem("authUser");
      }

      setLoading(false);
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, []);

  // Context value
  const value = {
    currentUser,
    token,
    isAuthenticated: !!currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
