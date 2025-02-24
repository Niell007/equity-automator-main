import { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Space, message, Tabs } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

interface OrganizationSettingsProps {
  organizationId: number;
}

interface OrganizationProfile {
  name: string;
  industry: string;
  size: string;
  registrationNumber: string;
  taxId: string;
  address: string;
}

interface ComplianceSetting {
  key: string;
  value: string;
  description: string;
}

export function OrganizationSettings({ organizationId }: OrganizationSettingsProps) {
  const [profileForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<ComplianceSetting[]>([]);

  useEffect(() => {
    fetchOrganizationData();
    fetchComplianceSettings();
  }, [organizationId]);

  const fetchOrganizationData = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      profileForm.setFieldsValue(result.data);
    } catch (error) {
      console.error('Error fetching organization data:', error);
      message.error('Failed to fetch organization data');
    } finally {
      setLoading(false);
    }
  };

  const fetchComplianceSettings = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/settings`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setSettings(result.data);
    } catch (error) {
      console.error('Error fetching compliance settings:', error);
      message.error('Failed to fetch compliance settings');
    }
  };

  const handleProfileUpdate = async (values: OrganizationProfile) => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      message.success('Organization profile updated successfully');
    } catch (error) {
      console.error('Error updating organization profile:', error);
      message.error('Failed to update organization profile');
    }
  };

  const handleSettingUpdate = async (key: string, value: string) => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      message.success('Setting updated successfully');
      fetchComplianceSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      message.error('Failed to update setting');
    }
  };

  const items = [
    {
      key: 'profile',
      label: 'Organization Profile',
      children: (
        <Card>
          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleProfileUpdate}
          >
            <Form.Item
              name="name"
              label="Organization Name"
              rules={[{ required: true, message: 'Please enter organization name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="industry"
              label="Industry"
              rules={[{ required: true, message: 'Please select industry' }]}
            >
              <Select>
                <Select.Option value="TECHNOLOGY">Technology</Select.Option>
                <Select.Option value="FINANCE">Finance</Select.Option>
                <Select.Option value="HEALTHCARE">Healthcare</Select.Option>
                <Select.Option value="MANUFACTURING">Manufacturing</Select.Option>
                <Select.Option value="RETAIL">Retail</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="size"
              label="Organization Size"
              rules={[{ required: true, message: 'Please select organization size' }]}
            >
              <Select>
                <Select.Option value="SMALL">Small (1-50 employees)</Select.Option>
                <Select.Option value="MEDIUM">Medium (51-250 employees)</Select.Option>
                <Select.Option value="LARGE">Large (251+ employees)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="registrationNumber"
              label="Registration Number"
              rules={[{ required: true, message: 'Please enter registration number' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="taxId"
              label="Tax ID"
              rules={[{ required: true, message: 'Please enter tax ID' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Save Profile
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'compliance',
      label: 'Compliance Settings',
      children: (
        <Card>
          <Space direction="vertical" className="w-full">
            {settings.map((setting) => (
              <Card key={setting.key} size="small" title={setting.key}>
                <p className="text-gray-600 mb-4">{setting.description}</p>
                <Space>
                  <Input
                    defaultValue={setting.value}
                    onBlur={(e) => handleSettingUpdate(setting.key, e.target.value)}
                  />
                </Space>
              </Card>
            ))}
          </Space>
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs items={items} />
    </div>
  );
} 