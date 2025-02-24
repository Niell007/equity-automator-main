import { Form, Input, Select, DatePicker, Button, Space } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface EmployeeFiltersProps {
  organizationId: number;
}

export function EmployeeFilters({ organizationId }: EmployeeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();

  const departments = [
    'Human Resources',
    'Finance',
    'Operations',
    'Sales',
    'Marketing',
    'IT',
    'Legal',
  ];

  const handleFilter = (values: any) => {
    const params = new URLSearchParams();

    if (values.search) {
      params.set('search', values.search);
    }
    if (values.department) {
      params.set('department', values.department);
    }
    if (values.status) {
      params.set('status', values.status);
    }
    if (values.dateRange) {
      params.set('startDate', values.dateRange[0].toISOString());
      params.set('endDate', values.dateRange[1].toISOString());
    }
    if (values.salaryRange) {
      params.set('minSalary', values.salaryRange[0].toString());
      params.set('maxSalary', values.salaryRange[1].toString());
    }

    router.push(`/${organizationId}/employees?${params.toString()}`);
  };

  const handleReset = () => {
    form.resetFields();
    router.push(`/${organizationId}/employees`);
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={handleFilter}
      initialValues={{
        search: searchParams.get('search') || undefined,
        department: searchParams.get('department') || undefined,
        status: searchParams.get('status') || undefined,
        dateRange: searchParams.has('startDate')
          ? [
              new Date(searchParams.get('startDate')!),
              new Date(searchParams.get('endDate')!),
            ]
          : undefined,
        salaryRange: searchParams.has('minSalary')
          ? [
              parseInt(searchParams.get('minSalary')!),
              parseInt(searchParams.get('maxSalary')!),
            ]
          : undefined,
      }}
    >
      <Form.Item name="search">
        <Input
          placeholder="Search by name or ID"
          style={{ width: 200 }}
          allowClear
        />
      </Form.Item>

      <Form.Item name="department">
        <Select
          style={{ width: 200 }}
          allowClear
          placeholder="Select department"
        >
          {departments.map((dept) => (
            <Option key={dept} value={dept}>
              {dept}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="status">
        <Select
          style={{ width: 200 }}
          allowClear
          placeholder="Select status"
        >
          <Option value="ACTIVE">Active</Option>
          <Option value="TERMINATED">Terminated</Option>
          <Option value="ON_LEAVE">On Leave</Option>
        </Select>
      </Form.Item>

      <Form.Item name="dateRange" label="Start Date">
        <RangePicker />
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