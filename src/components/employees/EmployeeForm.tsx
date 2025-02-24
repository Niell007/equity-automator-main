import { Form, Input, Select, DatePicker, InputNumber, Button, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Option } = Select;

interface EmployeeFormData {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  ethnicity: string;
  position: string;
  department: string;
  startDate: Date;
  status: 'ACTIVE' | 'TERMINATED' | 'ON_LEAVE';
  salary: number;
}

interface EmployeeFormProps {
  organizationId: number;
  initialData?: EmployeeFormData;
  mode: 'create' | 'edit';
}

export function EmployeeForm({
  organizationId,
  initialData,
  mode,
}: EmployeeFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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

  const ethnicities = [
    'African American',
    'Asian',
    'Caucasian',
    'Hispanic',
    'Native American',
    'Pacific Islander',
    'Two or More Races',
    'Other',
    'Prefer Not to Say',
  ];

  const handleSubmit = async (values: EmployeeFormData) => {
    setLoading(true);
    try {
      const url = mode === 'create'
        ? `/api/organizations/${organizationId}/employees`
        : `/api/organizations/${organizationId}/employees/${initialData?.employeeId}`;

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

      router.push(`/${organizationId}/employees`);
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
      initialValues={
        initialData
          ? {
              ...initialData,
              startDate: initialData.startDate
                ? new Date(initialData.startDate)
                : undefined,
            }
          : undefined
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="employeeId"
          label="Employee ID"
          rules={[{ required: true, message: 'Please enter employee ID' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select gender' }]}
        >
          <Select placeholder="Select gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
            <Option value="prefer_not_to_say">Prefer Not to Say</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="ethnicity"
          label="Ethnicity"
          rules={[{ required: true, message: 'Please select ethnicity' }]}
        >
          <Select placeholder="Select ethnicity">
            {ethnicities.map((ethnicity) => (
              <Option key={ethnicity} value={ethnicity.toLowerCase()}>
                {ethnicity}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="position"
          label="Position"
          rules={[{ required: true, message: 'Please enter position' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: 'Please select department' }]}
        >
          <Select placeholder="Select department">
            {departments.map((department) => (
              <Option key={department} value={department}>
                {department}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: 'Please select start date' }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status">
            <Option value="ACTIVE">Active</Option>
            <Option value="TERMINATED">Terminated</Option>
            <Option value="ON_LEAVE">On Leave</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="salary"
          label="Salary"
          rules={[{ required: true, message: 'Please enter salary' }]}
        >
          <InputNumber
            className="w-full"
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            min={0}
          />
        </Form.Item>
      </div>

      <Form.Item className="mt-6">
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {mode === 'create' ? 'Create Employee' : 'Update Employee'}
          </Button>
          <Button onClick={() => router.back()}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
} 