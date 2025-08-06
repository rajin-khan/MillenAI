import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start in a loading state

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Will be null if logged out, or a user object if logged in
      setLoading(false); // The check is complete, so we are no longer loading
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {/* 
        This is the key: We do not render the rest of the app (`children`) 
        until the initial authentication check is complete. 
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};