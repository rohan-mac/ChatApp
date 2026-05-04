import { useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useCallStore } from '../store/callStore';
import { useWebRTC } from './useWebRTC';
import { useAuth } from '../context/AuthContext';

let callApi = null;

export const setCallApi = (api) => {
  callApi = api;
  window.callApi = api;
};

export const useCall = (callType = 'video') => {
  const socket = useSocket();
  const { user } = useAuth();
  const callStore = useCallStore();
  const webrtc = useWebRTC(callType);
  
  // Socket event handlers for calls
  useEffect(() => {
    if (!socket || !user) return;

    const handleIncomingCall = ({ fromUserId, callId, type, offer }) => {
      callStore.setIncomingCall({ id: callId, peerId: fromUserId, type, offer });
    };

    const handleCallAccepted = async ({ callId, answer }) => {
      await webrtc.addRemoteDescription(answer);
      callStore.updateCallStatus('active');
    };

    const handleCallRejected = ({ callId, reason }) => {
      callStore.endCall(reason);
    };

    const handleCallEnded = ({ callId }) => {
      webrtc.cleanup();
      callStore.endCall('ended');
    };

    const handleIceCandidate = ({ candidate, callId }) => {
      webrtc.addIceCandidate(candidate);
    };

    // Register handlers
    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-accepted', handleCallAccepted);
    socket.on('call-rejected', handleCallRejected);
    socket.on('call-ended', handleCallEnded);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-accepted', handleCallAccepted);
      socket.off('call-rejected', handleCallRejected);
      socket.off('call-ended', handleCallEnded);
      socket.off('ice-candidate', handleIceCandidate);
    };
  }, [socket, user, callStore, webrtc]);

  // Call API object for store actions
  const api = useCallback({
    async startCall({ callId, peerId, type, chatId }) {
      const offer = await webrtc.createOffer();
      socket.emit('call-user', { toUserId: peerId, callId, type, chatId, offer });
    },

    async acceptCall({ callId }) {
      const answer = await webrtc.createAnswer(callStore.incomingCalls.find(c => c.id === callId)?.offer);
      socket.emit('accept-call', { callId, answer });
    },

    rejectCall({ callId, reason }) {
      socket.emit('reject-call', { callId, reason });
    },

    endCall(reason) {
      socket.emit('end-call', { callId: callStore.currentCall?.id, reason });
    }
  }, [socket, webrtc, callStore]);

  useEffect(() => {
    setCallApi(api);
  }, [api]);

  return {
    ...callStore,
    ...webrtc,
    ...api,
    isInCall: !!callStore.currentCall
  };
};

