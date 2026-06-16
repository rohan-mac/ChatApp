import { AlertCircle, Check, CheckCheck, Clock3 } from 'lucide-react';

const hasUser = (list = [], id) => list.some((entry) => (entry?._id || entry) === id);

const getStatus = (message, currentUserId) => {
  if (message.failed || message.status === 'failed') return 'failed';
  if (message.pending || message.status === 'pending' || !message._id) return 'pending';
  if (hasUser(message.seenBy, currentUserId) || message.status === 'seen' || message.readAt) return 'seen';
  if (message.deliveredAt || message.status === 'delivered' || message.delivered) return 'delivered';
  return 'sent';
};

const MessageStatus = ({ message, currentUserId }) => {
  const status = getStatus(message, currentUserId);
  const classes = status === 'seen' ? 'text-[#53BDEB]' : status === 'failed' ? 'text-rose-500' : 'text-current';

  if (status === 'pending') return <Clock3 size={13} className="opacity-80" aria-label="Pending" />;
  if (status === 'failed') return <AlertCircle size={13} className={classes} aria-label="Failed" />;
  if (status === 'sent') return <Check size={14} className={classes} aria-label="Sent" />;
  return <CheckCheck size={15} className={classes} aria-label={status === 'seen' ? 'Seen' : 'Delivered'} />;
};

export default MessageStatus;
