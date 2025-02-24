import { Layout, Menu, Avatar, Dropdown, theme } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getServerSession } from 'next-auth';

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    organizationId: string;
  };
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const session = await getServerSession();
  const organizationId = params.organizationId;

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href={`/${organizationId}/dashboard`}>Dashboard</Link>,
    },
    {
      key: 'employees',
      icon: <TeamOutlined />,
      label: <Link href={`/${organizationId}/employees`}>Employees</Link>,
    },
    {
      key: 'reports',
      icon: <FileTextOutlined />,
      label: <Link href={`/${organizationId}/reports`}>Reports</Link>,
    },
    {
      key: 'documents',
      icon: <FileTextOutlined />,
      label: <Link href={`/${organizationId}/documents`}>Documents</Link>,
    },
    {
      key: 'audit',
      icon: <AuditOutlined />,
      label: <Link href={`/${organizationId}/audit`}>Audit Logs</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link href={`/${organizationId}/settings`}>Settings</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        theme="light"
        className="shadow-sm"
        style={{ height: '100vh', position: 'fixed', left: 0 }}
      >
        <div className="p-4 text-xl font-bold text-center border-b">
          EQ Automator
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          className="border-r-0 mt-4"
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header className="bg-white px-6 flex justify-end items-center shadow-sm">
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="cursor-pointer flex items-center space-x-2">
              <span>{session?.user?.name}</span>
              <Avatar icon={<UserOutlined />} />
            </div>
          </Dropdown>
        </Header>
        <Content className="p-6 bg-gray-50">
          <div className="bg-white rounded-lg p-6 min-h-[calc(100vh-48px)]">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
} 