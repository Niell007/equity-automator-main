import { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Popconfirm, message, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import type { TableProps } from 'antd';
import type { Key } from 'antd/es/table/interface';

interface Department {
  id: number;
  name: string;
  code: string;
  description: string | null;
  managerId: number | null;
  parentDepartmentId: number | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

interface DepartmentListProps {
  organizationId: number;
}

export function DepartmentList({ organizationId }: DepartmentListProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchDepartments = async () => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      const response = await fetch(
        `/api/organizations/${organizationId}/departments?${params.toString()}`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setDepartments(result.data);
    } catch (error) {
      message.error('Failed to fetch departments');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, searchParams]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/departments/${id}`,
        { method: 'DELETE' }
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      message.success('Department deleted successfully');
      fetchDepartments();
    } catch (error) {
      message.error('Failed to delete department');
      console.error('Delete error:', error);
    }
  };

  const getStatusBadge = (status: Department['status']) => {
    const statusConfig = {
      ACTIVE: { status: 'success' as const, text: 'Active' },
      INACTIVE: { status: 'error' as const, text: 'Inactive' },
    };

    const config = statusConfig[status];
    return <Badge status={config.status} text={config.text} />;
  };

  const columns: TableProps<Department>['columns'] = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Department, b: Department) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Department['status']) => getStatusBadge(status),
      filters: [
        { text: 'Active', value: 'ACTIVE' },
        { text: 'Inactive', value: 'INACTIVE' },
      ],
      onFilter: (value: boolean | Key, record: Department) => record.status === String(value),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => format(new Date(date), 'PP'),
      sorter: (a: Department, b: Department) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Department) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() =>
              router.push(`/${organizationId}/departments/${record.id}`)
            }
          />
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              router.push(`/${organizationId}/departments/${record.id}/edit`)
            }
          />
          <Popconfirm
            title="Delete department?"
            description="Are you sure you want to delete this department? This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={departments}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total: number) => `Total ${total} departments`,
      }}
    />
  );
} 