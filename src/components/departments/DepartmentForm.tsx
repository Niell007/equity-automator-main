import { Form, Input, Select, Button, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const { Option } = Select;
const { TextArea } = Input;

interface DepartmentFormData {
  name: string;
  code: string;
  description?: string;
  managerId?: number;
  parentDepartmentId?: number;
  status: 'ACTIVE' | 'INACTIVE';
}

interface DepartmentFormProps {
  organizationId: number;
  initialData?: DepartmentFormData;
  mode: 'create' | 'edit';
}

export function DepartmentForm({
  organizationId,
  initialData,
  mode,
}: DepartmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch(
          `/api/organizations/${organizationId}/employees?status=ACTIVE`
        );
        const result = await response.json();
        if (result.success) {
          setManagers(result.data);
        }
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await fetch(
          `/api/organizations/${organizationId}/departments?status=ACTIVE`
        );
        const result = await response.json();
        if (result.success) {
          setDepartments(result.data);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchManagers();
    fetchDepartments();
  }, [organizationId]);

  const handleSubmit = async (values: DepartmentFormData) => {
    setLoading(true);
    try {
      const url = mode === 'create'
        ? `/api/organizations/${organizationId}/departments`
        : `/api/organizations/${organizationId}/departments/${initialData?.code}`;

      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      router.push(`/${organizationId}/departments`);
      router.refresh();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialData}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="name"
          label="Department Name"
          rules={[{ required: true, message: 'Please enter department name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="code"
          label="Department Code"
          rules={[{ required: true, message: 'Please enter department code' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          className="md:col-span-2"
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="managerId"
          label="Department Manager"
        >
          <Select
            placeholder="Select manager"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {managers.map((manager) => (
              <Option key={manager.id} value={manager.id}>
                {`${manager.firstName} ${manager.lastName}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="parentDepartmentId"
          label="Parent Department"
        >
          <Select
            placeholder="Select parent department"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {departments
              .filter((dept) => dept.id !== initialData?.id)
              .map((department) => (
                <Option key={department.id} value={department.id}>
                  {department.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status">
            <Option value="ACTIVE">Active</Option>
            <Option value="INACTIVE">Inactive</Option>
          </Select>
        </Form.Item>
      </div>

      <Form.Item className="mt-6">
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {mode === 'create' ? 'Create Department' : 'Update Department'}
          </Button>
          <Button onClick={() => router.back()}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
} 