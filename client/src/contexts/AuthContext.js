import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { signOut } from 'aws-amplify/auth';
import { addRequestInterceptors, clearRequestInterceptors } from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const interceptorId = useRef(null);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const session = await fetchAuthSession();
        if (!session) {
          throw new Error('No credentials in session');
        }
        setAuthUser(session);
        const token = session?.tokens?.idToken?.toString();
        if (token) {
          const id = addRequestInterceptors(token);
          interceptorId.current = id;
        }
      } catch (error) {
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };

    const handleAuthEvents = (event) => {
      if (event.payload.event === 'signIn') {
        checkUser();
      } else if (event.payload.event === 'signOut') {
        setAuthUser(null);
      }
    };

    const listener = Hub.listen('auth', handleAuthEvents);
    checkUser();

    return () => {
      listener();
      if (interceptorId.current) {
        clearRequestInterceptors(interceptorId.current);
      }
    };
  }, []);

  const logOut = async () => {
    try {
      await signOut();
      setAuthUser(null);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ authUser, loading, showWelcome, setShowWelcome, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
