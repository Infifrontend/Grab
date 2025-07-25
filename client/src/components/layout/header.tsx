import {
  Badge,
  Dropdown,
  Avatar,
  Popover,
  Typography,
  Empty,
  Card,
  Space,
  Button,
  Divider,
  message,
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
  CheckOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import type { MenuProps } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  actionData?: any;
}

export default function Header() {
  const [location, setLocation] = useLocation();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch notifications from API
  const { data: notificationsData, refetch: refetchNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/notifications");
        if (response.ok) {
          return await response.json();
        }
        return { notifications: [] };
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return { notifications: [] };
      }
    },
    refetchInterval: 5000, // Poll every 5 seconds for new notifications
  });

  const notifications: Notification[] = notificationsData?.notifications || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleViewAllNotifications = () => {
    console.log("View all notifications");
    setNotificationOpen(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await apiRequest("PUT", `/api/notifications/${notificationId}/read`, {});
      if (response.ok) {
        message.success("Notification marked as read");
        refetchNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      message.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await apiRequest("PUT", "/api/notifications/mark-all-read", {});
      if (response.ok) {
        message.success("All notifications marked as read");
        refetchNotifications();
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      message.error("Failed to mark all notifications as read");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bid_created':
        return <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs">💰</span>
        </div>;
      case 'bid_accepted':
        return <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
          <CheckOutlined className="text-white text-xs" />
        </div>;
      case 'bid_rejected':
        return <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center">
          <CloseOutlined className="text-white text-xs" />
        </div>;
      case 'payment_received':
        return <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs">💳</span>
        </div>;
      case 'booking_confirmed':
        return <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs">📋</span>
        </div>;
      default:
        return <div className="w-4 h-4 bg-gray-500 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs">ℹ️</span>
        </div>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-orange-500';
      default: return 'border-l-blue-500';
    }
  };

  // Poll for new notifications every 5 seconds when component is mounted
  useEffect(() => {
    const interval = setInterval(() => {
      refetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetchNotifications]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Check authentication status
  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const storedUsername = localStorage.getItem('username');

    if (userLoggedIn === 'true' && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setLocation('/login');
    }
  }, [setLocation]);

  const handleSignOut = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setLocation('/login');
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
            <Popover
              content={
                <div className="w-80 max-w-sm">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                    <div className="flex items-center gap-2">
                      <Typography.Title level={5} className="!mb-0 text-gray-900">
                        Notifications
                      </Typography.Title>
                    </div>
                    <div className="flex items-center gap-2">
                      <Typography.Text className="text-sm text-orange-500 font-medium">
                        {unreadCount} Unread
                      </Typography.Text>
                      {unreadCount > 0 && (
                        <Button
                          type="text"
                          size="small"
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800 p-1 h-auto"
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={
                            <span className="text-gray-500">No notifications yet</span>
                          }
                        />
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`relative p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 border-l-4 ${getPriorityColor(notification.priority)} ${!notification.isRead ? 'bg-blue-50' : ''}`}
                          onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <Typography.Text className={`font-semibold text-gray-900 text-sm block leading-tight ${!notification.isRead ? 'font-bold' : ''}`}>
                                  {notification.title}
                                </Typography.Text>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                                )}
                              </div>
                              <Typography.Text className="text-gray-600 text-xs mt-1 line-clamp-2">
                                {notification.message}
                              </Typography.Text>
                              <Typography.Text className="text-gray-400 text-xs mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </Typography.Text>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* View All Button */}
                  <div className="pt-3 border-t border-gray-100 mt-3">
                    <Button
                      type="primary"
                      className="w-full h-10 bg-blue-500 hover:bg-blue-600 border-0 rounded-lg font-medium"
                      onClick={handleViewAllNotifications}
                    >
                      View All Notifications
                    </Button>
                  </div>
                </div>
              }
              placement="bottomRight"
              trigger="click"
              open={notificationOpen}
              onOpenChange={setNotificationOpen}
            >
              <Badge count={unreadCount} size="small" overflowCount={99}>
                <BellOutlined className="text-lg text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
              </Badge>
            </Popover>

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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ant-popover-content {
          padding: 12px !important;
        }

        .ant-popover {
          max-width: 350px !important;
        }

        .notification-item {
          transition: all 0.2s ease;
        }

        .notification-item:hover {
          transform: translateX(2px);
        }

        .notification-unread {
          position: relative;
        }

        .notification-unread::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 0 2px 2px 0;
        }

        .notification-badge {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
      `}</style>
    </header>
  );
}