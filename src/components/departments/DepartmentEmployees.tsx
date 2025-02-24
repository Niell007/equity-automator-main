import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Select, message, Tag, Badge } from 'antd';
import { TransferOutlined, UserAddOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import type { TableProps } from 'antd';

interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  status: 'ACTIVE' | 'INACTIVE';
  startDate: string;
  salary: number;
}

interface DepartmentEmployeesProps {
  organizationId: number;
  departmentId: number;
}

export function DepartmentEmployees({ organizationId, departmentId }: DepartmentEmployeesProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [targetDepartment, setTargetDepartment] = useState<number | null>(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [organizationId, departmentId]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/departments/${departmentId}/employees`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setEmployees(result.data);
    } catch (error) {
      message.error('Failed to fetch department employees');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/departments`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setDepartments(result.data.filter((dept: any) => dept.id !== departmentId));
    } catch (error) {
      message.error('Failed to fetch departments');
      console.error('Fetch error:', error);
    }
  };

  const handleTransfer = async () => {
    if (!selectedEmployee || !targetDepartment) return;

    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/employees/${selectedEmployee.id}/transfer`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ departmentId: targetDepartment }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      message.success('Employee transferred successfully');
      setTransferModalVisible(false);
      setSelectedEmployee(null);
      setTargetDepartment(null);
      fetchEmployees();
    } catch (error) {
      message.error('Failed to transfer employee');
      console.error('Transfer error:', error);
    }
  };

  const columns: TableProps<Employee>['columns'] = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Name',
      key: 'name',
      render: (_: unknown, record: Employee) => `${record.firstName} ${record.lastName}`,
      sorter: (a: Employee, b: Employee) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={status === 'ACTIVE' ? 'success' : 'error'}
          text={status === 'ACTIVE' ? 'Active' : 'Inactive'}
        />
      ),
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
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Employee) => (
        <Button
          icon={<TransferOutlined />}
          onClick={() => {
            setSelectedEmployee(record);
            setTransferModalVisible(true);
          }}
        >
          Transfer
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Department Employees</h3>
        <Button type="primary" icon={<UserAddOutlined />}>
          Add Employee
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={employees}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total: number) => `Total ${total} employees`,
        }}
      />

      <Modal
        title="Transfer Employee"
        open={transferModalVisible}
        onOk={handleTransfer}
        onCancel={() => {
          setTransferModalVisible(false);
          setSelectedEmployee(null);
          setTargetDepartment(null);
        }}
        okButtonProps={{ disabled: !targetDepartment }}
      >
        <p className="mb-4">
          Transfer {selectedEmployee?.firstName} {selectedEmployee?.lastName} to:
        </p>
        <Select
          className="w-full"
          placeholder="Select target department"
          onChange={(value) => setTargetDepartment(value)}
          value={targetDepartment}
        >
          {departments.map((dept) => (
            <Select.Option key={dept.id} value={dept.id}>
              {dept.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
} 