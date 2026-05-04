/**
 * Browser Notification Service
 * Handles Web Notifications API for desktop notifications
 */

class NotificationService {
  constructor() {
    this.supported = 'Notification' in window;
    this.permission = this.supported ? Notification.permission : 'denied';
  }

  /**
   * Request permission from user for notifications
   * @returns {Promise<string>} permission status: 'granted', 'denied', or 'default'
   */
  async requestPermission() {
    if (!this.supported) {
      console.warn('Browser notifications not supported');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    if (this.permission === 'denied') {
      console.warn('User has denied notification permission');
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      this.permission = result;
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Check if notifications are available and permitted
   * @returns {boolean}
   */
  isAvailable() {
    return this.supported && this.permission === 'granted';
  }

  /**
   * Show a notification
   * @param {string} title - Notification title
   * @param {Object} options - Notification options
   * @returns {Notification|null}
   */
  show(title, options = {}) {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const notification = new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options
      });

      // Close notification after 5 seconds if not already closed
      setTimeout(() => {
        if (notification) notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  /**
   * Show a message notification
   * @param {Object} message - Message object
   * @param {Object} chat - Chat object
   * @param {string} senderName - Name of the message sender
   */
  notifyNewMessage(message, chat, senderName) {
    if (!this.isAvailable()) {
      return null;
    }

    const title = `${senderName || 'New Message'}`;
    const body = message.text || message.content || 'Sent an attachment';
    
    const notification = this.show(title, {
      body: body.length > 50 ? `${body.substring(0, 50)}...` : body,
      tag: `message-${chat?._id}`,
      requireInteraction: false,
      data: {
        chatId: chat?._id,
        messageId: message._id,
        url: `/chat?id=${chat?._id}`
      }
    });

    // Handle notification click
    if (notification) {
      notification.onclick = () => {
        window.focus();
        // Navigate to the chat
        window.location.hash = `#/chat?id=${chat?._id}`;
        notification.close();
      };
    }

    return notification;
  }

  /**
   * Initialize notifications service (call on app startup)
   * Auto-requests permission if not already asked
   */
  async initialize() {
    if (!this.supported) {
      console.info('Browser notifications not supported in this environment');
      return;
    }

    // If permission is default (not yet asked), show a toast or request it
    if (this.permission === 'default') {
      // You can auto-request or let the app decide
      console.info('Notifications not yet configured');
    }
  }

  /**
   * Manually request permission with a reason
   * @param {string} reason - Why the app needs notifications
   * @returns {Promise<boolean>}
   */
  async requestPermissionWithReason(reason = 'to receive message notifications') {
    const result = await this.requestPermission();
    return result === 'granted';
  }
}

export const notificationService = new NotificationService();

export default notificationService;
