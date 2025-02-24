import { NotificationList } from '@/components/notifications/NotificationList';
import { Typography, Card, Tabs } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface NotificationsPageProps {
  params: {
    organizationId: string;
  };
}

export default function NotificationsPage({ params }: NotificationsPageProps) {
  const organizationId = parseInt(params.organizationId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BellOutlined className="text-2xl" />
        <Title level={2} className="!mb-0">Notifications</Title>
      </div>

      <Card>
        <Tabs
          items={[
            {
              key: 'unread',
              label: 'Unread',
              children: <NotificationList organizationId={organizationId} unreadOnly />,
            },
            {
              key: 'all',
              label: 'All Notifications',
              children: <NotificationList organizationId={organizationId} />,
            },
          ]}
        />
      </Card>
    </div>
  );
} 