import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as authService from '../services/authService';
import { setAccessToken, setUnauthorizedHandler } from '../services/api';

const SESSION_KEY = 'session';

const AuthContext = createContext(null);

function toSession(data) {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      monthlyBudget: data.user.user_metadata?.monthly_budget,
    },
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function startSession(newSession) {
    setAccessToken(newSession.accessToken);
    setSession(newSession);
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(newSession));
  }

  async function clearSession() {
    setAccessToken(null);
    setSession(null);
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }

  useEffect(() => {
    setUnauthorizedHandler(clearSession);

    async function restoreSession() {
      try {
        const saved = await SecureStore.getItemAsync(SESSION_KEY);
        if (saved) {
          const { refreshToken } = JSON.parse(saved);
          const data = await authService.refreshSession(refreshToken);
          await startSession(toSession(data));
        }
      } catch (error) {
        await clearSession();
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function signIn(email, password) {
    const data = await authService.signIn(email.trim(), password);
    await startSession(toSession(data));
  }

  async function signUp(email, password) {
    await authService.signUp(email.trim(), password);

    await signIn(email, password);
  }

  async function signOut() {
    try {
      await authService.signOut();
    } catch (error) {
      // Even if the server call fails application still log out on the phone
    }
    await clearSession();
  }

  async function updateBudget(monthlyBudget) {
    await authService.updateUserMetadata({ monthly_budget: monthlyBudget });
    await startSession({
      ...session,
      user: { ...session.user, monthlyBudget },
    });
  }

  const value = {
    session,
    user: session?.user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateBudget,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
