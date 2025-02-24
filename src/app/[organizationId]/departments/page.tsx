import { DepartmentList } from '@/components/departments/DepartmentList';
import { DepartmentFilters } from '@/components/departments/DepartmentFilters';
import { DepartmentHierarchy } from '@/components/departments/DepartmentHierarchy';
import { Card, Typography, Button, Space } from 'antd';
import { TeamOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';

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
        <Title level={2}>
          <Space>
            <TeamOutlined />
            Departments
          </Space>
        </Title>
        <Link href={`/${organizationId}/departments/new`} passHref>
          <Button type="primary" icon={<PlusOutlined />}>
            Add Department
          </Button>
        </Link>
      </div>

      <DepartmentHierarchy organizationId={organizationId} />

      <Card>
        <DepartmentFilters organizationId={organizationId} />
      </Card>

      <Card>
        <DepartmentList organizationId={organizationId} />
      </Card>
    </div>
  );
} 