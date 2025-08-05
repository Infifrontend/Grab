import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Select,
  DatePicker,
  Space,
  Table,
  Statistic,
  Progress,
  Tabs,
  List,
  Avatar,
  Badge,
} from "antd";
import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  TrophyOutlined,
  BarChartOutlined,
  LineChartOutlined,
  BellOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import BreadcrumbNav from "@/components/breadcrumb/breadcrumb";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function Reports() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("last30days");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const revenueData = [
    { month: "Jan", revenue: 45000, bookings: 89 },
    { month: "Feb", revenue: 52000, bookings: 103 },
    { month: "Mar", revenue: 48000, bookings: 95 },
    { month: "Apr", revenue: 61000, bookings: 121 },
    { month: "May", revenue: 55000, bookings: 109 },
    { month: "Jun", revenue: 67000, bookings: 133 },
  ];

  const routePerformance = [
    { route: "LAX → JFK", bookings: 145, revenue: 362500, growth: 23.5 },
    { route: "ORD → LAX", bookings: 129, revenue: 322500, growth: 18.2 },
    { route: "MIA → SFO", bookings: 98, revenue: 245000, growth: -12.8 },
    { route: "DEN → BOS", bookings: 87, revenue: 217500, growth: 15.4 },
  ];

  const topCustomers = [
    {
      name: "Acme Corporation",
      bookings: 45,
      revenue: 112500,
      avgBookingValue: 2500,
    },
    {
      name: "Global Tech Inc",
      bookings: 38,
      revenue: 95000,
      avgBookingValue: 2500,
    },
    {
      name: "Business Solutions Ltd",
      bookings: 32,
      revenue: 80000,
      avgBookingValue: 2500,
    },
    {
      name: "Enterprise Group",
      bookings: 28,
      revenue: 70000,
      avgBookingValue: 2500,
    },
  ];

  const bookingStatusData = [
    { name: "Confirmed", value: 68, color: "var(--ant-color-success)" },
    { name: "Pending", value: 22, color: "var(--ant-color-warning)" },
    { name: "Cancelled", value: 10, color: "var(--ant-color-error)" },
  ];

  const routeColumns = [
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
    },
    {
      title: "Bookings",
      dataIndex: "bookings",
      key: "bookings",
      render: (bookings) => <Text strong>{bookings}</Text>,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue) => (
        <Text className="text-green-600">${revenue.toLocaleString()}</Text>
      ),
    },
    {
      title: "Growth",
      dataIndex: "growth",
      key: "growth",
      render: (growth) => (
        <Text className={growth > 0 ? "text-green-600" : "text-red-600"}>
          {growth > 0 ? "+" : ""}
          {growth}%
        </Text>
      ),
    },
  ];

  const customerColumns = [
    {
      title: "Customer",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <div className="flex items-center space-x-2">
          <Avatar size="small" icon={<UserOutlined />} />
          <Text strong>{name}</Text>
        </div>
      ),
    },
    {
      title: "Bookings",
      dataIndex: "bookings",
      key: "bookings",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue) => (
        <Text className="text-green-600">${revenue.toLocaleString()}</Text>
      ),
    },
    {
      title: "Avg Booking Value",
      dataIndex: "avgBookingValue",
      key: "avgBookingValue",
      render: (value) => <Text>${value.toLocaleString()}</Text>,
    },
  ];

  return (
    <div className="flex-1 p-6">
      {/* Breadcrumb */}
      <BreadcrumbNav currentMenu="Reports & Analytics" />
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title level={2} className="!mb-1 text-gray-900">
            Reports & Analytics
          </Title>
          <Text className="text-gray-600">
            Comprehensive business insights and performance reports
          </Text>
        </div>
        <Space>
          <Select
            value={dateRange}
            onChange={setDateRange}
            style={{ width: 150 }}
            options={[
              { value: "last7days", label: "Last 7 days" },
              { value: "last30days", label: "Last 30 days" },
              { value: "last90days", label: "Last 90 days" },
              { value: "lastyear", label: "Last year" },
              { value: "custom", label: "Custom range" },
            ]}
          />
          <RangePicker
            disabledDate={(current) =>
              current && current.isBefore(new Date(), "day")
            }
          />
          <Button icon={<DownloadOutlined />}>Export All</Button>
        </Space>
      </div>

      {/* Summary Stats */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={328500}
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ color: "var(--textGreen600)" }}
              suffix={
                <span className="text-sm text-green-600 ml-2">+12.5% ↗</span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={459}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "var(--textBlue600)" }}
              suffix={
                <span className="text-sm text-blue-600 ml-2">+8.3% ↗</span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Passengers"
              value={5742}
              prefix={<UserOutlined />}
              valueStyle={{ color: "var(--textPurple600)" }}
              suffix={
                <span className="text-sm text-purple-600 ml-2">+15.7% ↗</span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Booking Value"
              value={716}
              prefix={<TrophyOutlined />}
              precision={0}
              valueStyle={{ color: "var(--textOrange600)" }}
              suffix={
                <span className="text-sm text-orange-600 ml-2">+4.2% ↗</span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Reports Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Overview" key="overview">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card title="Revenue & Bookings Trend" className="mb-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Bar
                          dataKey="revenue"
                          fill="var(--infiniti-lighter-blue)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card title="Booking Status Distribution" className="mb-6">
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={bookingStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {bookingStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    {bookingStatusData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <Text className="text-sm">
                          {item.name} ({item.value}%)
                        </Text>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>

              <Col xs={24}>
                <Card title="Top Performing Routes">
                  <Table
                    columns={routeColumns}
                    dataSource={routePerformance}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Financial Reports" key="financial">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card title="Monthly Revenue Breakdown">
                  <List
                    dataSource={revenueData}
                    renderItem={(item) => (
                      <List.Item>
                        <div className="flex justify-between items-center w-full">
                          <Text>{item.month} 2024</Text>
                          <div className="flex items-center space-x-4">
                            <Text className="text-green-600 font-semibold">
                              ${item.revenue.toLocaleString()}
                            </Text>
                            <div className="w-20">
                              <Progress
                                percent={(item.revenue / 70000) * 100}
                                showInfo={false}
                                strokeColor="var(--ant-color-success)"
                              />
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Revenue by Payment Method">
                  <List
                    dataSource={[
                      {
                        method: "Credit Card",
                        amount: 245000,
                        percentage: 74.6,
                      },
                      {
                        method: "Bank Transfer",
                        amount: 58500,
                        percentage: 17.8,
                      },
                      {
                        method: "Corporate Account",
                        amount: 25000,
                        percentage: 7.6,
                      },
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <div className="flex justify-between items-center w-full">
                          <Text>{item.method}</Text>
                          <div className="flex items-center space-x-4">
                            <Text className="text-green-600 font-semibold">
                              ${item.amount.toLocaleString()}
                            </Text>
                            <Text className="text-gray-500 text-sm">
                              {item.percentage}%
                            </Text>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              <Col xs={24}>
                <Card
                  title="Export Financial Reports"
                  extra={
                    <Space>
                      <Button icon={<FileExcelOutlined />} type="primary">
                        Excel Report
                      </Button>
                      <Button icon={<FilePdfOutlined />}>PDF Report</Button>
                    </Space>
                  }
                >
                  <Text type="secondary">
                    Generate detailed financial reports including revenue
                    breakdowns, payment analysis, and profit margins.
                  </Text>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Customer Reports" key="customers">
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <Card title="Top Customers by Revenue" className="mb-6">
                  <Table
                    columns={customerColumns}
                    dataSource={topCustomers}
                    pagination={false}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Customer Acquisition">
                  <div className="space-y-4">
                    {[
                      {
                        source: "Direct",
                        customers: 145,
                        percentage: 42.5,
                      },
                      {
                        source: "Referral",
                        customers: 98,
                        percentage: 28.7,
                      },
                      {
                        source: "Marketing",
                        customers: 67,
                        percentage: 19.6,
                      },
                      {
                        source: "Partnership",
                        customers: 32,
                        percentage: 9.4,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <Text>{item.source}</Text>
                        <div className="flex items-center space-x-4">
                          <Text strong>{item.customers} customers</Text>
                          <div className="w-24">
                            <Progress
                              percent={item.percentage}
                              showInfo={false}
                              strokeColor="var(--infiniti-lighter-blue)"
                            />
                          </div>
                          <Text className="text-gray-500 w-12">
                            {item.percentage}%
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Customer Retention">
                  <div className="space-y-4">
                    {[
                      {
                        period: "New Customers",
                        rate: 100,
                        color: "var(--ant-color-success)",
                      },
                      {
                        period: "1-6 Months",
                        rate: 75,
                        color: "var(--infiniti-lighter-blue)",
                      },
                      {
                        period: "6-12 Months",
                        rate: 45,
                        color: "var(--ant-color-warning)",
                      },
                      { period: "12+ Months", rate: 28, color: "#722ed1" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <Text>{item.period}</Text>
                        <div className="flex items-center space-x-4">
                          <div className="w-32">
                            <Progress
                              percent={item.rate}
                              strokeColor={item.color}
                              format={(percent) => `${percent}%`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Operational Reports" key="operational">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={8}>
                <Card title="Booking Processing Time">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Text>Instant (&lt; 1 min)</Text>
                      <Text strong>67%</Text>
                    </div>
                    <Progress
                      percent={67}
                      strokeColor="var(--ant-color-success)"
                    />

                    <div className="flex justify-between">
                      <Text>Fast (1-5 min)</Text>
                      <Text strong>23%</Text>
                    </div>
                    <Progress
                      percent={23}
                      strokeColor="var(--infiniti-lighter-blue)"
                    />

                    <div className="flex justify-between">
                      <Text>Normal (5-15 min)</Text>
                      <Text strong>8%</Text>
                    </div>
                    <Progress
                      percent={8}
                      strokeColor="var(--ant-color-warning)"
                    />

                    <div className="flex justify-between">
                      <Text>Slow (&gt; 15 min)</Text>
                      <Text strong>2%</Text>
                    </div>
                    <Progress
                      percent={2}
                      strokeColor="var(--ant-color-error)"
                    />
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card title="System Performance">
                  <div className="space-y-6">
                    <div>
                      <Text className="block mb-2">Server Uptime</Text>
                      <Progress
                        percent={99.8}
                        strokeColor="var(--ant-color-success)"
                      />
                      <Text type="secondary" className="text-sm">
                        99.8% (Last 30 days)
                      </Text>
                    </div>

                    <div>
                      <Text className="block mb-2">Average Response Time</Text>
                      <Progress
                        percent={85}
                        strokeColor="var(--infiniti-lighter-blue)"
                      />
                      <Text type="secondary" className="text-sm">
                        245ms average
                      </Text>
                    </div>

                    <div>
                      <Text className="block mb-2">Error Rate</Text>
                      <Progress
                        percent={2}
                        strokeColor="var(--ant-color-error)"
                      />
                      <Text type="secondary" className="text-sm">
                        0.2% error rate
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card title="Support Metrics">
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <Text className="text-2xl font-bold text-blue-600 block">
                        4.8/5
                      </Text>
                      <Text className="text-gray-600">
                        Customer Satisfaction
                      </Text>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded">
                      <Text className="text-2xl font-bold text-blue-600 block">
                        &lt; 2h
                      </Text>
                      <Text className="text-gray-600">Avg Response Time</Text>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded">
                      <Text className="text-2xl font-bold text-purple-600 block">
                        94%
                      </Text>
                      <Text className="text-gray-600">
                        First Contact Resolution
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
