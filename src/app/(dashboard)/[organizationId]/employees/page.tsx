import { Card, Typography, Button, Space } from 'antd';
import {
  TeamOutlined,
  UserAddOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { EmployeeList } from '@/components/employees/EmployeeList';
import { EmployeeFilters } from '@/components/employees/EmployeeFilters';

const { Title } = Typography;

interface EmployeesPageProps {
  params: {
    organizationId: string;
  };
}

export default function EmployeesPage({ params }: EmployeesPageProps) {
  const organizationId = parseInt(params.organizationId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <TeamOutlined className="text-2xl text-blue-500" />
          <Title level={2} className="!mb-0">
            Employees
          </Title>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            href={`/${organizationId}/employees/new`}
          >
            Add Employee
          </Button>
          <Button
            icon={<UploadOutlined />}
            href={`/${organizationId}/employees/import`}
          >
            Import
          </Button>
          <Button
            icon={<DownloadOutlined />}
            href={`/api/organizations/${organizationId}/employees/export`}
            target="_blank"
          >
            Export
          </Button>
        </Space>
      </div>

      <Card title="Filters" className="shadow-sm">
        <EmployeeFilters organizationId={organizationId} />
      </Card>

      <Card title="Employee List" className="shadow-sm">
        <EmployeeList organizationId={organizationId} />
      </Card>
    </div>
  );
} 