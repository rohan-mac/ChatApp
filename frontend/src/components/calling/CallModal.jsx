import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, Video, User, Mic, Volume2, X } from 'lucide-react';
import { useCall } from '../../context/CallContext';
import { Z_INDEX } from '../../constants/zIndex';

const CallModal = () => {
  const { incomingCalls, rejectCall, acceptCall, isInCall } = useCall();
  const [visibleCalls, setVisibleCalls] = useState([]);

  // Show latest incoming call
  useEffect(() => {
    if (incomingCalls.length > 0 && !isInCall) {
      const latestCall = incomingCalls[incomingCalls.length - 1];
      setVisibleCalls([latestCall]);
      
      // Auto reject after 30s
      const timeout = setTimeout(() => {
        rejectCall(latestCall.id, 'timeout');
      }, 30000);

      return () => clearTimeout(timeout);
    } else {
      setVisibleCalls([]);
    }
  }, [incomingCalls, isInCall, rejectCall]);

  const handleAccept = useCallback((call) => {
    acceptCall(call.id);
  }, [acceptCall]);

  const handleReject = useCallback((callId) => {
    rejectCall(callId);
  }, [rejectCall]);

  if (visibleCalls.length === 0) return null;

  const call = visibleCalls[0]; // Only one incoming at a time

  const Icon = call.type === 'video' ? Video : Phone;

  return (
    <AnimatePresence>
      {visibleCalls.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          style={{ zIndex: Z_INDEX.callModal }}
        >
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-4 border-cyan-500/50 rounded-3xl p-8 max-w-sm w-full max-h-[90vh] flex flex-col items-center gap-6 shadow-2xl backdrop-blur-xl"
          >
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-3xl font-bold shadow-2xl border-4 border-white/20">
              {/* TODO: Caller avatar */}
              <User />
            </div>

            {/* Caller info */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">Incoming {call.type} Call</h2>
              <p className="text-cyan-400 text-lg font-semibold">{call.peerId?.slice(-8) || 'Unknown'}</p>
              {/* TODO: Get caller name from user list */}
            </div>

            {/* Call type icon */}
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Icon className="w-16 h-16 text-cyan-400 mx-auto" />
            </div>

            {/* Controls */}
            <div className="flex gap-6 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReject(call.id)}
                className="p-4 rounded-full bg-red-500/20 hover:bg-red-500/40 border-2 border-red-500/50 text-red-100 backdrop-blur-sm transition-all flex items-center justify-center"
              >
                <Phone className="w-8 h-8" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAccept(call)}
                className="p-4 rounded-full bg-green-500/80 hover:bg-green-500 border-2 border-green-500/50 text-white shadow-2xl backdrop-blur-sm transition-all flex items-center justify-center"
              >
                <Phone className="w-8 h-8" />
              </motion.button>
            </div>

            {/* Debug info */}
            <div className="text-xs text-white/60 text-center w-full">
              <div>Call ID: {call.id.slice(-8)}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CallModal;

