import { useState, useEffect, useCallback } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, Video, User, Mic, Volume2, X } from 'lucide-react';
import { useCall } from '../../context/CallContext';
import { Z_INDEX } from '../../constants/zIndex';

const CallModal = () => {
  const { incomingCalls, currentCall, rejectCall, acceptCall, endCall, isInCall } = useCall();
  const { user: currentUser } = useAuth();
  const chatStore = useChatStore();
  const [targetUser, setTargetUser] = useState(null);
  const [visibleCalls, setVisibleCalls] = useState([]);

  // Show incoming or outgoing call
  useEffect(() => {
    let callData = null;
    
    if (incomingCalls.length > 0 && !isInCall) {
      const latest = incomingCalls[incomingCalls.length - 1];
      callData = { ...latest, isIncoming: true };
      // Auto reject incoming after 30s
      const timeout = setTimeout(() => rejectCall(latest.id, 'timeout'), 30000);
      return () => clearTimeout(timeout);
    } else if (currentCall?.status === 'calling') {
      callData = { ...currentCall, isIncoming: false };
    }
    
    if (callData) {
      // Find real user data
      const chat = chatStore.chats.find(c => c._id === callData.chatId);
      const counterpart = chat?.counterpart || chatStore.people.find(p => p._id === callData.peerId);
      setTargetUser(counterpart);
      setVisibleCalls([callData]);
    } else {
      setVisibleCalls([]);
      setTargetUser(null);
    }
  }, [incomingCalls, currentCall, isInCall, rejectCall, chatStore.chats, chatStore.people]);

  const handleAccept = useCallback((call) => {
    acceptCall(call.id);
  }, [acceptCall]);

  const handleReject = useCallback((callId) => {
    rejectCall(callId);
  }, [rejectCall]);

  if (visibleCalls.length === 0) return null;

  const call = visibleCalls[0];
  const isIncoming = call.isIncoming;
  const targetName = targetUser?.name || call.peerId?.slice(-8) || 'Unknown';
  const avatarSrc = targetUser?.profilePic;
  
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
            <div className="w-24 h-24 rounded-full shadow-2xl border-4 border-white/20 overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-500">
              {avatarSrc ? (
                <img src={avatarSrc} alt={targetName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                  {targetName[0]?.toUpperCase() || <User />}
                </div>
              )}
            </div>

            {/* Caller info */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">
                {isIncoming ? `Incoming ${call.type} Call` : 'Calling...'}
              </h2>
              <p className="text-cyan-400 text-lg font-semibold">{targetName}</p>
            </div>

            {/* Call type icon */}
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Icon className="w-16 h-16 text-cyan-400 mx-auto" />
            </div>

            {/* Controls */}
            <div className="flex gap-6 pt-4">
              {isIncoming ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReject(call.id)}
                    className="p-4 rounded-full bg-red-500/20 hover:bg-red-500/40 border-2 border-red-500/50 text-red-100 backdrop-blur-sm transition-all flex items-center justify-center flex-1 max-w-xs"
                  >
                    <X className="w-8 h-8" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAccept(call)}
                    className="p-4 rounded-full bg-green-500/80 hover:bg-green-500 border-2 border-green-500/50 text-white shadow-2xl backdrop-blur-sm transition-all flex items-center justify-center flex-1 max-w-xs"
                  >
                    <Phone className="w-8 h-8" />
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => endCall('user-cancelled')}
                  className="p-4 rounded-full bg-red-500/80 hover:bg-red-500 border-2 border-red-500/50 text-white shadow-2xl backdrop-blur-sm transition-all flex items-center justify-center w-full max-w-sm"
                >
                  <X className="w-8 h-8" />
                </motion.button>
              )}
            </div>

            {/* Status/Call ID */}
            <div className="text-xs text-white/60 text-center w-full">
              <div>{isIncoming ? 'Ringing...' : 'Trying to connect...'}</div>
              <div>Call ID: {call.id.slice(-8)}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CallModal;

