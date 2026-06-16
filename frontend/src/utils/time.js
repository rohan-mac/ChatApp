export const formatClockTime = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(value));
};

export const formatMessageTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startOfToday - startOfTarget) / 86400000);

  if (diffDays === 0) return formatClockTime(date);
  if (diffDays === 1) return 'Yesterday';

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short'
  }).format(date);
};
