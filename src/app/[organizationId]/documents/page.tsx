import { DocumentManager } from '@/components/documents/DocumentManager';
import { Typography } from 'antd';

const { Title } = Typography;

interface DocumentsPageProps {
  params: {
    organizationId: string;
  };
}

export default function DocumentsPage({ params }: DocumentsPageProps) {
  const organizationId = parseInt(params.organizationId);

  return (
    <div className="space-y-6">
      <Title level={2}>Document Management</Title>
      <DocumentManager organizationId={organizationId} />
    </div>
  );
} 