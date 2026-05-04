import { createContext, useContext, useEffect, useMemo } from 'react';
import { useCallStore } from '../store/callStore';
// import { useCallStore } from '../../store/callStore'; // Will create store next

const CallContext = createContext(null);

export const CallProvider = ({ children }) => {
  const callStore = useCallStore();
  
  const value = useMemo(() => ({
    ...callStore,
    // Shorthand for common actions
    startCall: callStore.startCall,
    acceptCall: callStore.acceptCall,
    rejectCall: callStore.rejectCall,
    endCall: callStore.endCall,
    toggleMute: callStore.toggleMute,
    toggleCamera: callStore.toggleCamera,
  }), [callStore]);

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export const useCall = () => useContext(CallContext);

