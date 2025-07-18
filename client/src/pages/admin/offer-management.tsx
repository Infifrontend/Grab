
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
  DatePicker,
  Modal,
  Form,
  InputNumber,
  Switch,
  Dropdown,
  Statistic,
  Progress
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  GiftOutlined,
  DollarOutlined,
  PercentageOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import { useLocation } from "wouter";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function OfferManagement() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
      setLocation('/admin/login');
    }
  }, [setLocation]);

  const mockOffers = [
    {
      id: 1,
      name: "Early Bird Special",
      type: "Discount",
      category: "General",
      discount: 15,
      status: "Active",
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
      usageCount: 234,
      revenue: 45000,
      conversionRate: 12.5
    },
    {
      id: 2,
      name: "Group Booking Discount",
      type: "Percentage",
      category: "Group",
      discount: 20,
      status: "Active",
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
      usageCount: 189,
      revenue: 38000,
      conversionRate: 8.9
    },
    {
      id: 3,
      name: "Flash Sale Weekend",
      type: "Fixed Amount",
      category: "Flash Sale",
      discount: 50,
      status: "Expired",
      validFrom: "2024-01-15",
      validTo: "2024-01-17",
      usageCount: 156,
      revenue: 32000,
      conversionRate: 15.2
    }
  ];

  const columns = [
    {
      title: 'Offer Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" className="text-sm">{record.category}</Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Percentage' ? 'blue' : type === 'Discount' ? 'green' : 'orange'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount, record) => (
        <Text strong>
          {record.type === 'Fixed Amount' ? `$${discount}` : `${discount}%`}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : status === 'Expired' ? 'red' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Usage/Revenue',
      key: 'usage',
      render: (_, record) => (
        <div>
          <Text>{record.usageCount} uses</Text>
          <br />
          <Text className="text-green-600 font-medium">${record.revenue.toLocaleString()}</Text>
        </div>
      ),
    },
    {
      title: 'Conversion Rate',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      render: (rate) => (
        <div>
          <Text>{rate}%</Text>
          <Progress percent={rate} size="small" showInfo={false} />
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Dropdown
            menu={{
              items: [
                { key: '1', label: 'Duplicate', icon: <PlusOutlined /> },
                { key: '2', label: 'Archive', icon: <DeleteOutlined /> },
              ],
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    form.setFieldsValue(offer);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('Form values:', values);
      setIsModalVisible(false);
      form.resetFields();
      setEditingOffer(null);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingOffer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Title level={2} className="!mb-1 text-gray-900">
              Offer Management
            </Title>
            <Text className="text-gray-600">
              Create, manage, and track promotional offers and discounts
            </Text>
          </div>
          <Space>
            <Button icon={<SearchOutlined />}>Export</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
              Create Offer
            </Button>
          </Space>
        </div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-500 text-sm block mb-2">Active Offers</Text>
                  <Title level={3} className="!mb-0 text-gray-900">24</Title>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GiftOutlined className="text-blue-600 text-xl" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-500 text-sm block mb-2">Total Revenue</Text>
                  <Title level={3} className="!mb-0 text-gray-900">$115K</Title>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarOutlined className="text-green-600 text-xl" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-500 text-sm block mb-2">Avg Conversion</Text>
                  <Title level={3} className="!mb-0 text-gray-900">12.2%</Title>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PercentageOutlined className="text-purple-600 text-xl" />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-500 text-sm block mb-2">Total Usage</Text>
                  <Title level={3} className="!mb-0 text-gray-900">579</Title>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CalendarOutlined className="text-orange-600 text-xl" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-6">
          <Space className="w-full" direction="horizontal" wrap>
            <Input
              placeholder="Search offers..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
            <Select
              placeholder="Status"
              style={{ width: 120 }}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'expired', label: 'Expired' },
                { value: 'draft', label: 'Draft' },
              ]}
            />
            <Select
              placeholder="Category"
              style={{ width: 140 }}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'general', label: 'General' },
                { value: 'group', label: 'Group' },
                { value: 'flash', label: 'Flash Sale' },
              ]}
            />
            <RangePicker placeholder={['Start Date', 'End Date']} />
          </Space>
        </Card>

        {/* Offers Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={mockOffers}
            loading={loading}
            rowKey="id"
            pagination={{
              total: mockOffers.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} offers`,
            }}
          />
        </Card>

        {/* Create/Edit Offer Modal */}
        <Modal
          title={editingOffer ? "Edit Offer" : "Create New Offer"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="name" label="Offer Name" rules={[{ required: true }]}>
                  <Input placeholder="Enter offer name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select category"
                    options={[
                      { value: 'general', label: 'General' },
                      { value: 'group', label: 'Group' },
                      { value: 'flash', label: 'Flash Sale' },
                      { value: 'seasonal', label: 'Seasonal' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="type" label="Discount Type" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select type"
                    options={[
                      { value: 'percentage', label: 'Percentage' },
                      { value: 'fixed', label: 'Fixed Amount' },
                      { value: 'discount', label: 'Discount' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="discount" label="Discount Value" rules={[{ required: true }]}>
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Enter discount value"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="validFrom" label="Valid From" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="validTo" label="Valid To" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} placeholder="Enter offer description" />
            </Form.Item>

            <Form.Item name="isActive" label="Status" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
