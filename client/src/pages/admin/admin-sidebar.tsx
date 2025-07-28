import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
const Text = Typography;

const AdminSidebar = ({ activeMenu }: any) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminUsername");
    navigate("/admin/login");
  };

  return (
    <div
      className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 sticky top-[73px] shadow-xl"
      style={{ height: "calc(100vh - 73px)" }}
    >
      <div className="h-full overflow-y-auto">
        <div className="p-6">
          <nav className="space-y-2">
            <div
              className={`flex items-center space-x-3 ${
                activeMenu === "Dashboard"
                  ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
              } rounded-lg px-4 py-3`}
              onClick={() => navigate("/admin/dashboard")}
            >
              <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                <span className="text-blue-600 text-xs">📊</span>
              </div>
              <Text className="text-white font-medium">Dashboard</Text>
            </div>
            <div
              className={`flex items-center space-x-3 ${
                activeMenu === "Offer Management"
                  ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
              } rounded-lg px-4 py-3`}
              onClick={() => navigate("/admin/offer-management")}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="text-current text-xs">🎯</span>
              </div>
              <Text className="text-current">Offer Management</Text>
            </div>
            <div
              className={`flex items-center space-x-3 ${
                activeMenu === "Bid Management"
                  ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
              } rounded-lg px-4 py-3`}
              onClick={() => navigate("/admin/bid-management")}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="text-current text-xs">🏆</span>
              </div>
              <Text className="text-current">Bid Management</Text>
            </div>
            <div
              className={`flex items-center space-x-3 ${
                activeMenu === "Booking Management"
                  ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
              } rounded-lg px-4 py-3`}
              onClick={() => navigate("/admin/bookings")}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="text-current text-xs">📅</span>
              </div>
              <Text className="text-current">Booking Management</Text>
            </div>
            <div
              className={`flex items-center space-x-3 ${
                activeMenu === "CMS Management"
                  ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
              } rounded-lg px-4 py-3`}
              onClick={() => navigate("/admin/cms")}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="text-current text-xs">📝</span>
              </div>
              <Text className="text-current">CMS Management</Text>
            </div>
            <div
              className={`flex items-center space-x-3 ${
                activeMenu === "Reports & Analytics"
                  ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
              } rounded-lg px-4 py-3`}
              onClick={() => navigate("/admin/reports")}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="text-current text-xs">📊</span>
              </div>
              <Text className="text-current">Reports & Analytics</Text>
            </div>
            <div
              className={`flex items-center space-x-3 ${
                activeMenu === "System Settings"
                  ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
              } rounded-lg px-4 py-3`}
              onClick={() => navigate("/admin/admin-settings")}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="text-current text-xs">🔧</span>
              </div>
              <Text className="text-current">System Settings</Text>
            </div>
          </nav>
        </div>

        {/* User Info Section at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700">
          <div className="flex items-center space-x-3 bg-slate-800 rounded-lg p-3">
            <Avatar size="small" className="bg-blue-600 flex-shrink-0">
              <span className="text-white font-medium">JD</span>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-white font-medium text-sm block truncate">
                    John Doe
                  </Text>
                  <Text className="text-slate-400 text-xs truncate">
                    System Admin
                  </Text>
                </div>
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  size="small"
                  className="text-slate-400 hover:text-white flex-shrink-0"
                  onClick={handleLogout}
                  title="Logout"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
