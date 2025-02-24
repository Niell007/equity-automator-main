import { Card, Typography, Button, Upload, message, Alert, Space } from 'antd';
import { UploadOutlined, FileExcelOutlined, DownloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';

const { Title, Text } = Typography;

interface ImportPageProps {
  params: {
    organizationId: string;
  };
}

export default function ImportPage({ params }: ImportPageProps) {
  const router = useRouter();
  const organizationId = parseInt(params.organizationId);

  const uploadProps: UploadProps = {
    name: 'file',
    action: `/api/organizations/${organizationId}/employees/import`,
    accept: '.csv',
    maxCount: 1,
    showUploadList: true,
    onChange(info) {
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          message.success(
            `Successfully imported ${info.file.response.data.imported} employees`
          );
          router.push(`/${organizationId}/employees`);
        } else {
          message.error(
            info.file.response.error || 'Failed to import employees'
          );
        }
      } else if (info.file.status === 'error') {
        message.error('Failed to upload file');
      }
    },
    beforeUpload: (file: RcFile) => {
      const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
      if (!isCSV) {
        message.error('You can only upload CSV files!');
      }
      return isCSV;
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileExcelOutlined className="text-2xl text-blue-500" />
        <Title level={2} className="!mb-0">
          Import Employees
        </Title>
      </div>

      <Card className="shadow-sm">
        <Space direction="vertical" size="large" className="w-full">
          <Alert
            message="Import Instructions"
            description={
              <ul className="list-disc pl-4">
                <li>Upload a CSV file with employee data</li>
                <li>The first row should contain column headers</li>
                <li>Required columns: employeeId, firstName, lastName, email, gender, ethnicity, position, department, startDate, status, salary</li>
                <li>Status must be one of: ACTIVE, TERMINATED, ON_LEAVE</li>
                <li>Dates should be in ISO format (YYYY-MM-DD)</li>
                <li>Salary should be a number</li>
              </ul>
            }
            type="info"
            showIcon
          />

          <div>
            <Text strong>Download Template</Text>
            <div className="mt-2">
              <Button
                icon={<DownloadOutlined />}
                href="/templates/employee-import-template.csv"
                target="_blank"
              >
                Download CSV Template
              </Button>
            </div>
          </div>

          <div>
            <Text strong>Upload File</Text>
            <div className="mt-2">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Select CSV File</Button>
              </Upload>
            </div>
          </div>
        </Space>
      </Card>
    </div>
  );
} 