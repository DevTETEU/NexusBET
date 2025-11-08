
import React from 'react';
import { useNotifier } from '../context/NotificationContext';
import { Notification } from '../types';

const Toast: React.FC<{ notification: Notification }> = ({ notification }) => {
  const baseClasses = 'w-full max-w-sm p-4 rounded-lg shadow-lg text-white text-sm font-semibold transition-all duration-300 transform';
  const typeClasses = {
    success: 'bg-green-500/90 backdrop-blur-sm',
    error: 'bg-red-500/90 backdrop-blur-sm',
    info: 'bg-blue-500/90 backdrop-blur-sm',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[notification.type]}`}>
      {notification.message}
    </div>
  );
};


const ToastContainer: React.FC = () => {
  const { notifications } = useNotifier();

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {notifications.map(n => (
        <Toast key={n.id} notification={n} />
      ))}
    </div>
  );
};

export default ToastContainer;
