import { Card, Typography, Button, Space } from 'antd';
import {
  TeamOutlined,
  PlusOutlined,
  PartitionOutlined,
} from '@ant-design/icons';
import { DepartmentList } from '@/components/departments/DepartmentList';
import { DepartmentFilters } from '@/components/departments/DepartmentFilters';
import { DepartmentHierarchy } from '@/components/departments/DepartmentHierarchy';

const { Title } = Typography;

interface DepartmentsPageProps {
  params: {
    organizationId: string;
  };
}

export default function DepartmentsPage({ params }: DepartmentsPageProps) {
  const organizationId = parseInt(params.organizationId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <PartitionOutlined className="text-2xl text-blue-500" />
          <Title level={2} className="!mb-0">
            Departments
          </Title>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            href={`/${organizationId}/departments/new`}
          >
            Add Department
          </Button>
        </Space>
      </div>

      <DepartmentHierarchy organizationId={organizationId} />

      <Card title="Filters" className="shadow-sm">
        <DepartmentFilters organizationId={organizationId} />
      </Card>

      <Card title="Department List" className="shadow-sm">
        <DepartmentList organizationId={organizationId} />
      </Card>
    </div>
  );
} 