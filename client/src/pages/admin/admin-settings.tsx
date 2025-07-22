import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Switch,
  Table,
  Space,
  Modal,
  Avatar,
  Tag,
  Tabs,
  Upload,
  Divider,
  Badge,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  UploadOutlined,
  MailOutlined,
  PhoneOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useLocation } from "wouter";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [form] = Form.useForm();

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isAdminLoggedIn) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const mockUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Super Admin",
      status: "Active",
      lastLogin: "2024-01-15 14:30",
      permissions: ["Full Access"],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@company.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-01-14 09:15",
      permissions: ["Booking Management", "Offer Management"],
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike.wilson@company.com",
      role: "Operator",
      status: "Inactive",
      lastLogin: "2024-01-10 16:45",
      permissions: ["View Only"],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    setLocation('/admin/login');
  };

  const userColumns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" className="text-sm">
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const colors = {
          "Super Admin": "red",
          Admin: "blue",
          Operator: "green",
        };
        return <Tag color={colors[role]}>{role}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GR</span>
                </div>
                <div>
                  <Text className="text-gray-600 text-sm font-medium">
                    GROUP RETAIL
                  </Text>
                  <br />
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
                <Text className="font-medium text-gray-900 block">
                  John Doe
                </Text>
                <Text className="text-gray-500 text-sm">System Admin</Text>
              </div>
              <Tooltip title="Logout">
                <LogoutOutlined
                  className="text-gray-500 text-lg cursor-pointer"
                  onClick={handleLogout}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen sticky top-[73px] shadow-xl">
          <div className="p-6">
            <nav className="space-y-2">
              <div
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation("/admin/dashboard")}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">📊</span>
                </div>
                <Text className="text-current">Dashboard</Text>
              </div>
              <div
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation("/admin/offer-management")}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">🎯</span>
                </div>
                <Text className="text-current">Offer Management</Text>
              </div>
              <div
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation("/admin/bid-management")}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">🏆</span>
                </div>
                <Text className="text-current">Bid Management</Text>
              </div>
              <div
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation("/admin/bookings")}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">✈️</span>
                </div>
                <Text className="text-current">Booking Management</Text>
              </div>
              <div
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation("/admin/cms")}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">📝</span>
                </div>
                <Text className="text-current">CMS Management</Text>
              </div>
              <div
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation("/admin/reports")}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">📊</span>
                </div>
                <Text className="text-current">Reports & Analytics</Text>
              </div>
              <div className="flex items-center space-x-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 rounded-lg shadow-lg">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">🔧</span>
                </div>
                <Text className="text-white font-medium">System Settings</Text>
              </div>
            </nav>

            {/* User info section */}
            <div className="mt-auto pt-8">
              <div className="border-t border-slate-700 pt-4">
                <div className="flex items-center space-x-3 px-4 py-3">
                  <Avatar size="small" className="bg-blue-600">
                    <span className="text-white font-medium text-xs">JD</span>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Text className="text-white text-sm font-medium block truncate">
                      John Doe
                    </Text>
                    <Text className="text-slate-400 text-xs truncate">
                      Administrator
                    </Text>
                  </div>
                </div>
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  className="flex items-center w-full text-slate-300 hover:text-white hover:bg-slate-700 mt-2 mx-4"
                  onClick={handleLogout}
                >
                  <span className="ml-2">Sign out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2} className="!mb-1 text-gray-900">
                System Settings
              </Title>
              <Text className="text-gray-600">
                Manage system settings, users, and security configurations
              </Text>
            </div>
          </div>

          {/* Settings Tabs */}
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="User Management" key="users">
                <div className="mb-4">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsUserModalVisible(true)}
                  >
                    Add New User
                  </Button>
                </div>
                <Table
                  columns={userColumns}
                  dataSource={mockUsers}
                  loading={loading}
                  rowKey="id"
                  pagination={false}
                />
              </TabPane>

              <TabPane tab="System Settings" key="system">
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="Application Settings" className="mb-6">
                      <Form layout="vertical">
                        <Form.Item label="Application Name">
                          <Input defaultValue="Group Retail Admin" />
                        </Form.Item>
                        <Form.Item label="Default Language">
                          <Select defaultValue="en" style={{ width: "100%" }}>
                            <Select.Option value="en">English</Select.Option>
                            <Select.Option value="es">Spanish</Select.Option>
                            <Select.Option value="fr">French</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="Time Zone">
                          <Select defaultValue="UTC" style={{ width: "100%" }}>
                            <Select.Option value="UTC">UTC</Select.Option>
                            <Select.Option value="EST">
                              Eastern Time
                            </Select.Option>
                            <Select.Option value="PST">
                              Pacific Time
                            </Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="Session Timeout (minutes)">
                          <Input defaultValue="60" type="number" />
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Card title="Email Settings" className="mb-6">
                      <Form layout="vertical">
                        <Form.Item label="SMTP Server">
                          <Input placeholder="smtp.example.com" />
                        </Form.Item>
                        <Form.Item label="SMTP Port">
                          <Input defaultValue="587" type="number" />
                        </Form.Item>
                        <Form.Item label="Email Username">
                          <Input placeholder="admin@example.com" />
                        </Form.Item>
                        <Form.Item label="From Email">
                          <Input defaultValue="noreply@groupretail.com" />
                        </Form.Item>
                        <Form.Item label="Enable SSL">
                          <Switch defaultChecked />
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Security" key="security">
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="Password Policy" className="mb-6">
                      <Form layout="vertical">
                        <Form.Item label="Minimum Password Length">
                          <Input defaultValue="8" type="number" />
                        </Form.Item>
                        <Form.Item label="Require Uppercase Letters">
                          <Switch defaultChecked />
                        </Form.Item>
                        <Form.Item label="Require Numbers">
                          <Switch defaultChecked />
                        </Form.Item>
                        <Form.Item label="Require Special Characters">
                          <Switch />
                        </Form.Item>
                        <Form.Item label="Password Expiry (days)">
                          <Input defaultValue="90" type="number" />
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Card title="Login Security" className="mb-6">
                      <Form layout="vertical">
                        <Form.Item label="Max Login Attempts">
                          <Input defaultValue="5" type="number" />
                        </Form.Item>
                        <Form.Item label="Account Lockout Duration (minutes)">
                          <Input defaultValue="30" type="number" />
                        </Form.Item>
                        <Form.Item label="Two-Factor Authentication">
                          <Switch />
                        </Form.Item>
                        <Form.Item label="IP Whitelist">
                          <Input.TextArea
                            rows={3}
                            placeholder="Enter IP addresses, one per line"
                          />
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Notifications" key="notifications">
                <Card title="Notification Settings">
                  <Form layout="vertical">
                    <Title level={4}>Email Notifications</Title>
                    <Row gutter={[24, 16]}>
                      <Col xs={24} md={12}>
                        <Form.Item label="New Booking Notifications">
                          <Switch defaultChecked />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="Payment Notifications">
                          <Switch defaultChecked />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="System Alerts">
                          <Switch defaultChecked />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="User Registration">
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Divider />

                    <Title level={4}>SMS Notifications</Title>
                    <Row gutter={[24, 16]}>
                      <Col xs={24} md={12}>
                        <Form.Item label="Critical Alerts Only">
                          <Switch />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item label="Booking Confirmations">
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Divider />

                    <Title level={4}>Admin Email Recipients</Title>
                    <Form.Item label="Primary Admin Email">
                      <Input defaultValue="admin@groupretail.com" />
                    </Form.Item>
                    <Form.Item label="Secondary Admin Email">
                      <Input placeholder="secondary@groupretail.com" />
                    </Form.Item>
                  </Form>
                </Card>
              </TabPane>

              <TabPane tab="Backup & Logs" key="backup">
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="Backup Settings">
                      <Form layout="vertical">
                        <Form.Item label="Automatic Backup">
                          <Switch defaultChecked />
                        </Form.Item>
                        <Form.Item label="Backup Frequency">
                          <Select
                            defaultValue="daily"
                            style={{ width: "100%" }}
                          >
                            <Select.Option value="hourly">Hourly</Select.Option>
                            <Select.Option value="daily">Daily</Select.Option>
                            <Select.Option value="weekly">Weekly</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="Backup Retention (days)">
                          <Input defaultValue="30" type="number" />
                        </Form.Item>
                        <Form.Item>
                          <Space>
                            <Button type="primary">Create Backup Now</Button>
                            <Button>Download Latest Backup</Button>
                          </Space>
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Card title="System Logs">
                      <Form layout="vertical">
                        <Form.Item label="Log Level">
                          <Select defaultValue="info" style={{ width: "100%" }}>
                            <Select.Option value="debug">Debug</Select.Option>
                            <Select.Option value="info">Info</Select.Option>
                            <Select.Option value="warning">
                              Warning
                            </Select.Option>
                            <Select.Option value="error">Error</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item label="Log Retention (days)">
                          <Input defaultValue="90" type="number" />
                        </Form.Item>
                        <Form.Item>
                          <Space>
                            <Button>View Error Logs</Button>
                            <Button>View Access Logs</Button>
                            <Button>Download Logs</Button>
                          </Space>
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>

            <div className="mt-6 flex justify-end">
              <Space>
                <Button>Reset to Defaults</Button>
                <Button type="primary">Save All Settings</Button>
              </Space>
            </div>
          </Card>

          {/* Add User Modal */}
          <Modal
            title="Add New User"
            open={isUserModalVisible}
            onCancel={() => setIsUserModalVisible(false)}
            footer={null}
            width={600}
          >
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Enter first name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Enter last name" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
              <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                <Select placeholder="Select role">
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="operator">Operator</Select.Option>
                  <Select.Option value="viewer">Viewer</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="permissions" label="Permissions">
                <Select mode="multiple" placeholder="Select permissions">
                  <Select.Option value="booking_management">
                    Booking Management
                  </Select.Option>
                  <Select.Option value="offer_management">
                    Offer Management
                  </Select.Option>
                  <Select.Option value="bid_management">
                    Bid Management
                  </Select.Option>
                  <Select.Option value="cms">CMS</Select.Option>
                  <Select.Option value="reports">Reports</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="status" label="Status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button onClick={() => setIsUserModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button type="primary">Create User</Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
}