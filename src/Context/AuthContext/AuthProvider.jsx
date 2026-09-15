import React, { useEffect, useState } from "react";
import { auth } from "./firebase.config";

import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { AuthContext } from "./AuthContext";

const GoogleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createAccount = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const userSignIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Secure "remember me": choose how long Firebase keeps the session.
  // We NEVER store the raw password anywhere.
  const setRememberMe = (remember) => {
    return setPersistence(
      auth,
      remember ? browserLocalPersistence : browserSessionPersistence,
    );
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };
  const passwordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const googleSignIn = () => {
    return signInWithPopup(auth, GoogleProvider);
  };

  const signOutUser = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authData = {
    passwordReset,
    createAccount,
    updateUserProfile,
    signOutUser,
    googleSignIn,
    userSignIn,
    setRememberMe,
    loading,
    setLoading,
    setUser,
    user,
  };

  return <AuthContext value={authData}>{children}</AuthContext>;
};

export default AuthProvider;
