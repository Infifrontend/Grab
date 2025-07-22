import {
  Badge,
  Dropdown,
  Avatar,
  Popconfirm,
  Typography,
  Empty,
  Card,
  Space,
  Button,
  Divider,
} from "antd";
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
  { key: "admin", label: "Admin", path: "/admin/login" },
];

// Custom dropdown content instead of using Ant Design's menu items

export default function Header() {
  const [location] = useLocation();

  const handleViewAllNotifications = () => {
    console.log("View all notifications");
  };

  return (
    <header className="infiniti-header">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="infiniti-logo cursor-pointer">
            <img
              src="/src/images/Logo.png"
              alt="Volaris"
              title="Volaris"
              className="cursor-pointer"
            />
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
            <Popconfirm
              title={
                <div
                  className="bg-white rounded-lg shadow-lg"
                  style={{ width: 340 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Typography.Title
                        level={5}
                        className="!mb-0 text-gray-900"
                      >
                        Notifications
                      </Typography.Title>
                    </div>
                    <Typography.Text className="text-sm text-orange-500 font-medium">
                      5 Unread
                    </Typography.Text>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {/* Shipped Order Notification */}
                    <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                          <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                            <span className="text-white text-xs">📦</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <Typography.Text className="font-semibold text-gray-900 text-sm block">
                            Your Order Has Been Shipped
                          </Typography.Text>
                          <Typography.Text className="text-gray-500 text-xs mt-1">
                            Order No: 123456 Has Shipped To Your Delivery
                            Address
                          </Typography.Text>
                        </div>
                      </div>
                    </div>

                    {/* Discount Available Notification */}
                    <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                          <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
                            <span className="text-white text-xs">%</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <Typography.Text className="font-semibold text-gray-900 text-sm block">
                            Discount Available
                          </Typography.Text>
                          <Typography.Text className="text-gray-500 text-xs mt-1">
                            Discount Available On Selected Products
                          </Typography.Text>
                        </div>
                      </div>
                    </div>

                    {/* Account Verified Notification */}
                    <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                          <UserOutlined className="text-gray-600 text-sm" />
                        </div>
                        <div className="flex-1">
                          <Typography.Text className="font-semibold text-gray-900 text-sm block">
                            Account Has Been Verified
                          </Typography.Text>
                          <Typography.Text className="text-gray-500 text-xs mt-1">
                            Your Account Has Been Verified Successfully
                          </Typography.Text>
                        </div>
                      </div>
                    </div>

                    {/* Order Placed Notification */}
                    <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                          <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <Typography.Text className="font-semibold text-gray-900 text-sm block">
                            Order Placed ID: #1116773
                          </Typography.Text>
                          <Typography.Text className="text-gray-500 text-xs mt-1">
                            Order Placed Successfully
                          </Typography.Text>
                        </div>
                      </div>
                    </div>

                    {/* Order Delayed Notification */}
                    <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">!</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Typography.Text className="font-semibold text-gray-900 text-sm">
                              Order Delayed
                            </Typography.Text>
                            <Typography.Text className="text-red-500 text-sm font-medium">
                              ID: 7731116
                            </Typography.Text>
                          </div>
                          <Typography.Text className="text-gray-500 text-xs mt-1">
                            Order Delayed Unfortunately
                          </Typography.Text>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View All Button */}
                  <div className="px-6 py-4 border-t border-gray-100"></div>
                </div>
              }
              placement="bottomRight"
              trigger="click"
              showCancel={false}
              showConfirm={false}
              icon={null}
            >
              <Badge count={5} size="small">
                <BellOutlined className="text-lg text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
              </Badge>
            </Popconfirm>

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
                    boxShadow:
                      "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  bodyStyle={{ padding: "20px" }}
                >
                  {/* User Info Section */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar
                      size={48}
                      icon={<UserOutlined />}
                      className="bg-gray-200"
                    />
                    <div className="flex-1">
                      <Typography.Title
                        level={5}
                        className="!mb-1 text-gray-900"
                      >
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
