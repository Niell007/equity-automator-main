import { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Tag } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

interface Document {
  id: number;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  mimeType: string;
}

interface DocumentListProps {
  organizationId: number;
}

export function DocumentList({ organizationId }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/documents`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setDocuments(result.data);
    } catch (error) {
      message.error('Failed to fetch documents');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [organizationId]);

  const handleDownload = async (documentId: number) => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/documents/${documentId}/download`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      window.open(result.data.url, '_blank');
    } catch (error) {
      message.error('Failed to download document');
      console.error('Download error:', error);
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
      message.error('Failed to delete document');
      console.error('Delete error:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Document) => (
        <Space>
          {text}
          <Tag color="blue">{record.type}</Tag>
        </Space>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => formatFileSize(size),
    },
    {
      title: 'Uploaded',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => format(new Date(date), 'PPp'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Document) => (
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.id)}
          >
            Download
          </Button>
          <Popconfirm
            title="Delete document?"
            description="Are you sure you want to delete this document?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={documents}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
} 