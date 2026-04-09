import { createContext, useContext, useEffect, useMemo } from 'react';
import { authSelectors, useAuthStore } from '../store/authStore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const user = useAuthStore(authSelectors.user);
  const loading = useAuthStore(authSelectors.loading);
  const initialized = useAuthStore(authSelectors.initialized);
  const hydrate = useAuthStore((state) => state.hydrate);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  useEffect(() => {
    if (!initialized) {
      hydrate().catch(() => {
        // handled in store
      });
    }
  }, [hydrate, initialized]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      setUser: updateUser
    }),
    [login, loading, logout, updateUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
