import React, { useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { format } from 'date-fns';

const NotificationList = () => {
  const { notifications, loading, error, fetchNotifications } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <div className="text-center py-4">Đang tải thông báo...</div>;
  if (error) return <div className="text-red-500 py-4">{error}</div>;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Thông báo của bạn</h2>
      
      {notifications.length === 0 ? (
        <div className="text-gray-500">Bạn chưa có thông báo nào</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">{notification.title}</h3>
                <span className="text-sm text-gray-500">
                  {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{notification.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};