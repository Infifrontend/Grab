import { apiRequest } from "@/lib/queryClient";
import { CheckOutlined, CloseOutlined, BellOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { message, Popover, Typography, Badge, Button, Empty } from "antd";
import { useEffect, useState } from "react";

const Notification = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);

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
  const unreadCount = notifications.filter((n:any) => !n.isRead).length;

  const handleViewAllNotifications = () => {
    console.log("View all notifications");
    setNotificationOpen(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await apiRequest(
        "PUT",
        `/api/notifications/${notificationId}/read`,
        {}
      );
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
      const response = await apiRequest(
        "PUT",
        "/api/notifications/mark-all-read",
        {}
      );
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
      case "bid_created":
        return (
          <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs">💰</span>
          </div>
        );
      case "bid_accepted":
        return (
          <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
            <CheckOutlined className="text-white text-xs" />
          </div>
        );
      case "bid_rejected":
        return (
          <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center">
            <CloseOutlined className="text-white text-xs" />
          </div>
        );
      case "payment_received":
        return (
          <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs">💳</span>
          </div>
        );
      case "booking_confirmed":
        return (
          <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs">📋</span>
          </div>
        );
      default:
        return (
          <div className="w-4 h-4 bg-gray-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs">ℹ️</span>
          </div>
        );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-orange-500";
      default:
        return "border-l-blue-500";
    }
  };

  // Poll for new notifications every 5 seconds when component is mounted
  useEffect(() => {
    const interval = setInterval(() => {
      refetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetchNotifications]);

  return (
    <>
      <Popover
        content={
          <div className="w-75 max-w-sm">
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
                      <span className="text-gray-500">
                        No notifications yet
                      </span>
                    }
                  />
                </div>
              ) : (
                notifications.map((notification: any) => (
                  <div
                    key={notification.id}
                    className={`relative p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 border-l-4 ${getPriorityColor(
                      notification.priority
                    )} ${!notification.isRead ? "bg-blue-50" : ""}`}
                    onClick={() =>
                      !notification.isRead && handleMarkAsRead(notification.id)
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <Typography.Text
                            className={`font-semibold text-gray-900 text-sm block leading-tight ${
                              !notification.isRead ? "font-bold" : ""
                            }`}
                          >
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
        className="notification-popover"
      >
        <Badge count={unreadCount} size="small" className="mr-2 cursor-pointer">
          <BellOutlined className="text-gray-500 text-lg" />
        </Badge>
      </Popover>
      <style>
        {`
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .notification-popover.ant-badge .ant-badge-count {
            border-radius: 50%;
            height: 18px;
            width: 18px;
            padding-block: 2px;
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
        `}
      </style>
    </>
  );
};

export default Notification;
