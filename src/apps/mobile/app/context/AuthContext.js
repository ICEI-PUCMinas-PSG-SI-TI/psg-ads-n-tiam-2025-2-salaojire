import React, { createContext, useContext, useState, useEffect } from 'react';
import FirebaseAPI from '@packages/firebase';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = FirebaseAPI.auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  const valor = {
    user,
    initializing,
    logout: () => FirebaseAPI.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};