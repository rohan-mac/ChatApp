import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Optional, calls are transient

export const useCallStore = create(
  persist(
    (set, get) => ({
      // Current active call
      currentCall: null,
      // Incoming calls queue
      incomingCalls: [],
      // Local settings
      localMute: false,
      localVideo: true,
      callDuration: 0,
      callHistory: [],
      
      // Actions
      startCall: (peerId, type, chatId) => {
        const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        set({
          currentCall: { id: callId, peerId, type, status: 'calling', chatId },
          incomingCalls: []
        });
        // Trigger socket emit via useCall hook
        window.callApi?.startCall?.({ callId, peerId, type, chatId });
      },

      setIncomingCall: (callData) => {
        set((state) => ({
          incomingCalls: [...state.incomingCalls, callData]
        }));
      },

      acceptCall: (callId) => {
        const call = get().incomingCalls.find(c => c.id === callId);
        if (call) {
          set({
            currentCall: { ...call, status: 'active' },
            incomingCalls: get().incomingCalls.filter(c => c.id !== callId)
          });
          window.callApi?.acceptCall?.({ callId });
        }
      },

      rejectCall: (callId, reason = 'rejected') => {
        set({
          incomingCalls: get().incomingCalls.filter(c => c.id !== callId)
        });
        window.callApi?.rejectCall?.({ callId, reason });
      },

      endCall: (reason = 'ended') => {
        const current = get().currentCall;
        if (current) {
          const historyItem = {
            id: current.id,
            peerId: current.peerId,
            type: current.type,
            chatId: current.chatId,
            duration: get().callDuration,
            reason,
            timestamp: Date.now(),
            direction: current.status === 'calling' ? 'outgoing' : 'answered' // Will refine on backend
          };
          set((state) => ({
            callHistory: [historyItem, ...state.callHistory.slice(0, 49)],
            currentCall: null,
            callDuration: 0,
            localMute: false,
            localVideo: true
          }));
        } else {
          set({
            currentCall: null,
            callDuration: 0,
            localMute: false,
            localVideo: true
          });
        }
        window.callApi?.endCall?.(reason);
      },

      clearHistory: () => set({ callHistory: [] }),

      updateCallStatus: (status) => {
        set((state) => ({
          currentCall: state.currentCall ? { ...state.currentCall, status } : null
        }));
      },

      toggleMute: () => set((state) => ({ localMute: !state.localMute })),
      toggleVideo: () => set((state) => ({ localVideo: !state.localVideo })),

      setCallDuration: (duration) => set({ callDuration: duration }),
      
      clearAll: () => set({
        currentCall: null,
        incomingCalls: [],
        localMute: false,
        localVideo: true,
        callDuration: 0,
        callHistory: []
      })
    }),
    {
      name: 'call-storage', // Don't persist calls
      partialize: () => ({}), // Transient
    }
  )
);

