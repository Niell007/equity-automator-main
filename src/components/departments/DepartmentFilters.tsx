import { Form, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

const { Option } = Select;

interface DepartmentFiltersProps {
  organizationId: number;
}

export function DepartmentFilters({ organizationId }: DepartmentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();

  const handleFilter = (values: any) => {
    const params = new URLSearchParams();

    if (values.search) {
      params.set('search', values.search);
    }
    if (values.status) {
      params.set('status', values.status);
    }
    if (values.parentDepartmentId) {
      params.set('parentDepartmentId', values.parentDepartmentId);
    }

    router.push(`/${organizationId}/departments?${params.toString()}`);
  };

  const handleReset = () => {
    form.resetFields();
    router.push(`/${organizationId}/departments`);
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={handleFilter}
      initialValues={{
        search: searchParams.get('search') || undefined,
        status: searchParams.get('status') || undefined,
        parentDepartmentId: searchParams.get('parentDepartmentId') || undefined,
      }}
    >
      <Form.Item name="search">
        <Input
          placeholder="Search by name or code"
          style={{ width: 200 }}
          allowClear
        />
      </Form.Item>

      <Form.Item name="status">
        <Select
          style={{ width: 200 }}
          allowClear
          placeholder="Select status"
        >
          <Option value="ACTIVE">Active</Option>
          <Option value="INACTIVE">Inactive</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
          >
            Search
          </Button>
          <Button
            onClick={handleReset}
            icon={<ClearOutlined />}
          >
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
} 