import { useRef, useEffect, useCallback, useState } from 'react';
import { useCall } from '../context/CallContext';

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  // TURN server (production)
  // {
  //   urls: `turn:${import.meta.env.VITE_TURN_URL || ''}`,
  //   username: import.meta.env.VITE_TURN_USERNAME || '',
  //   credential: import.meta.env.VITE_TURN_CREDENTIAL || ''
  // }
];

export const useWebRTC = (callType = 'video') => {
  const peerConnection = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const [connectionState, setConnectionState] = useState('new');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const { currentCall, endCall, callId } = useCall();

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    
    // Local stream
    pc.ontrack = (event) => {
      const stream = event.streams[0];
      setRemoteStream(stream);
      remoteStreamRef.current = stream;
    };

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        endCall('Connection failed');
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Emit ICE candidate via socket
        window.dispatchEvent(new CustomEvent('webrtc-ice-candidate', {
          detail: { candidate: event.candidate, callId }
        }));
      }
    };

    return pc;
  }, [callId, endCall]);

  const getUserMedia = useCallback(async () => {
    try {
      const constraints = callType === 'video' 
        ? { video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }, audio: true }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Media access denied:', error);
      throw new Error('Media permissions denied');
    }
  }, [callType]);

  const createOffer = useCallback(async () => {
    const pc = createPeerConnection();
    peerConnection.current = pc;
    
    const stream = await getUserMedia();
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
    
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }, [createPeerConnection, getUserMedia]);

  const createAnswer = useCallback(async (offer) => {
    const pc = createPeerConnection();
    peerConnection.current = pc;
    
    const stream = await getUserMedia();
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
    
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }, [createPeerConnection, getUserMedia]);

  const addRemoteDescription = useCallback(async (desc) => {
    if (!peerConnection.current) return;
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(desc));
  }, []);

  const addIceCandidate = useCallback((candidate) => {
    if (!peerConnection.current || !candidate) return;
    peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
  }, []);

  const toggleTrack = useCallback((kind, enabled) => {
    if (!localStreamRef.current) return;
    
    localStreamRef.current.getTracks().forEach(track => {
      if (track.kind === kind) {
        track.enabled = enabled;
      }
    });
  }, []);

  const cleanup = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setConnectionState('closed');
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    peerConnection: peerConnection.current,
    localStream,
    remoteStream,
    connectionState,
    createOffer,
    createAnswer,
    addRemoteDescription,
    addIceCandidate,
    toggleTrack,
    cleanup,
    getUserMedia
  };
};

