import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { Typography } from 'antd';

const { Title } = Typography;

interface DashboardPageProps {
  params: {
    organizationId: string;
  };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const organizationId = parseInt(params.organizationId);

  return (
    <div className="space-y-6">
      <Title level={2}>Dashboard</Title>
      <DashboardOverview organizationId={organizationId} />
    </div>
  );
} 