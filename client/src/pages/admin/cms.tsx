import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Input,
  Select,
  Modal,
  Form,
  Switch,
  Upload,
  Tabs,
  List,
  Avatar,
  Badge,
  Breadcrumb,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  FileTextOutlined,
  PictureOutlined,
  SettingOutlined,
  GlobalOutlined,
  BellOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useLocation } from "wouter";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function CMS() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("pages");
  const [form] = Form.useForm();

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isAdminLoggedIn) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setLocation("/admin/login");
  };

  const mockPages = [
    {
      id: 1,
      title: "Homepage",
      slug: "/",
      status: "Published",
      lastModified: "2024-01-15",
      author: "Admin",
      views: 1250,
    },
    {
      id: 2,
      title: "About Us",
      slug: "/about",
      status: "Published",
      lastModified: "2024-01-10",
      author: "Admin",
      views: 856,
    },
    {
      id: 3,
      title: "Terms & Conditions",
      slug: "/terms",
      status: "Draft",
      lastModified: "2024-01-12",
      author: "Admin",
      views: 234,
    },
  ];

  const mockContent = [
    {
      id: 1,
      title: "Welcome Banner",
      type: "Banner",
      location: "Homepage",
      status: "Active",
      lastModified: "2024-01-15",
    },
    {
      id: 2,
      title: "Flight Search Tips",
      type: "Article",
      location: "Help Section",
      status: "Active",
      lastModified: "2024-01-12",
    },
    {
      id: 3,
      title: "Group Booking Benefits",
      type: "Content Block",
      location: "Homepage",
      status: "Inactive",
      lastModified: "2024-01-10",
    },
  ];

  const pageColumns = [
    {
      title: "Page Title",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div>
          <Text strong>{title}</Text>
          <br />
          <Text type="secondary" className="text-sm">
            {record.slug}
          </Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Published" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Last Modified",
      dataIndex: "lastModified",
      key: "lastModified",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      render: (views) => <Text>{views.toLocaleString()}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  const contentColumns = [
    {
      title: "Content Title",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div>
          <Text strong>{title}</Text>
          <br />
          <Text type="secondary" className="text-sm">
            {record.type}
          </Text>
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
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
      title: "Last Modified",
      dataIndex: "lastModified",
      key: "lastModified",
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
              <div className="flex items-center space-x-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg px-4 py-3 shadow-md">
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-blue-600 text-xs">⚙️</span>
                </div>
                <Text className="text-white font-medium">CMS Management</Text>
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
              <div
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all duration-200"
                onClick={() => setLocation("/admin/admin-settings")}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-current text-xs">🔧</span>
                </div>
                <Text className="text-current">System Settings</Text>
              </div>
            </nav>
          </div>

          {/* User Info at bottom */}
          <div className="absolute bottom-0 left-0 right-0 w-64 p-6 border-t border-slate-700">
            <div className="flex items-center space-x-3">
              <Avatar
                size="small"
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <span className="text-white font-medium">JD</span>
              </Avatar>
              <div className="flex-1">
                <Text className="text-white font-medium block">John Doe</Text>
                <Text className="text-slate-300 text-sm">System Admin</Text>
              </div>
            </div>
            <Button
              type="text"
              onClick={handleLogout}
              className="w-full mt-4 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              size="small"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item>
              <HomeOutlined />
              <span className="ml-1">Home</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>CMS Management</Breadcrumb.Item>
          </Breadcrumb>

          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <Title level={2} className="!mb-1 text-gray-900">
                Content Management System
              </Title>
              <Text className="text-gray-600">
                Manage website content, pages, and media assets
              </Text>
            </div>
            <Space>
              <Button icon={<UploadOutlined />}>Import Content</Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Create Content
              </Button>
            </Space>
          </div>

          {/* Stats Cards */}
          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-gray-500 text-sm block mb-2">
                      Total Pages
                    </Text>
                    <Title level={3} className="!mb-0 text-gray-900">
                      24
                    </Title>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileTextOutlined className="text-blue-600 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-gray-500 text-sm block mb-2">
                      Media Files
                    </Text>
                    <Title level={3} className="!mb-0 text-gray-900">
                      156
                    </Title>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <PictureOutlined className="text-green-600 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-gray-500 text-sm block mb-2">
                      Content Blocks
                    </Text>
                    <Title level={3} className="!mb-0 text-gray-900">
                      42
                    </Title>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <SettingOutlined className="text-purple-600 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-gray-500 text-sm block mb-2">
                      Page Views
                    </Text>
                    <Title level={3} className="!mb-0 text-gray-900">
                      2.3K
                    </Title>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <GlobalOutlined className="text-orange-600 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Content Tabs */}
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Pages" key="pages">
                <div className="mb-4">
                  <Space>
                    <Input
                      placeholder="Search pages..."
                      prefix={<SearchOutlined />}
                      style={{ width: 250 }}
                    />
                    <Select
                      placeholder="Status"
                      style={{ width: 120 }}
                      options={[
                        { value: "all", label: "All Status" },
                        { value: "published", label: "Published" },
                        { value: "draft", label: "Draft" },
                      ]}
                    />
                  </Space>
                </div>
                <Table
                  columns={pageColumns}
                  dataSource={mockPages}
                  loading={loading}
                  rowKey="id"
                  pagination={false}
                />
              </TabPane>

              <TabPane tab="Content Blocks" key="content">
                <div className="mb-4">
                  <Space>
                    <Input
                      placeholder="Search content..."
                      prefix={<SearchOutlined />}
                      style={{ width: 250 }}
                    />
                    <Select
                      placeholder="Type"
                      style={{ width: 140 }}
                      options={[
                        { value: "all", label: "All Types" },
                        { value: "banner", label: "Banner" },
                        { value: "article", label: "Article" },
                        { value: "block", label: "Content Block" },
                      ]}
                    />
                  </Space>
                </div>
                <Table
                  columns={contentColumns}
                  dataSource={mockContent}
                  loading={loading}
                  rowKey="id"
                  pagination={false}
                />
              </TabPane>

              <TabPane tab="Media Library" key="media">
                <div className="mb-4">
                  <Space>
                    <Upload>
                      <Button icon={<UploadOutlined />}>Upload Media</Button>
                    </Upload>
                    <Input
                      placeholder="Search media..."
                      prefix={<SearchOutlined />}
                      style={{ width: 250 }}
                    />
                  </Space>
                </div>
                <Row gutter={[16, 16]}>
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Col xs={12} sm={8} md={6} lg={4} key={item}>
                      <Card
                        hoverable
                        cover={
                          <div className="h-32 bg-gray-100 flex items-center justify-center">
                            <PictureOutlined className="text-2xl text-gray-400" />
                          </div>
                        }
                        actions={[
                          <EyeOutlined key="view" />,
                          <EditOutlined key="edit" />,
                          <DeleteOutlined key="delete" />,
                        ]}
                      >
                        <Card.Meta
                          title={`Image ${item}.jpg`}
                          description="2.3 MB"
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>

              <TabPane tab="Site Settings" key="settings">
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="General Settings">
                      <Form layout="vertical">
                        <Form.Item label="Site Title">
                          <Input defaultValue="Group Retail Travel" />
                        </Form.Item>
                        <Form.Item label="Site Description">
                          <Input.TextArea
                            rows={3}
                            defaultValue="Group travel booking platform"
                          />
                        </Form.Item>
                        <Form.Item label="Contact Email">
                          <Input defaultValue="contact@groupretail.com" />
                        </Form.Item>
                        <Form.Item label="Maintenance Mode">
                          <Switch />
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Card title="SEO Settings">
                      <Form layout="vertical">
                        <Form.Item label="Meta Keywords">
                          <Input placeholder="group travel, booking, flights" />
                        </Form.Item>
                        <Form.Item label="Google Analytics ID">
                          <Input placeholder="GA-XXXXXXXXX" />
                        </Form.Item>
                        <Form.Item label="Facebook Pixel ID">
                          <Input placeholder="XXXXXXXXXXXXXXX" />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary">Save Settings</Button>
                        </Form.Item>
                      </Form>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>

          {/* Create Content Modal */}
          <Modal
            title="Create New Content"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={600}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="type"
                label="Content Type"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select content type"
                  options={[
                    { value: "page", label: "Page" },
                    { value: "banner", label: "Banner" },
                    { value: "article", label: "Article" },
                    { value: "block", label: "Content Block" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter title" />
              </Form.Item>
              <Form.Item name="slug" label="Slug">
                <Input placeholder="enter-slug" />
              </Form.Item>
              <Form.Item name="content" label="Content">
                <Input.TextArea rows={6} placeholder="Enter content" />
              </Form.Item>
              <Form.Item name="status" label="Status" valuePropName="checked">
                <Switch checkedChildren="Published" unCheckedChildren="Draft" />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button onClick={() => setIsModalVisible(false)}>
                    Cancel
                  </Button>
                  <Button type="primary">Create Content</Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
}
