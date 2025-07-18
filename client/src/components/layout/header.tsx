import { Badge, Dropdown, Avatar, Modal, Typography, Empty, Card, Space, Button, Divider } from "antd";
import {
  BellOutlined,
  DownOutlined,
  UserOutlined,
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import type { MenuProps } from "antd";

const { Title, Text } = Typography;

const navigationItems = [
  { key: "home", label: "Home", path: "/" },
  { key: "dashboard", label: "Dashboard", path: "/dashboard" },
  { key: "manage-booking", label: "Manage Booking", path: "/manage-booking" },
  { key: "new-booking", label: "New Booking", path: "/new-booking" },
  { key: "payments", label: "Payments", path: "/payments" },
  { key: "bids", label: "Bids", path: "/bids" },
  { key: "settings", label: "Settings", path: "/settings" },
];

// Custom dropdown content instead of using Ant Design's menu items

export default function Header() {
  const [location] = useLocation();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
  };

  const handleNotificationModalClose = () => {
    setIsNotificationModalOpen(false);
  };

  return (
    <header className="infiniti-header">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="infiniti-logo cursor-pointer">
            <img src="/src/images/Logo.png" alt="Volaris" title="Volaris" className="cursor-pointer" />
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                href={item.path}
                className={`infiniti-nav-item ${location === item.path ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <Badge count={5} size="small">
              <BellOutlined
                className="text-lg text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={handleNotificationClick}
              />
            </Badge>

            <Dropdown
              placement="bottomRight"
              trigger={["click"]}
              dropdownRender={() => (
                <Card
                  className="user-profile-dropdown"
                  style={{ 
                    width: 320, 
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                  }}
                  bodyStyle={{ padding: "20px" }}
                >
                  {/* User Info Section */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar size={48} icon={<UserOutlined />} className="bg-gray-200" />
                    <div className="flex-1">
                      <Typography.Title level={5} className="!mb-1 text-gray-900">
                        John Smith
                      </Typography.Title>
                      <Typography.Text className="text-sm text-blue-600 font-medium">
                        Gold Member
                      </Typography.Text>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <Space direction="vertical" size={8} className="w-full mb-4">
                    <div className="flex items-center gap-2">
                      <MailOutlined className="text-gray-400 text-sm" />
                      <Typography.Text className="text-sm text-gray-600">
                        john.smith@company.com
                      </Typography.Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneOutlined className="text-gray-400 text-sm" />
                      <Typography.Text className="text-sm text-gray-600">
                        +1 (555) 123-4567
                      </Typography.Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <EnvironmentOutlined className="text-gray-400 text-sm" />
                      <Typography.Text className="text-sm text-gray-600">
                        New York, NY
                      </Typography.Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarOutlined className="text-gray-400 text-sm" />
                      <Typography.Text className="text-sm text-gray-600">
                        Member since January 2023
                      </Typography.Text>
                    </div>
                  </Space>

                  {/* Total Bookings */}
                  <div className="flex justify-between items-center py-3 px-3 bg-gray-50 rounded-lg mb-4">
                    <Typography.Text className="text-sm text-gray-600">
                      Total Bookings:
                    </Typography.Text>
                    <Typography.Text className="text-sm font-semibold text-gray-900">
                      12
                    </Typography.Text>
                  </div>

                  {/* Action Buttons */}
                  <Space direction="vertical" size={8} className="w-full">
                    <Button
                      type="text"
                      icon={<UserOutlined />}
                      className="w-full justify-start h-10 text-left hover:bg-gray-50"
                      style={{ border: "none", padding: "0 12px" }}
                    >
                      View Profile
                    </Button>
                    <Button
                      type="text"
                      icon={<CreditCardOutlined />}
                      className="w-full justify-start h-10 text-left hover:bg-gray-50"
                      style={{ border: "none", padding: "0 12px" }}
                    >
                      Payment Methods
                    </Button>
                    <Button
                      type="text"
                      icon={<SettingOutlined />}
                      className="w-full justify-start h-10 text-left hover:bg-gray-50"
                      style={{ border: "none", padding: "0 12px" }}
                    >
                      Settings
                    </Button>
                  </Space>

                  <Divider className="!my-3" />

                  {/* Sign Out */}
                  <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    className="w-full justify-center h-10 text-red-600 hover:bg-red-50 hover:text-red-700"
                    style={{ border: "none" }}
                  >
                    Sign Out
                  </Button>
                </Card>
              )}
            >
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                <Avatar size="small" icon={<UserOutlined />} />
                <span className="text-gray-600 font-medium">John Smith</span>
                <DownOutlined className="text-xs text-gray-600" />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      <Modal
        title={
          <div className="flex items-center justify-between">
            <Title level={4} className="!mb-0">
              Notification
            </Title>
            <CloseOutlined
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={handleNotificationModalClose}
            />
          </div>
        }
        open={isNotificationModalOpen}
        onCancel={handleNotificationModalClose}
        footer={null}
        closable={false}
        width={400}
        className="notification-modal"
      >
        <div className="py-8">
          <Empty
            image={
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BellOutlined className="text-2xl text-gray-400" />
                </div>
              </div>
            }
            description={
              <Text className="text-gray-500">No Notifications</Text>
            }
          />
        </div>
      </Modal>

      <style jsx global>{`
        .user-profile-dropdown .ant-card-body {
          padding: 20px !important;
        }
        
        .user-profile-dropdown .ant-btn-text:hover {
          background-color: #f9fafb !important;
        }
        
        .user-profile-dropdown .ant-divider {
          margin: 12px 0 !important;
        }
      `}</style>
    </header>
  );
}