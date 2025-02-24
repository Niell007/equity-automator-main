import { useState } from 'react';
import { List, Badge, Button, Space, Tag, Typography } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Notification } from '@/lib/db/schema';
import { useNotifications } from '@/hooks/useNotifications';
import { useSession } from 'next-auth/react';

const { Text } = Typography;

interface NotificationListProps {
  organizationId: number;
  unreadOnly?: boolean;
}

export function NotificationList({ organizationId, unreadOnly = false }: NotificationListProps) {
  const { data: session } = useSession();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // Get user ID from session, fallback to 0 if not available
  const userId = session?.user?.id ? Number(session.user.id) : 0;
  
  const {
    notifications,
    loading,
    markAsRead,
  } = useNotifications(organizationId, userId);

  const filteredNotifications = unreadOnly
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const handleMarkAsRead = async () => {
    if (selectedItems.length === 0) return;
    await markAsRead(selectedItems);
    setSelectedItems([]);
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return 'success';
      case 'WARNING':
        return 'warning';
      case 'ERROR':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderNotificationContent = (item: Notification) => (
    <div>
      <Space direction="vertical" size={2}>
        <Space>
          <Tag color={getNotificationTypeColor(item.type)}>{item.type}</Tag>
          <Text strong>{item.title}</Text>
        </Space>
        <Text type="secondary">{item.message}</Text>
      </Space>
    </div>
  );

  return (
    <div className="space-y-4">
      {filteredNotifications.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <Badge count={selectedItems.length} />
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleMarkAsRead}
            disabled={selectedItems.length === 0}
          >
            Mark as Read
          </Button>
        </div>
      )}

      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={filteredNotifications}
        locale={{
          emptyText: (
            <div className="py-8 text-center">
              <BellOutlined style={{ fontSize: 24 }} className="text-gray-400 mb-2" />
              <div className="text-gray-500">No notifications</div>
            </div>
          ),
        }}
        renderItem={(item) => (
          <List.Item
            className={`cursor-pointer transition-colors ${
              !item.isRead ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
            }`}
            onClick={() => {
              if (!item.isRead) {
                setSelectedItems((prev) =>
                  prev.includes(item.id)
                    ? prev.filter((id) => id !== item.id)
                    : [...prev, item.id]
                );
              }
            }}
          >
            {item.link ? (
              <Link href={item.link} className="w-full">
                {renderNotificationContent(item)}
              </Link>
            ) : (
              renderNotificationContent(item)
            )}
          </List.Item>
        )}
      />
    </div>
  );
} 