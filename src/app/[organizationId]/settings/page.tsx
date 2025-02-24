import { OrganizationSettings } from '@/components/settings/OrganizationSettings';
import { Typography } from 'antd';

const { Title } = Typography;

interface SettingsPageProps {
  params: {
    organizationId: string;
  };
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const organizationId = parseInt(params.organizationId);

  return (
    <div className="space-y-6">
      <Title level={2}>Organization Settings</Title>
      <OrganizationSettings organizationId={organizationId} />
    </div>
  );
} 