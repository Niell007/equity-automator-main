import { Card, Typography, Space, Button, DatePicker } from 'antd';
import { AuditOutlined, DownloadOutlined } from '@ant-design/icons';
import { AuditLogList } from '@/components/audit/AuditLogList';
import { AuditLogFilters } from '@/components/audit/AuditLogFilters';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface AuditPageProps {
  params: {
    organizationId: string;
  };
}

export default function AuditPage({ params }: AuditPageProps) {
  const organizationId = parseInt(params.organizationId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <AuditOutlined className="text-2xl text-blue-500" />
          <Title level={2} className="!mb-0">
            Audit Logs
          </Title>
        </div>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          href={`/api/organizations/${organizationId}/audit/export`}
          target="_blank"
        >
          Export Logs
        </Button>
      </div>

      <Card title="Filters" className="shadow-sm">
        <AuditLogFilters organizationId={organizationId} />
      </Card>

      <Card title="Activity Log" className="shadow-sm">
        <AuditLogList organizationId={organizationId} />
      </Card>
    </div>
  );
} 