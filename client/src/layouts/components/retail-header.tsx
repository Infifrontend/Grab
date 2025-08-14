import {
  Dropdown,
  Avatar,
  Typography,
  Card,
  Space,
  Button,
  Divider,
  Popover,
  Tooltip,
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
  LogoutOutlined,
  CompressOutlined,
  ExpandOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Notification from "./notification";
import AccessibilityHeader from "@/components/ui/accessibility-header";
import { Theme } from "@/components/Theme/Theme";
import { useState } from "react";
import { useEventListener } from "@/hooks/event-listener.hook";
const { Text } = Typography;

const navigationItems = [
  { key: "home", label: "Home", path: "/" },
  { key: "manage-booking", label: "Manage Booking", path: "/manage-booking" },
  { key: "bids", label: "Bids", path: "/bids" },
];
import CFG from "../../config/config.json";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFullScreen, setIsFullscreen] = useState(true);
  const isUserLoggedIn = localStorage.getItem("isAuthenticated") === "true";
  const userName = localStorage.getItem("userName") || "User";

  // Calculate active menu based on current path
  const activeMenu =
    navigationItems.find(
      (item) =>
        location.pathname === item.path ||
        (item.path !== "/" && location.pathname.startsWith(item.path)),
    )?.key ||
    localStorage.getItem("activeMenu") ||
    "";

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  // For Focus issue fix - accessibility section
  const changeFocus = (e: React.KeyboardEvent) => {
    const currElement = e.target as HTMLElement;
    e.key === "Tab" &&
      !(e.key === "Tab" && e.shiftKey) &&
      !!document.querySelectorAll(".cls-accessibility-popover")[0] &&
      !document
        .querySelectorAll(".cls-accessibility-popover")[0]
        .classList.contains("ant-popover-hidden") &&
      e.preventDefault();
    setTimeout(() => {
      if (
        !!document.querySelectorAll(".cls-accessibility-popover")[0] &&
        !document
          .querySelectorAll(".cls-accessibility-popover")[0]
          .classList.contains("ant-popover-hidden")
      ) {
        const element = document.querySelectorAll(
          ".cls-accessibility-popover .cls-default",
        )[0] as HTMLElement;
        (e.key === "Enter" || e.key === "Space") &&
          element.clientWidth &&
          element.focus();
        e.key === "Tab" &&
          !(e.key === "Tab" && e.shiftKey) &&
          element.clientWidth &&
          element.focus();
      } else {
        (e.key === "Enter" || e.key === "Space") && currElement.focus();
      }
    }, 300);
  };

  const toggleScreen = () => {
    !document.fullscreenElement
      ? document.documentElement.requestFullscreen()
      : document.exitFullscreen();
  };

  const handleFullscreenChange = () => {
    !document.fullscreenElement
      ? setIsFullscreen(true)
      : setIsFullscreen(false);
  };

  // Add event listener for fullscreen change
  useEventListener("fullscreenchange", handleFullscreenChange, document);

  return (
    <header className="infiniti-header sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-center justify-between h-16`}>
          {/* Logo */}
          <Link to="/" className="infiniti-logo cursor-pointer">
            <img
              src={`/src/plugins/${CFG?.default?.airline_code || "RM"}/assets/images/Logo.png`}
              alt={
                CFG?.default?.airline_name
                  ? CFG?.default?.airline_name
                  : "Volaris"
              }
              title={
                CFG?.default?.airline_name
                  ? CFG?.default?.airline_name
                  : "Volaris"
              }
              className="cursor-pointer"
            />
          </Link>

          <div
            className={`flex items-center ${isUserLoggedIn ? "justify-between" : "justify-end"}  h-16`}
          >
            {isUserLoggedIn ? (
              /* Navigation - Updated with smoother active state */
              <nav className="hidden lg:flex space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={() => localStorage.setItem("activeMenu", item.key)}
                    className={`infiniti-nav-item transition-colors duration-200 ${
                      activeMenu === item.key ? "active" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : (
              <nav className="hidden lg:flex space-x-8">
                <Link
                  to="/"
                  className={`infiniti-nav-item transition-colors duration-200 ${
                    activeMenu === "home" ? "active" : ""
                  }`}
                  onClick={() => localStorage.setItem("activeMenu", "home")}
                >
                  Home
                </Link>
                <Link
                  to="/find-your-booking"
                  onClick={() =>
                    localStorage.setItem("activeMenu", "find-your-booking")
                  }
                  className={`infiniti-nav-item transition-colors duration-200 ${
                    activeMenu === "find-your-booking" ? "active" : ""
                  }`}
                >
                  Find your booking
                </Link>
              </nav>
            )}
            {/* User Profile - Remaining unchanged  */}
            <div className="flex items-center space-x-4 ml-4">
              <Popover
                trigger="click"
                className="cls-accessibility-popover"
                placement="bottom"
                content={<AccessibilityHeader />}
                title={null}
              >
                <Button
                  type="link"
                  className="cls-accessibility"
                  style={{ color: "var(--infiniti-link)" }}
                  onKeyDown={changeFocus}
                >
                  {"Accessibility"}
                </Button>
              </Popover>
              {isUserLoggedIn && (
                <>
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
                        <div className="flex justify-between align-center gap-3 mb-4">
                          <div className="flex items-start gap-3">
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
                                {userName}
                              </Typography.Title>
                              <Typography.Text className="text-sm text-blue-600 font-medium">
                                Gold Member
                              </Typography.Text>
                            </div>
                          </div>
                          <Theme />
                        </div>

                        {/* Action Buttons */}
                        <Space direction="vertical" size={8} className="w-full">
                          <Button
                            type="text"
                            icon={<UserOutlined />}
                            className="w-full justify-start h-10 text-left hover:bg-gray-50"
                            style={{ border: "none", padding: "0 12px" }}
                            onClick={() => navigate("/admin/login")}
                          >
                            Admin
                          </Button>
                          <Button
                            type="text"
                            icon={<SettingOutlined />}
                            className="w-full justify-start h-10 text-left hover:bg-gray-50"
                            style={{ border: "none", padding: "0 12px" }}
                            onClick={() => navigate("/settings")}
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
                      <span className="text-gray-600 font-medium">
                        {userName}
                      </span>
                      <DownOutlined
                        className="text-xs text-gray-600"
                        style={{ marginBlockStart: "0.25rem" }}
                      />
                    </div>
                  </Dropdown>
                </>
              )}
            </div>
            {!isUserLoggedIn && (
              <>
                <Button
                  type="link"
                  onClick={toggleScreen}
                  className="cls-toggle-screen"
                  style={{ width: 16 }}
                >
                  {!isFullScreen ? (
                    <Tooltip title="Compress_screen">
                      <CompressOutlined className="cls-screen-expand-collapse" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Expand_screen">
                      <ExpandOutlined className="cls-expand-icon" />
                    </Tooltip>
                  )}
                </Button>
                <Button
                  type="link"
                  onClick={() => navigate("/login")}
                  className="cls-signIn infiniti-btn-primary px-6 h-[32px] flex align-center justify-center"
                >
                  Sign in
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          .cls-signIn span {
            color: var(--infiniti-primary);
            font-weight: 500;
          }
          .cls-accessibility span {
            font-weight: 700;
          }
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
