import { BellOutlined } from "@ant-design/icons";
import { Avatar, Badge, Typography } from "antd";
const Text = Typography;

const AdminHeader = () => {
  return (
    /* Header */
    <div className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GR</span>
              </div>
              <div>
                <Text className="text-gray-600 text-sm font-medium block mb-1">
                  GROUP RETAIL
                </Text>
                <Text className="text-gray-500 text-xs">ADMIN PORTAL</Text>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge count={5} size="small">
              <BellOutlined className="text-gray-500 text-lg" />
            </Badge>
            <Avatar size="small" className="bg-blue-600">
              <span className="text-white font-medium">JD</span>
            </Avatar>
            <div className="text-right">
              <Text className="font-medium text-gray-900 block">John Doe</Text>
              <Text className="text-gray-500 text-sm">System Admin</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;