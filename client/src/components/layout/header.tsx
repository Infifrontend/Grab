import { Row, Col, Badge, Dropdown, Avatar, Space } from 'antd';
import { BellOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const navigationItems = [
  { key: 'home', label: 'Home', active: true },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'manage-booking', label: 'Manage Booking' },
  { key: 'new-booking', label: 'New Booking' },
  { key: 'payments', label: 'Payments' },
  { key: 'sets', label: 'Sets' },
  { key: 'settings', label: 'Settings' },
];

const userMenuItems: MenuProps['items'] = [
  {
    key: 'profile',
    label: 'Profile',
  },
  {
    key: 'settings',
    label: 'Settings',
  },
  {
    key: 'logout',
    label: 'Logout',
  },
];

export default function Header() {
  return (
    <header className="infiniti-header" style={{ padding: '0 24px' }}>
      <Row align="middle" justify="space-between" style={{ height: '64px' }}>
        {/* Logo */}
        <Col>
          <div className="infiniti-logo">
            INFINITI
          </div>
        </Col>

        {/* Navigation */}
        <Col flex="auto">
          <Row justify="center" gutter={32}>
            {navigationItems.map((item) => (
              <Col key={item.key}>
                <a
                  href="#"
                  className={`infiniti-nav-item ${item.active ? 'active' : ''}`}
                >
                  {item.label}
                </a>
              </Col>
            ))}
          </Row>
        </Col>

        {/* User Profile */}
        <Col>
          <Space size={16}>
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: '18px', color: '#666' }} />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserOutlined />} />
                <span style={{ color: '#666', fontWeight: 500 }}>John Smith</span>
                <DownOutlined style={{ fontSize: '12px', color: '#666' }} />
              </Space>
            </Dropdown>
          </Space>
        </Col>
      </Row>
    </header>
  );
}
