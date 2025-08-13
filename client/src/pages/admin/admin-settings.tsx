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
  Checkbox,
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
import { useNavigate } from "react-router-dom";
import BreadcrumbNav from "@/components/breadcrumb/breadcrumb";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function AdminSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [form] = Form.useForm();
  const [editUserForm] = Form.useForm();

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Fetch users from database
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await fetch('/api/users');

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched users data:', data);

      // Check if response has the expected structure
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      // Transform database user data to match table format
      const transformedUsers = (data.users || []).map(user => ({
        id: user.id,
        name: user.name || 'N/A',
        email: user.email || user.username || 'N/A',
        phone: user.phone || 'N/A',
        role: user.isRetailAllowed ? "Retail User" : "Regular User",
        status: user.isRetailAllowed ? "Active" : "Inactive",
        lastLogin: "N/A", // We don't track last login in current schema
        permissions: user.isRetailAllowed ? ["Retail Access"] : ["Basic Access"],
      }));

      console.log('Transformed users:', transformedUsers);
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert(`Failed to fetch users from database: ${error.message}`);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  };

  const handleCreateUser = async (values) => {
    try {
      setLoading(true);

      // Map status to r_status value (1 for active, 2 for inactive)
      const rStatus = values.status ? 1 : 2;

      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        username: values.username,
        password: values.password,
        name: `${values.firstName} ${values.lastName}`,
        role: values.role || 'user',
        isRetailAllowed: values.isRetailAllowed || false,
        rStatus: rStatus, // Add r_status mapping
      };

      console.log('Sending user data:', userData);

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create user');
      }

      if (!responseData.success) {
        throw new Error(responseData.message || 'User creation failed');
      }

      // Refresh users list from database
      await fetchUsers();
      setIsUserModalVisible(false);
      form.resetFields();

      console.log('User created successfully:', responseData.user);
      alert('User created successfully!');

    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    editUserForm.setFieldsValue({
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1] || '',
      email: user.email,
      phone: user.phone || '',
      status: user.status === "Active",
    });
    setIsEditUserModalVisible(true);
  };

  const handleUpdateUser = async (values) => {
    try {
      setLoading(true);
      const userId = editingUser.id;

      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        isRetailAllowed: values.status,
      };

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update user');
      }

      if (!responseData.success) {
        throw new Error(responseData.message || 'User update failed');
      }

      await fetchUsers(); // Refresh users list
      setIsEditUserModalVisible(false);
      setEditingUser(null);
      editUserForm.resetFields();

      alert('User updated successfully!');

    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to delete user');
      }

      if (!responseData.success) {
        throw new Error(responseData.message || 'User deletion failed');
      }

      await fetchUsers(); // Refresh users list
      alert('User deleted successfully!');

    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user: ' + error.message);
    } finally {
      setLoading(false);
    }
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
            <br />
            <Text type="secondary" className="text-sm">
              📞 {record.phone}
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
          "Retail User": "blue",
          "Regular User": "green",
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
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditUser(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteUser(record.id)}
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="flex-1 p-6">
      {/* Breadcrumb */}
      <BreadcrumbNav currentMenu="System settings" />

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
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
              dataSource={users}
              loading={usersLoading}
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
                        <Select.Option value="EST">Eastern Time</Select.Option>
                        <Select.Option value="PST">Pacific Time</Select.Option>
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
                      <Select defaultValue="daily" style={{ width: "100%" }}>
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
                        <Select.Option value="warning">Warning</Select.Option>
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
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Please enter a username" },
              { min: 3, message: "Username must be at least 3 characters" }
            ]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 8, message: "Password must be at least 8 characters" }
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="retail_user">Retail User</Select.Option>
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
              <Button
                type="primary"
                onClick={() => form.validateFields().then(handleCreateUser)}
                loading={loading}
              >
                Create User
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

        {/* Edit User Modal */}
        <Modal
          title="Edit User"
          open={isEditUserModalVisible}
          onOk={() => editUserForm.submit()}
          onCancel={() => {
            setIsEditUserModalVisible(false);
            setEditingUser(null);
            editUserForm.resetFields();
          }}
          confirmLoading={loading}
          width={600}
        >
          <Form
            form={editUserForm}
            layout="vertical"
            onFinish={handleUpdateUser}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: "Please enter first name" },
                    { min: 2, message: "First name must be at least 2 characters" },
                  ]}
                >
                  <Input placeholder="Enter first name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: "Please enter last name" },
                    { min: 2, message: "Last name must be at least 2 characters" },
                  ]}
                >
                  <Input placeholder="Enter last name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email address" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter phone number" },
              ]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item name="status" valuePropName="checked">
              <Checkbox>Allow Retail Access</Checkbox>
            </Form.Item>
          </Form>
        </Modal>
    </div>
  );
}