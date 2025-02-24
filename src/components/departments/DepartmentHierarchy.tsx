import { useState, useEffect } from 'react';
import { Tree, Card, Spin, Empty, message } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

interface Department {
  id: number;
  name: string;
  code: string;
  description: string | null;
  managerId: number | null;
  parentDepartmentId: number | null;
  status: 'ACTIVE' | 'INACTIVE';
  employeeCount: number;
  manager: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

interface DepartmentHierarchyProps {
  organizationId: number;
}

export function DepartmentHierarchy({ organizationId }: DepartmentHierarchyProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, [organizationId]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/departments/hierarchy`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setDepartments(result.data);
    } catch (error) {
      message.error('Failed to fetch department hierarchy');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildTreeData = (departments: Department[]): DataNode[] => {
    // Create a map of departments by ID for easy lookup
    const departmentMap = new Map(departments.map(dept => [dept.id, dept]));

    // Find root departments (those without a parent)
    const rootDepartments = departments.filter(dept => !dept.parentDepartmentId);

    // Recursively build the tree structure
    const buildNode = (department: Department): DataNode => {
      const children = departments
        .filter(dept => dept.parentDepartmentId === department.id)
        .map(buildNode);

      return {
        key: department.id,
        title: (
          <span>
            {department.name} ({department.code})
            {department.manager && (
              <span style={{ color: '#666', marginLeft: 8 }}>
                Manager: {department.manager.firstName} {department.manager.lastName}
              </span>
            )}
            <span style={{ color: '#1890ff', marginLeft: 8 }}>
              {department.employeeCount} employee{department.employeeCount !== 1 ? 's' : ''}
            </span>
          </span>
        ),
        icon: <TeamOutlined />,
        children: children.length > 0 ? children : undefined,
      };
    };

    return rootDepartments.map(buildNode);
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!departments.length) {
    return (
      <Card>
        <Empty
          description="No departments found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card title="Department Hierarchy">
      <Tree
        showIcon
        defaultExpandAll
        treeData={buildTreeData(departments)}
        style={{ backgroundColor: '#fff' }}
      />
    </Card>
  );
} 