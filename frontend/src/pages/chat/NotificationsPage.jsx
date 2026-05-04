import { useEffect, useState } from 'react';
import { Bell, Trash2, Check, Clock, MessageSquare } from 'lucide-react';
import AppShell from '../../components/AppShell';
import { useTheme } from '../../context/ThemeContext';
import { useChatStore } from '../../store/chatStore';

const NotificationsPage = () => {
  const { theme, setTheme, isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const chats = useChatStore((state) => state.chats);

  // Load real notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('app_notifications');
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch {
        setNotifications([]);
      }
    }
  }, []);

  // Generate notifications from chat messages
  useEffect(() => {
    if (chats.length === 0) return;

    const realNotifications = chats
      .filter((chat) => chat.lastMessageId)
      .map((chat) => {
        const message = chat.lastMessageId;
        const sender = chat.counterpart;
        return {
          id: `notif_${chat._id}`,
          type: 'message',
          user: sender?.name || 'Unknown User',
          action: 'sent you a message',
          message: message.text || message.content || 'Attachment received',
          timestamp: new Date(message.createdAt).toLocaleString(),
          read: !chat.unreadCount,
          icon: MessageSquare,
          color: 'from-blue-500 to-cyan-500',
          avatar: (sender?.name || 'U')[0]
        };
      });

    setNotifications(realNotifications);
  }, [chats]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const panelClass = isDark
    ? 'border-white/10 bg-white/5'
    : 'border-white/70 bg-white/85';

  return (
    <AppShell
      title="Notifications"
      subtitle="Stay updated with what's new"
      theme={theme}
      onThemeSelect={setTheme}
      showMobileBottomNav={true}
    >
      <div className="minimal-scrollbar flex-1 overflow-y-auto px-3 py-3 sm:px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className={`rounded-3xl border p-6 ${panelClass}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium px-3 py-1 rounded-lg hover:bg-white/10 transition-all flex items-center gap-1"
                >
                  <Check size={14} />
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12 opacity-60">
                  <Bell size={32} className="mx-auto mb-2 opacity-40" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`rounded-2xl border p-4 transition-all ${
                        notification.read
                          ? panelClass
                          : `${panelClass} ring-1 ring-blue-500/30 bg-blue-500/5`
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`rounded-xl bg-gradient-to-br ${notification.color} p-3 text-white flex-shrink-0`}>
                          <IconComponent size={18} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold">
                                {notification.user}
                              </h4>
                              <p className="text-sm opacity-75 mt-1">
                                {notification.action}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex-shrink-0 mt-2" />
                            )}
                          </div>

                          <p className="text-sm mt-2 opacity-60 italic">
                            "{notification.message}"
                          </p>

                          <div className="flex items-center gap-2 mt-3 text-xs opacity-50">
                            <Clock size={12} />
                            {notification.timestamp}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 rounded-lg hover:bg-white/10 transition-all text-green-500"
                              title="Mark as read"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-all opacity-60 hover:opacity-100 text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default NotificationsPage;
