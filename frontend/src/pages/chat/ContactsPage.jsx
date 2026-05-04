import { useState } from 'react';
import { Users, Phone, Mail, MessageCircle, MoreVertical, Search } from 'lucide-react';
import AppShell from '../../components/AppShell';
import { useTheme } from '../../context/ThemeContext';

const ContactsPage = () => {
  const { theme, setTheme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const contacts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      status: 'online',
      avatar: '👩‍💼'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '+1 (555) 345-6789',
      status: 'online',
      avatar: '👨‍💻'
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '+1 (555) 456-7890',
      status: 'away',
      avatar: '👩‍🦰'
    },
    {
      id: 4,
      name: 'Alex Turner',
      email: 'alex@example.com',
      phone: '+1 (555) 567-8901',
      status: 'online',
      avatar: '👨‍🔬'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      phone: '+1 (555) 678-9012',
      status: 'offline',
      avatar: '👩‍🎓'
    },
    {
      id: 6,
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+1 (555) 789-0123',
      status: 'online',
      avatar: '👨‍⚕️'
    }
  ];

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const panelClass = isDark
    ? 'border-white/10 bg-white/5'
    : 'border-white/70 bg-white/85';

  return (
    <AppShell
      title="Contacts"
      subtitle="Manage your contacts"
      theme={theme}
      onThemeSelect={setTheme}
      showMobileBottomNav={true}
    >
      <div className="minimal-scrollbar flex-1 overflow-y-auto px-3 py-3 sm:px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className={`rounded-3xl border p-4 mb-6 ${panelClass}`}>
            <div className="flex items-center gap-3">
              <Search size={18} className="opacity-60" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 bg-transparent outline-none text-sm ${isDark ? 'text-white placeholder-white/50' : 'text-slate-900 placeholder-slate-500'}`}
              />
            </div>
          </div>

          {/* Contacts Grid */}
          <div className={`rounded-3xl border p-6 ${panelClass}`}>
            <h3 className="mb-6 text-lg font-semibold flex items-center gap-2">
              <Users size={20} />
              {filteredContacts.length} Contacts
            </h3>

            <div className="grid gap-3 md:grid-cols-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`rounded-2xl border p-4 transition-all hover:shadow-lg hover:bg-white/10 ${panelClass}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-lg">
                        {contact.avatar}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white/10 ${
                          contact.status === 'online'
                            ? 'bg-green-500'
                            : contact.status === 'away'
                            ? 'bg-yellow-500'
                            : 'bg-gray-500'
                        }`}
                      />
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{contact.name}</h4>
                      <p className="text-xs opacity-60 truncate">{contact.email}</p>
                      <p className="text-xs opacity-60 mt-1">{contact.phone}</p>
                    </div>

                    {/* Actions */}
                    <button className="flex-shrink-0 opacity-60 hover:opacity-100">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 text-xs font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1">
                      <MessageCircle size={14} />
                      Message
                    </button>
                    <button className="flex-1 rounded-lg border border-white/20 py-2 text-xs font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-1">
                      <Phone size={14} />
                      Call
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

export default ContactsPage;
