import { Badge, Dropdown, Avatar } from 'antd';
import { BellOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'wouter';
import type { MenuProps } from 'antd';

const navigationItems = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { key: 'manage-booking', label: 'Manage Booking', path: '/manage-booking' },
  { key: 'new-booking', label: 'New Booking', path: '/new-booking' },
  { key: 'payments', label: 'Payments', path: '/payments' },
  { key: 'sets', label: 'Sets', path: '/sets' },
  { key: 'settings', label: 'Settings', path: '/settings' },
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
  const [location] = useLocation();

  return (
    <header className="infiniti-header">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="infiniti-logo">
            INFINITI
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                href={item.path}
                className={`infiniti-nav-item ${location === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
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
