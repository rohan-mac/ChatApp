import { useCallStore } from '../../store/callStore';
import { useChatStore } from '../../store/chatStore';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Phone, PhoneMissed, Clock, ChevronLeft, PhoneIncoming, PhoneOutgoing, User } from 'lucide-react';
// import AppShell from '../../components/AppShell';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {  Download, Upload } from 'lucide-react';
import AppShell from '../../components/AppShell';
// import { useTheme } from '../../context/ThemeContext';

const CallsPage = () => {
  const callStore = useCallStore();
  const chatStore = useChatStore();
  const { user } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const navigate = useNavigate();
  
  const { callHistory, clearHistory } = callStore;

  // Demo calls from store + mock recent
  // const calls = [
  //   ...(currentCall ? [{
  //     id: 'active',
  //     name: 'Active call',
  //     type: 'outgoing',
  //     status: 'active',
  //     duration: formatDuration(callDuration),
  //     avatar: '📞'
  //   }] : []),
  //   ...incomingCalls.slice(-3).map(call => ({
  //     id: call.id,
  //     name: 'Incoming',
  //     type: 'incoming',
  //     status: 'ringing',
  //     avatar: '📱'
  //   }))
  // ];

  const formatDuration = (seconds) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      month: 'short',
      day: 'numeric' 
    });
  };

  const getCallUser = (call) => {
    const chat = chatStore.chats.find(c => c._id === call.chatId);
    return chat?.counterpart || { name: call.peerId?.slice(-8), profilePic: null };
  };

  const calls = callHistory.slice().reverse().map(call => ({
    ...call,
    user: getCallUser(call),
    time: formatTime(call.timestamp)
  })); 
   
  const panelClass = isDark
    ? 'border-white/10 bg-white/5'
    : 'border-white/70 bg-white/85';

  return (
    <AppShell
      title="Calls"
      subtitle="Your call history"
      theme={theme}
      onThemeSelect={setTheme}
      showMobileBottomNav={true}
    >
      <div className="minimal-scrollbar flex-1 overflow-y-auto px-3 py-3 sm:px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className={`rounded-3xl border p-6 ${panelClass}`}>
            <div className="flex items-center justify-between mb-6">
              <motion.div 
                className="text-lg font-semibold flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Phone size={20} />
                Recent Calls ({calls.length})
              </motion.div>
              {calls.length > 0 && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearHistory}
                  className="text-xs font-medium px-3 py-1 rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  Clear All
                </motion.button>
              )}
            </div>

            <div className="space-y-2">
              {calls.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-12 text-center rounded-2xl ${panelClass}`}
                >
                  <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium text-gray-400">No recent calls</p>
                  <p className="text-sm text-gray-500 mt-1">Call history will appear here</p>
                </motion.div>
              ) : (
                calls.map((call, index) => (
                  <motion.div
                    key={call.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-2xl border p-4 cursor-pointer hover:bg-white/10 transition-all group ${panelClass}`}
                    onClick={() => navigate(`/chat/${call.chatId}`)}
                  >
                    {/* Avatar and Direction Icon */}
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white/20">
                          {call.user.profilePic ? (
                            <img src={call.user.profilePic} alt={call.user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                              {call.user.name[0]?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg text-white text-xs font-bold backdrop-blur-sm ${
                          call.direction === 'outgoing'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}>
                          {call.direction === 'outgoing' ? <PhoneOutgoing size={12} /> : <PhoneIncoming size={12} />}
                        </div>
                      </div>

                      {/* Call Details */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">{call.user.name}</div>
                        <div className="text-sm opacity-70 flex items-center gap-2 mt-1">
                          <Clock size={12} />
                          {call.time}
                          {call.duration > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-white/10 rounded-full text-xs">
                              {formatDuration(call.duration)}
                            </span>
                          )}
                        </div>
                        {call.reason === 'rejected' && (
                          <div className="flex items-center gap-1 text-red-400 text-xs mt-1">
                            <PhoneMissed size={12} />
                            <span>Declined</span>
                          </div>
                        )}
                      </div>

                      {/* Quick Redial */}
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          startCall(call.peerId, call.type, call.chatId);
                        }}
                        className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg hover:shadow-xl transition-all ml-auto"
                        title="Call again"
                      >
                        <Phone size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default CallsPage;
