import { useState, useEffect } from 'react';
import { Table, Tag, Space, Typography, Drawer, Descriptions } from 'antd';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';

const { Text } = Typography;

interface AuditLog {
  id: number;
  userId: number;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface AuditLogListProps {
  organizationId: number;
}

export function AuditLogList({ organizationId }: AuditLogListProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const searchParams = useSearchParams();

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      const entityType = searchParams.get('entityType');
      const action = searchParams.get('action');
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');

      if (entityType) params.set('entityType', entityType);
      if (action) params.set('action', action);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const response = await fetch(
        `/api/organizations/${organizationId}/audit?${params.toString()}`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setLogs(result.data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [organizationId, searchParams]);

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: 'success',
      UPDATE: 'processing',
      DELETE: 'error',
      VIEW: 'default',
      EXPORT: 'warning',
      SUBMIT: 'processing',
      APPROVE: 'success',
      REJECT: 'error',
    };
    return colors[action] || 'default';
  };

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => format(new Date(date), 'PPp'),
      sorter: (a: AuditLog, b: AuditLog) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => (
        <Tag color={getActionColor(action)}>{action}</Tag>
      ),
      filters: [
        { text: 'Create', value: 'CREATE' },
        { text: 'Update', value: 'UPDATE' },
        { text: 'Delete', value: 'DELETE' },
        { text: 'View', value: 'VIEW' },
        { text: 'Export', value: 'EXPORT' },
        { text: 'Submit', value: 'SUBMIT' },
        { text: 'Approve', value: 'APPROVE' },
        { text: 'Reject', value: 'REJECT' },
      ],
      onFilter: (value: string, record: AuditLog) => record.action === value,
    },
    {
      title: 'Entity Type',
      dataIndex: 'entityType',
      key: 'entityType',
      filters: [
        { text: 'Employee', value: 'employee' },
        { text: 'Report', value: 'report' },
        { text: 'Document', value: 'document' },
        { text: 'Settings', value: 'settings' },
      ],
      onFilter: (value: string, record: AuditLog) => record.entityType === value,
    },
    {
      title: 'Entity ID',
      dataIndex: 'entityId',
      key: 'entityId',
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
    },
    {
      title: 'Details',
      key: 'details',
      render: (_: any, record: AuditLog) => (
        <Text
          className="cursor-pointer text-blue-500 hover:text-blue-600"
          onClick={() => setSelectedLog(record)}
        >
          View Details
        </Text>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <Drawer
        title="Audit Log Details"
        placement="right"
        onClose={() => setSelectedLog(null)}
        open={!!selectedLog}
        width={600}
      >
        {selectedLog && (
          <Descriptions column={1}>
            <Descriptions.Item label="Timestamp">
              {format(new Date(selectedLog.createdAt), 'PPpp')}
            </Descriptions.Item>
            <Descriptions.Item label="Action">
              <Tag color={getActionColor(selectedLog.action)}>
                {selectedLog.action}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Entity Type">
              {selectedLog.entityType}
            </Descriptions.Item>
            <Descriptions.Item label="Entity ID">
              {selectedLog.entityId}
            </Descriptions.Item>
            <Descriptions.Item label="User ID">
              {selectedLog.userId}
            </Descriptions.Item>
            <Descriptions.Item label="IP Address">
              {selectedLog.ipAddress}
            </Descriptions.Item>
            <Descriptions.Item label="User Agent">
              {selectedLog.userAgent}
            </Descriptions.Item>
            <Descriptions.Item label="Details">
              <pre className="whitespace-pre-wrap">
                {typeof selectedLog.details === 'string'
                  ? selectedLog.details
                  : JSON.stringify(JSON.parse(selectedLog.details), null, 2)}
              </pre>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </>
  );
} 