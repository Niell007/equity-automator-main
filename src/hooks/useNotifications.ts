import { useState, useEffect } from 'react';
import { WebSocketService } from '@/lib/services/websocket';
import { PushNotificationService } from '@/lib/services/pushNotification';
import { NotificationSoundService } from '@/lib/services/notificationSound';
import { Notification } from '@/lib/db/schema';
import { message } from 'antd';

export function useNotifications(organizationId: number, userId: number) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    // Initialize notification sound service
    NotificationSoundService.initialize();

    // Request push notification permission
    const requestPushPermission = async () => {
      const granted = await PushNotificationService.requestPermission();
      setPushEnabled(granted);
    };
    requestPushPermission();

    // Initialize WebSocket connection
    WebSocketService.initialize(organizationId, userId);

    // Cleanup on unmount
    return () => {
      WebSocketService.close();
      NotificationSoundService.cleanup();
    };
  }, [organizationId, userId]);

  useEffect(() => {
    // Subscribe to notification events
    const unsubscribe = WebSocketService.subscribe('notification', async (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      // Play notification sound based on type
      const soundType = notification.type.toLowerCase() as 'success' | 'warning' | 'error' | 'default';
      await NotificationSoundService.playSound(soundType);

      // Show in-app notification
      message.info({
        content: notification.message,
        duration: 4.5,
        onClick: () => {
          if (notification.link) {
            window.location.href = notification.link;
          }
        },
      });

      // Show push notification if enabled and window is not focused
      if (pushEnabled && !document.hasFocus()) {
        PushNotificationService.showNotification(notification.title, {
          body: notification.message,
          data: { url: notification.link },
          tag: `notification-${notification.id}`,
          renotify: true,
          silent: true, // Disable default browser sound since we're using our own
        });
      }
    });

    // Fetch initial notifications
    fetchNotifications();

    return () => {
      unsubscribe();
    };
  }, [organizationId, userId, pushEnabled]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/notifications?unreadOnly=false`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setNotifications(result.data);
      setUnreadCount(result.data.filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      message.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds: number[]) => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notificationIds.includes(notification.id)
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prev) => prev - notificationIds.length);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      message.error('Failed to mark notifications as read');
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    refresh: fetchNotifications,
  };
} 