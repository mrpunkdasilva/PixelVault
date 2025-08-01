import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationItem } from './atoms/NotificationItem.tsx';
import './styles.scss';

export const NotificationContainer: React.FC = () => {
  const { notifications } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className='notification-container'>
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};
