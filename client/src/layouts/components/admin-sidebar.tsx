import { memo, useMemo } from "react";
import { Layout, Menu, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
const { Sider } = Layout;
const { Text } = Typography;

const menuItems = [
  {
    key: "Dashboard",
    icon: <span className="text-xs">📊</span>,
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    key: "Offer Management",
    icon: <span className="text-xs">🎯</span>,
    label: "Offer Management",
    path: "/admin/offer-management",
  },
  {
    key: "Bid Management",
    icon: <span className="text-xs">🏆</span>,
    label: "Bid Management",
    path: "/admin/bid-management",
  },
  {
    key: "Booking Management",
    icon: <span className="text-xs">📅</span>,
    label: "Booking Management",
    path: "/admin/bookings",
  },
  {
    key: "CMS Management",
    icon: <span className="text-xs">📝</span>,
    label: "CMS Management",
    path: "/admin/cms",
  },
  {
    key: "Reports & Analytics",
    icon: <span className="text-xs">📊</span>,
    label: "Reports & Analytics",
    path: "/admin/reports",
  },
  {
    key: "System Settings",
    icon: <span className="text-xs">🔧</span>,
    label: "System Settings",
    path: "/admin/admin-settings",
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Calculate activeMenu directly from current path (no state needed)
  const activeMenu = useMemo(() => {
    const matchedItem = menuItems.find((item) =>
      location.pathname.startsWith(item.path)
    );
    return matchedItem?.key || localStorage.getItem("activeMenu") || "";
  }, [location.pathname]);

  const handleMenuClick = (itemKey: string, path: string) => {
    localStorage.setItem("activeMenu", itemKey);
    navigate(path);
  };

  return (
    <Sider
      width={224}
      className="w-56 !fixed !h-screen !overflow-y-auto !left-0 !top-0 !bottom-0 z-50 shadow-xl"
    
    >
      <div className="flex items-center space-x-4 border-b-2 border-white-200 px-4 py-[14px]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="font-bold text-lg text-[var(--foreground)]">
              GR
            </span>
          </div>
          <div>
            <Text className="text-white text-md font-bold block">
              GROUP RETAIL
            </Text>
            <Text className="text-white text-xs">ADMIN PORTAL</Text>
          </div>
        </div>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[activeMenu]}
        className="bg-transparent p-2"
      >
        {menuItems.map((item) => (
          <Menu.Item
            key={item.key}
            icon={
              <div className="w-5 h-5 flex items-center justify-center">
                {item.icon}
              </div>
            }
            className={`!flex !items-center !space-x-3 !rounded-lg !px-2 !py-3 !my-3 !mx-0 ${
              activeMenu === item.key
                ? "!text-white !bg-gradient-to-r !from-blue-600 !to-purple-600 !shadow-md"
                : "!text-slate-300 hover:!text-white hover:!bg-gradient-to-r hover:!from-blue-600 hover:!to-purple-600"
            }`}
            onClick={() => handleMenuClick(item.key, item.path)}
          >
            <Text className="!text-current">{item.label}</Text>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default memo(AdminSidebar);
