import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  hydrate: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, loading: false, initialized: true });
      return;
    }

    set({ loading: true });

    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, loading: false, initialized: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, loading: false, initialized: true });
      throw error;
    }
  },

  login: ({ token, user }) => {
    localStorage.setItem('token', token);
    set({ user, loading: false, initialized: true });
  },

  updateUser: (user) => set({ user }),

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout transport errors
    }

    localStorage.removeItem('token');
    set({ user: null, loading: false, initialized: true });
  }
}));

export const authSelectors = {
  user: (state) => state.user,
  loading: (state) => state.loading,
  initialized: (state) => state.initialized
};
