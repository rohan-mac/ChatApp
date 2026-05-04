import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, MicOff, PhoneOff, Volume2, User, Clock } from 'lucide-react';
import { useCall } from '../../hooks/useCall';
import { useTheme } from '../../context/ThemeContext';
import { Z_INDEX } from '../../constants/zIndex';

const AudioCallScreen = () => {
  const { 
    currentCall, 
    toggleMute, 
    endCall, 
    localMute, 
    callDuration,
    connectionState 
  } = useCall('audio');
  
  const { isDark } = useTheme();
  const timeoutRef = useRef(null);

  // Timer
  useEffect(() => {
    if (currentCall?.status === 'active') {
      timeoutRef.current = setInterval(() => {
        window.callApi?.setCallDuration?.(callDuration + 1);
      }, 1000);
    }
    return () => clearInterval(timeoutRef.current);
  }, [currentCall?.status, callDuration]);

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
    <div className="fixed inset-0 z-[9999] flex flex-col bg-gradient-to-b from-slate-900 to-slate-950" style={{ zIndex: Z_INDEX.callScreen }}>
      {/* Header with caller info */}
      <div className="p-8 pt-20 flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-5xl font-bold shadow-2xl border-8 border-white/20">
          <User />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{currentCall.peerId?.slice(-8) || 'Calling...'}</h1>
          <div className="flex items-center gap-2 text-lg text-white/70">
            <span className={`w-3 h-3 rounded-full ${getStatusColor(connectionState)} animate-pulse`} />
            <span>{connectionState.toUpperCase()}</span>
          </div>
        </div>
        <div className="text-4xl font-mono text-white/80 tracking-wide">
          {formatDuration(callDuration)}
        </div>
      </div>

      {/* Waveform animation - placeholder for audio visualization */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="flex items-end gap-1 w-full max-w-md">
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={i}
              animate={{ height: [10, Math.random() * 40 + 20, 10] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              className="w-2 bg-gradient-to-t from-white/30 to-white/80 rounded-full origin-bottom"
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="p-8 pb-20 bg-black/40 backdrop-blur-md border-t border-white/10">
        <div className="max-w-md mx-auto flex items-center justify-center gap-8">
          {/* Mute */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className={`p-5 rounded-full border-4 backdrop-blur-sm transition-all flex-1 max-w-20 ${
              localMute 
                ? 'bg-red-500/40 border-red-500 text-red-100 hover:bg-red-500/60' 
                : 'bg-white/20 border-white/40 text-white hover:bg-white/40'
            }`}
          >
            {localMute ? <MicOff size={28} /> : <Mic size={28} />}
          </motion.button>

          {/* Speaker */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-5 rounded-full bg-white/20 border-4 border-white/40 text-white hover:bg-white/40 flex-1 max-w-20"
          >
            <Volume2 size={28} />
          </motion.button>

          {/* End Call */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => endCall()}
            className="p-6 rounded-full bg-red-600 hover:bg-red-700 border-4 border-red-500 shadow-2xl text-white transition-all flex-1 max-w-24"
          >
            <PhoneOff size={32} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AudioCallScreen;

