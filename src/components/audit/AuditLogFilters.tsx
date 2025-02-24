import { Form, Select, DatePicker, Button, Space } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface AuditLogFiltersProps {
  organizationId: number;
}

export function AuditLogFilters({ organizationId }: AuditLogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();

  const entityTypes = [
    { value: 'employee', label: 'Employee' },
    { value: 'report', label: 'Report' },
    { value: 'document', label: 'Document' },
    { value: 'settings', label: 'Settings' },
  ];

  const actions = [
    { value: 'CREATE', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' },
    { value: 'VIEW', label: 'View' },
    { value: 'EXPORT', label: 'Export' },
    { value: 'SUBMIT', label: 'Submit' },
    { value: 'APPROVE', label: 'Approve' },
    { value: 'REJECT', label: 'Reject' },
  ];

  const handleFilter = (values: any) => {
    const params = new URLSearchParams();
    
    if (values.entityType) {
      params.set('entityType', values.entityType);
    }
    if (values.action) {
      params.set('action', values.action);
    }
    if (values.dateRange) {
      params.set('startDate', values.dateRange[0].toISOString());
      params.set('endDate', values.dateRange[1].toISOString());
    }

    router.push(`/${organizationId}/audit?${params.toString()}`);
  };

  const handleReset = () => {
    form.resetFields();
    router.push(`/${organizationId}/audit`);
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={handleFilter}
      initialValues={{
        entityType: searchParams.get('entityType') || undefined,
        action: searchParams.get('action') || undefined,
        dateRange: searchParams.has('startDate')
          ? [
              new Date(searchParams.get('startDate')!),
              new Date(searchParams.get('endDate')!),
            ]
          : undefined,
      }}
    >
      <Form.Item name="entityType" label="Entity Type">
        <Select
          style={{ width: 200 }}
          allowClear
          placeholder="Select entity type"
        >
          {entityTypes.map((type) => (
            <Option key={type.value} value={type.value}>
              {type.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="action" label="Action">
        <Select style={{ width: 200 }} allowClear placeholder="Select action">
          {actions.map((action) => (
            <Option key={action.value} value={action.value}>
              {action.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="dateRange" label="Date Range">
        <RangePicker showTime />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
          >
            Filter
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