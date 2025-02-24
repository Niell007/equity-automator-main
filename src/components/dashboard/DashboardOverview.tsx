import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Button, Space, Progress, Table } from 'antd';
import {
  TeamOutlined,
  PartitionOutlined,
  FileProtectOutlined,
  AlertOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';

interface DashboardMetrics {
  totalEmployees: number;
  activeDepartments: number;
  complianceScore: number;
  pendingActions: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  ethnicityDistribution: {
    [key: string]: number;
  };
  recentActivities: Array<{
    id: number;
    action: string;
    entityType: string;
    timestamp: string;
    user: string;
  }>;
}

interface DashboardOverviewProps {
  organizationId: number;
}

export function DashboardOverview({ organizationId }: DashboardOverviewProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardMetrics();
  }, [organizationId]);

  const fetchDashboardMetrics = async () => {
    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/dashboard/metrics`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setMetrics(result.data);
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const activityColumns: TableProps<DashboardMetrics['recentActivities'][0]>['columns'] = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Type',
      dataIndex: 'entityType',
      key: 'entityType',
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
  ];

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Employees"
              value={metrics?.totalEmployees}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Active Departments"
              value={metrics?.activeDepartments}
              prefix={<PartitionOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Compliance Score"
              value={metrics?.complianceScore}
              suffix="%"
              prefix={<FileProtectOutlined />}
              valueStyle={{ color: metrics?.complianceScore >= 80 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Pending Actions"
              value={metrics?.pendingActions}
              prefix={<AlertOutlined />}
              valueStyle={{ color: metrics?.pendingActions > 0 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Gender Distribution" loading={loading}>
            {metrics && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Female</span>
                    <span>{metrics.genderDistribution.female}%</span>
                  </div>
                  <Progress percent={metrics.genderDistribution.female} status="active" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Male</span>
                    <span>{metrics.genderDistribution.male}%</span>
                  </div>
                  <Progress percent={metrics.genderDistribution.male} status="active" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Other</span>
                    <span>{metrics.genderDistribution.other}%</span>
                  </div>
                  <Progress percent={metrics.genderDistribution.other} status="active" />
                </div>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Ethnicity Distribution" loading={loading}>
            {metrics && Object.entries(metrics.ethnicityDistribution).map(([ethnicity, percentage]) => (
              <div key={ethnicity} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="capitalize">{ethnicity}</span>
                  <span>{percentage}%</span>
                </div>
                <Progress percent={percentage} status="active" />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Card title="Recent Activities" loading={loading}>
        <Table
          columns={activityColumns}
          dataSource={metrics?.recentActivities}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Quick Actions" loading={loading}>
            <Space wrap>
              <Button type="primary" icon={<TeamOutlined />}>
                Add Employee
              </Button>
              <Button icon={<FileProtectOutlined />}>
                Generate Compliance Report
              </Button>
              <Button icon={<AlertOutlined />}>
                View Pending Actions
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
} 