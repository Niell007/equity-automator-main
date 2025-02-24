import { useState, useEffect } from 'react';
import { Card, Upload, Table, Button, Space, message, Modal, Tag } from 'antd';
import { UploadOutlined, FileOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { TableColumnsType } from 'antd';

interface DocumentManagerProps {
  organizationId: number;
}

interface Document {
  id: number;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  status: string;
}

export function DocumentManager({ organizationId }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [organizationId]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/documents`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setDocuments(result.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      message.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: UploadFile) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file as any);

      const response = await fetch(`/api/organizations/${organizationId}/documents`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      message.success('Document uploaded successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      message.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: number) => {
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/documents/${documentId}`,
        { method: 'DELETE' }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      message.success('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      message.error('Failed to delete document');
    }
  };

  const handleDownload = async (documentId: number, name: string) => {
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/documents/${documentId}/download`
      );

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      message.error('Failed to download document');
    }
  };

  const columns: TableColumnsType<Document> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <FileOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Policy', value: 'POLICY' },
        { text: 'Report', value: 'REPORT' },
        { text: 'Form', value: 'FORM' },
      ],
      onFilter: (value: string | number | boolean, record: Document) =>
        record.type === value,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size) => `${(size / 1024).toFixed(2)} KB`,
    },
    {
      title: 'Uploaded By',
      dataIndex: 'uploadedBy',
      key: 'uploadedBy',
    },
    {
      title: 'Uploaded At',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.id, record.name)}
          >
            Download
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Delete Document',
                content: 'Are you sure you want to delete this document?',
                okText: 'Yes',
                cancelText: 'No',
                onOk: () => handleDelete(record.id),
              });
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space direction="vertical" className="w-full">
        <Upload
          customRequest={({ file, onSuccess }) => {
            handleUpload(file as UploadFile).then(() => {
              onSuccess?.('ok');
            });
          }}
          showUploadList={false}
        >
          <Button
            type="primary"
            icon={<UploadOutlined />}
            loading={uploading}
            className="mb-4"
          >
            Upload Document
          </Button>
        </Upload>

        <Table
          columns={columns}
          dataSource={documents}
          loading={loading}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} documents`,
          }}
        />
      </Space>
    </Card>
  );
} 