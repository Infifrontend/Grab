import { Badge, Dropdown, Avatar } from 'antd';
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
    <header className="infiniti-header">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="infiniti-logo">
            INFINITI
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.key}
                href="#"
                className={`infiniti-nav-item ${item.active ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <Badge count={5} size="small">
              <BellOutlined className="text-lg text-gray-600" />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Avatar size="small" icon={<UserOutlined />} />
                <span className="text-gray-600 font-medium">John Smith</span>
                <DownOutlined className="text-xs text-gray-600" />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
}
