import { useState } from 'react';
import { Upload, Button, message, Form, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useRouter } from 'next/navigation';

const { Option } = Select;

interface DocumentUploadProps {
  organizationId: number;
}

export function DocumentUpload({ organizationId }: DocumentUploadProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async (values: { type: string }) => {
    if (fileList.length === 0) {
      message.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj as Blob);
    formData.append('type', values.type);

    setUploading(true);

    try {
      const response = await fetch(`/api/organizations/${organizationId}/documents`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      message.success('Upload successful');
      setFileList([]);
      router.refresh();
    } catch (error) {
      message.error('Upload failed');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file: UploadFile) => {
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
  };

  return (
    <Form onFinish={handleUpload} layout="vertical">
      <Form.Item
        name="type"
        label="Document Type"
        rules={[{ required: true, message: 'Please select a document type' }]}
      >
        <Select placeholder="Select document type">
          <Option value="policy">Policy Document</Option>
          <Option value="report">Compliance Report</Option>
          <Option value="evidence">Supporting Evidence</Option>
          <Option value="training">Training Material</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={uploading}
          disabled={fileList.length === 0}
        >
          Upload Document
        </Button>
      </Form.Item>
    </Form>
  );
} 