import { ComplianceReports } from '@/components/reports/ComplianceReports';
import { Typography } from 'antd';

const { Title } = Typography;

interface ReportsPageProps {
  params: {
    organizationId: string;
  };
}

export default function ReportsPage({ params }: ReportsPageProps) {
  const organizationId = parseInt(params.organizationId);

  return (
    <div className="space-y-6">
      <Title level={2}>Compliance Reports</Title>
      <ComplianceReports organizationId={organizationId} />
    </div>
  );
} 