import {
  Dropdown,
  Avatar,
  Typography,
  Card,
  Space,
  Button,
  Divider
} from "antd";
import {
  DownOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Notification from "./notification";

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

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // Calculate active menu based on current path
  const activeMenu = navigationItems.find(item => 
    location.pathname === item.path || 
    (item.path !== '/' && location.pathname.startsWith(item.path))
  )?.key || localStorage.getItem("activeMenu") || "";

  const handleSignOut = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header className="infiniti-header">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="infiniti-logo cursor-pointer">
            <img
              src="/src/images/Logo.png"
              alt="Volaris"
              title="Volaris"
              className="cursor-pointer"
            />
          </Link>

          {/* Navigation - Updated with smoother active state */}
          <nav className="hidden lg:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => localStorage.setItem("activeMenu", item.key)}
                className={`infiniti-nav-item transition-colors duration-200 ${
                  activeMenu === item.key 
                    ? "active" 
                    : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Profile - Remaining unchanged */}
          <div className="flex items-center space-x-4">
            <Notification />
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
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </Card>
              )}
            >
              <div className="flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg transition-colors">
                <Avatar size="small" icon={<UserOutlined />} />
                <span className="text-gray-600 font-medium">John Smith</span>
                <DownOutlined className="text-xs text-gray-600" style={{ marginBlockStart: "0.25rem" }} />
              </div> 
            </Dropdown>
          </div>
        </div>
      </div>

      <style>
        {`
          .user-profile-dropdown .ant-card-body {
            padding: 20px !important;
          }

          .user-profile-dropdown .ant-btn-text:hover {
            background-color: #f9fafb !important;
          }

          .user-profile-dropdown .ant-divider {
            margin: 12px 0 !important;
          }
        `}
      </style>
    </header>
  );
}