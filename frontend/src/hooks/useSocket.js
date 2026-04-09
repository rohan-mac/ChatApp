import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
  autoConnect: false
});

export const useSocket = (handlers = {}) => {
  const { user } = useAuth();
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!user) return;

    socket.auth = { token: localStorage.getItem('token') };
    if (!socket.connected) {
      socket.connect();
    }

    const listeners = Object.keys(handlersRef.current).map((event) => {
      const listener = (payload) => handlersRef.current[event]?.(payload);
      socket.on(event, listener);
      return [event, listener];
    });

    return () => {
      listeners.forEach(([event, listener]) => {
        socket.off(event, listener);
      });
    };
  }, [user]);

  return socket;
};
