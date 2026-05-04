import { useCall } from '../../hooks/useCall';
import { Phone, PhoneMissed, Clock, Download, Upload, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import AppShell from '../../components/AppShell';
import { useTheme } from '../../context/ThemeContext';

const CallsPage = () => {
  const { theme, setTheme, isDark } = useTheme();
  const { currentCall, incomingCalls, callDuration } = useCall();

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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
   
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
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone size={20} />
                Recent Calls
              </h3>
              <button className="text-xs font-medium px-3 py-1 rounded-lg hover:bg-white/10 transition-all">
                Clear All
              </button>
            </div>

            <div className="space-y-2">
              {calls.map((call) => (
                <div
                  key={call.id}
                  className={`rounded-2xl border p-4 flex items-center gap-4 transition-all hover:bg-white/5 ${panelClass}`}
                >
                  {/* Avatar and Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-lg">
                      {call.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        call.type === 'incoming'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}
                    >
                      {call.type === 'incoming' ? (
                        <Download size={12} />
                      ) : (
                        <Upload size={12} />
                      )}
                    </div>
                  </div>

                  {/* Call Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold">{call.name}</h4>
                    <div className="text-sm opacity-60 mt-1 flex items-center gap-2">
                      <Clock size={12} />
                      {call.date} at {call.time}
                    </div>
                  </div>

                  {/* Duration and Actions */}
                  <div className="text-right flex-shrink-0">
                    {call.status === 'missed' ? (
                      <div className="flex items-center gap-1 text-red-500 text-sm font-medium">
                        <PhoneMissed size={14} />
                        Missed
                      </div>
                    ) : (
                      <p className="text-sm opacity-60">{call.duration}</p>
                    )}
                    <button 
                      onClick={() => {}} // TODO: Quick dial
                      className="mt-2 w-12 h-9 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg transition-all flex items-center justify-center"
                      title="Call again"
                    >
                      <Phone size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default CallsPage;
