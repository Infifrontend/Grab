import { Theme } from "@/components/Theme/Theme";
import AccessibilityHeader from "@/components/ui/accessibility-header";
import { BellOutlined, CalendarOutlined, CreditCardOutlined, DownOutlined, EnvironmentOutlined, LogoutOutlined, MailOutlined, PhoneOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Card, Divider, Dropdown, Flex, Popover, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import Notification from "./notification";
const Text = Typography;

const AdminHeader = () => {
  const navigate = useNavigate();

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
          ".cls-accessibility-popover .cls-default"
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

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminUsername");
    navigate("/admin/login");
  };

  return (
    /* Header */
    <div className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-end">
          {/* <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GR</span>
              </div>
              <div>
                <Text className="text-current text-sm font-medium block mb-1">
                  GROUP RETAIL
                </Text>
                <Text className="text-current text-xs">ADMIN PORTAL</Text>
              </div>
            </div>
          </div> */}
          <div className="flex items-center space-x-4">
            <Notification />
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
                onKeyDown={changeFocus}
              >
                {"Accessibility"}
              </Button>
            </Popover>
            <Theme />
            {/* <Avatar size="small" className="bg-blue-600">
              <span className="text-white font-medium">JD</span>
            </Avatar>
            <div className="text-right">
              <Text className="font-medium text-gray-900 block">John Doe</Text>
              <Text className="text-gray-500 text-sm">System Admin</Text>
            </div> */}
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
                        System Admin
                      </Typography.Text>
                    </div>
                  </div>

                  <Space>
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
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </Card>
              )}
            >
              <div className="flex items-center cursor-pointer rounded-lg transition-colors">
                <Avatar size="large" icon={<UserOutlined />} />
                {/* <span className="text-gray-600 font-medium">John Smith</span> */}
                <Flex wrap className="pl-2" gap={2}>
                  <Text className="text-gray-600 font-bold block truncate">
                    John Doe
                  </Text>
                  <Text className="text-slate-400 w-full block text-xs truncate">
                    System Admin
                  </Text>
                </Flex>
                <DownOutlined className="text-xs font-bold text-gray-600 absolute right-10" />
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

          .ant-popover-content {
            padding: 12px !important;
          }

          .ant-popover {
            max-width: 350px !important;
          }
        `}
      </style>
    </div>
  );
};

export default AdminHeader;
