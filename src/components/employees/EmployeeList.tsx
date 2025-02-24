import { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Popconfirm, message, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';

interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  ethnicity: string;
  position: string;
  department: string;
  startDate: string;
  status: 'ACTIVE' | 'TERMINATED' | 'ON_LEAVE';
  salary: number;
}

interface EmployeeListProps {
  organizationId: number;
}

export function EmployeeList({ organizationId }: EmployeeListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchEmployees = async () => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      const response = await fetch(
        `/api/organizations/${organizationId}/employees?${params.toString()}`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setEmployees(result.data);
    } catch (error) {
      message.error('Failed to fetch employees');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [organizationId, searchParams]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/employees/${id}`,
        { method: 'DELETE' }
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      message.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      message.error('Failed to delete employee');
      console.error('Delete error:', error);
    }
  };

  const getStatusBadge = (status: Employee['status']) => {
    const statusConfig = {
      ACTIVE: { status: 'success', text: 'Active' },
      TERMINATED: { status: 'error', text: 'Terminated' },
      ON_LEAVE: { status: 'warning', text: 'On Leave' },
    };

    const config = statusConfig[status];
    return <Badge status={config.status as any} text={config.text} />;
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(salary);
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: Employee) => (
        <span>{`${record.firstName} ${record.lastName}`}</span>
      ),
      sorter: (a: Employee, b: Employee) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: [
        ...new Set(employees.map((e) => e.department)).map((dept) => ({
          text: dept,
          value: dept,
        })),
      ],
      onFilter: (value: string, record: Employee) =>
        record.department === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Employee['status']) => getStatusBadge(status),
      filters: [
        { text: 'Active', value: 'ACTIVE' },
        { text: 'Terminated', value: 'TERMINATED' },
        { text: 'On Leave', value: 'ON_LEAVE' },
      ],
      onFilter: (value: string, record: Employee) => record.status === value,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => format(new Date(date), 'PP'),
      sorter: (a: Employee, b: Employee) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (salary: number) => formatSalary(salary),
      sorter: (a: Employee, b: Employee) => a.salary - b.salary,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Employee) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() =>
              router.push(`/${organizationId}/employees/${record.id}`)
            }
          />
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              router.push(`/${organizationId}/employees/${record.id}/edit`)
            }
          />
          <Popconfirm
            title="Delete employee?"
            description="Are you sure you want to delete this employee? This action cannot be undone."
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
      dataSource={employees}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} employees`,
      }}
    />
  );
} 