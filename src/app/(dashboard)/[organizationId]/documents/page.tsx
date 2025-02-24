import { Card, Typography, Divider } from 'antd';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { DocumentList } from '@/components/documents/DocumentList';
import { FolderOpenOutlined } from '@ant-design/icons';

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
      <div className="flex items-center space-x-2">
        <FolderOpenOutlined className="text-2xl text-blue-500" />
        <Title level={2} className="!mb-0">
          Document Management
        </Title>
      </div>

      <Card title="Upload Document" className="shadow-sm">
        <DocumentUpload organizationId={organizationId} />
      </Card>

      <Divider />

      <Card title="Documents" className="shadow-sm">
        <DocumentList organizationId={organizationId} />
      </Card>
    </div>
  );
} 