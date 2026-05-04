import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, Settings } from 'lucide-react';
// import { useCall, useWebRTC } from '../../hooks/useCall';
import { useTheme } from '../../context/ThemeContext';
import { Z_INDEX } from '../../constants/zIndex';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useCall } from '../../context/CallContext';

const VideoCallScreen = () => {
  const { 
    currentCall, 
    toggleMute, 
    toggleVideo, 
    endCall, 
    localMute, 
    localVideo,
    callDuration,
    connectionState 
  } = useCall('video');
  
  const { remoteStream, localStream, toggleTrack } = useWebRTC('video');
  const { isDark } = useTheme();
  const timeoutRef = useRef(null);

  // Update local settings sync
  useEffect(() => {
    toggleTrack('audio', !localMute);
  }, [localMute, toggleTrack]);

  useEffect(() => {
    toggleTrack('video', localVideo);
  }, [localVideo, toggleTrack]);

  // Timer
  useEffect(() => {
    if (currentCall?.status === 'active') {
      timeoutRef.current = setInterval(() => {
        // Update duration via store
        window.callApi?.setCallDuration?.(callDuration + 1);
      }, 1000);
    }
    return () => clearInterval(timeoutRef.current);
  }, [currentCall?.status, callDuration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, []);

  if (!currentCall || currentCall.status !== 'active') return null;

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (state) => {
    switch (state) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black" style={{ zIndex: Z_INDEX.callScreen }}>
      {/* Remote video - fullscreen */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={(el) => {
            if (el && remoteStream) {
              el.srcObject = remoteStream;
              el.play().catch(e => console.log('Remote video play:', e));
            }
          }}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        
        {/* Status overlay */}
        <div className="absolute top-4 left-4 text-white/90 text-sm font-medium flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(connectionState)} animate-pulse`} />
          <span>{connectionState.toUpperCase()}</span>
        </div>

        {/* Local video - bottom right PIP */}
        <div className="absolute bottom-6 right-6 w-32 h-48 rounded-2xl border-4 border-black shadow-2xl overflow-hidden">
          <video
            ref={(el) => {
              if (el && localStream) {
                el.srcObject = localStream;
                el.play().catch(e => console.log('Local video play:', e));
              }
            }}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-white text-xs uppercase tracking-wide font-bold px-2 py-1 bg-black/50 rounded-full">
              You
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="absolute top-4 right-4 text-white/90 text-2xl font-mono">
          {formatDuration(callDuration)}
        </div>
      </div>

      {/* Controls - bottom bar */}
      <div className="p-4 bg-black/40 backdrop-blur-md border-t border-white/10">
        <div className="max-w-md mx-auto flex items-center justify-center gap-4">
          {/* Mute */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className={`p-4 rounded-full border-2 backdrop-blur-sm transition-all ${
              localMute 
                ? 'bg-red-500/30 border-red-500 text-red-100 hover:bg-red-500/50' 
                : 'bg-white/20 border-white/40 text-white hover:bg-white/30'
            }`}
          >
            {localMute ? <MicOff size={24} /> : <Mic size={24} />}
          </motion.button>

          {/* Video */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleVideo}
            className={`p-4 rounded-full border-2 backdrop-blur-sm transition-all ${
              !localVideo 
                ? 'bg-red-500/30 border-red-500 text-red-100 hover:bg-red-500/50' 
                : 'bg-white/20 border-white/40 text-white hover:bg-white/30'
            }`}
          >
            {localVideo ? <Video size={24} /> : <VideoOff size={24} />}
          </motion.button>

          {/* End Call - prominent */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => endCall()}
            className="p-5 rounded-full bg-red-600 hover:bg-red-700 border-2 border-red-500 shadow-2xl text-white transition-all"
          >
            <PhoneOff size={28} />
          </motion.button>

          {/* Speaker - bonus */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 rounded-full bg-white/20 border-white/40 text-white hover:bg-white/30"
          >
            <Volume2 size={24} />
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 rounded-full bg-white/20 border-white/40 text-white hover:bg-white/30"
          >
            <Settings size={24} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallScreen;

