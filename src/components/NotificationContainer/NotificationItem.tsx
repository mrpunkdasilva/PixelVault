import React, { useEffect, useState } from 'react';
import { Notification, useNotifications } from '../../contexts/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { removeNotification } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300);
  };

  const handleAction = () => {
    if (notification.action) {
      notification.action.onClick();
      handleClose();
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
            <path
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        );
      case 'error':
        return (
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
            <path
              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        );
      case 'warning':
        return (
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
            <path
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        );
      case 'info':
        return (
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
            <path
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`notification-item notification-item--${notification.type} ${
        isVisible ? 'notification-item--visible' : ''
      } ${isExiting ? 'notification-item--exiting' : ''}`}
    >
      <div className='notification-item__icon'>{getIcon()}</div>

      <div className='notification-item__content'>
        <div className='notification-item__title'>{notification.title}</div>
        {notification.message && (
          <div className='notification-item__message'>{notification.message}</div>
        )}
      </div>

      <div className='notification-item__actions'>
        {notification.action && (
          <button className='notification-item__action-button' onClick={handleAction}>
            {notification.action.label}
          </button>
        )}

        <button
          className='notification-item__close-button'
          onClick={handleClose}
          aria-label='Close notification'
        >
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
            <path
              d='M6 18L18 6M6 6l12 12'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
