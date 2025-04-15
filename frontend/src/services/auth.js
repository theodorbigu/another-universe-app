import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { saveUserToBackend } from "./api";

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update profile with display name if provided
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    // Get ID token
    const idToken = await userCredential.user.getIdToken();

    // Save user to backend
    await saveUserToBackend(userCredential.user.uid, email, idToken);

    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get ID token
    const idToken = await userCredential.user.getIdToken();

    // Save user session data in localStorage (optional)
    localStorage.setItem(
      "authUser",
      JSON.stringify({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
      })
    );

    return { user: userCredential.user, token: idToken };
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);

    // Get ID token
    const idToken = await userCredential.user.getIdToken();

    // Save user to backend
    await saveUserToBackend(
      userCredential.user.uid,
      userCredential.user.email,
      idToken,
      userCredential.user.displayName
    );

    return { user: userCredential.user, token: idToken };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign out
export const logout = async () => {
  try {
    await signOut(auth);
    // Clear user data from localStorage
    localStorage.removeItem("authUser");
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Password reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get current user ID token
export const getCurrentUserIdToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in");
  }

  return await user.getIdToken();
};
