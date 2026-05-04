import { useState } from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import AppShell from '../../components/AppShell';
import { useTheme } from '../../context/ThemeContext';

const CalendarPage = () => {
  const { theme, setTheme, isDark } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const events = [
    {
      id: 1,
      title: 'Team Meeting',
      date: new Date(2026, 4, 4),
      time: '10:00 AM',
      location: 'Conference Room A',
      attendees: 5,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Project Review',
      date: new Date(2026, 4, 5),
      time: '2:30 PM',
      location: 'Virtual - Zoom',
      attendees: 8,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      title: 'Client Call',
      date: new Date(2026, 4, 6),
      time: '11:00 AM',
      location: 'Office - Room 3',
      attendees: 3,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      title: 'Lunch with Team',
      date: new Date(2026, 4, 7),
      time: '12:30 PM',
      location: 'Downtown Café',
      attendees: 6,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const panelClass = isDark
    ? 'border-white/10 bg-white/5'
    : 'border-white/70 bg-white/85';

  return (
    <AppShell
      title="Calendar"
      subtitle="View and manage your events"
      theme={theme}
      onThemeSelect={setTheme}
      showMobileBottomNav={true}
    >
      <div className="minimal-scrollbar flex-1 overflow-y-auto px-3 py-3 sm:px-4 md:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Mini Calendar */}
          <div className={`rounded-3xl border p-6 ${panelClass}`}>
            <h3 className="mb-4 font-semibold flex items-center gap-2">
              <Calendar size={18} />
              May 2026
            </h3>
            <div className="space-y-2 text-sm">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center opacity-60 font-medium">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDate(new Date(2026, 4, i + 1))}
                  className={`w-full rounded-lg py-2 transition-all ${
                    selectedDate.getDate() === i + 1
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold'
                      : `${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div className="lg:col-span-2 space-y-3">
            <div className={`rounded-3xl border p-6 ${panelClass}`}>
              <h3 className="mb-4 font-semibold text-lg">Upcoming Events</h3>
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`rounded-2xl border p-4 transition-all hover:shadow-lg ${panelClass}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`rounded-xl bg-gradient-to-br ${event.color} p-3 text-white flex-shrink-0`}>
                        <Calendar size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">{event.title}</h4>
                        <div className="mt-2 space-y-1 text-sm opacity-75">
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={14} />
                            {event.attendees} attendees
                          </div>
                        </div>
                      </div>
                      <button className="flex-shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 text-xs font-medium text-white hover:shadow-lg transition-all">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default CalendarPage;
