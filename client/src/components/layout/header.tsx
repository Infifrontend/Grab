import { Badge, Dropdown, Avatar, Modal, Typography, Empty } from "antd";
import {
  BellOutlined,
  DownOutlined,
  UserOutlined,
  CloseOutlined,
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

const userMenuItems: MenuProps["items"] = [
  {
    key: "profile",
    label: "Profile",
  },
  {
    key: "settings",
    label: "Settings",
  },
  {
    key: "logout",
    label: "Logout",
  },
];

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
          <Link href="/" className="infiniti-logo">
            <img src="./src/images/Logo.png" alt="Volaris" title="Volaris" />
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
    </header>
  );
}
