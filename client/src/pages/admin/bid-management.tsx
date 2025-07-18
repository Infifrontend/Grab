
import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Tabs,
  List,
  Typography,
  Space,
  Tag,
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Badge,
} from "antd";
import {
  DashboardOutlined,
  SettingOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  BarChartOutlined,
  PlusOutlined,
  EyeOutlined,
  FileSearchOutlined,
  TrendingUpOutlined,
  TrendingDownOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  BellOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Sider, Content, Header } = Layout;

export default function BidManagement() {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for statistics
  const statistics = {
    activeBids: { value: 3, change: "Awaiting response" },
    bidTypes: { value: 1, change: "Active configurations" },
    monthlyRevenue: { value: 47250, change: -15.3, isIncrease: false },
    acceptanceRate: { value: 72, change: -21.1, isIncrease: false },
    avgBidValue: { value: 185, change: -5.7, isIncrease: false },
    pendingReview: { value: 1, change: "Require attention" },
  };

  // Sample recent activity data
  const recentActivity = [
    {
      id: 1,
      type: "new",
      title: "New bid received: Economy to Business ($280)",
      time: "30 minutes ago",
      status: "new",
    },
    {
      id: 2,
      type: "counter",
      title: "Bid BID001 - Counter offer sent ($280)",
      time: "2 hours ago",
      status: "counter",
    },
    {
      id: 3,
      type: "accepted",
      title: "Bid BID002 - Auto-accepted ($120)",
      time: "4 hours ago",
      status: "accepted",
    },
    {
      id: 4,
      type: "rejected",
      title: "Bid BID005 - Rejected (below minimum)",
      time: "6 hours ago",
      status: "rejected",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <ExclamationCircleOutlined style={{ color: "#ff7a00" }} />;
      case "counter":
        return <ClockCircleOutlined style={{ color: "#1890ff" }} />;
      case "accepted":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "rejected":
        return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const sidebarItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "offer-management",
      icon: <SettingOutlined />,
      label: "Offer Management",
    },
    {
      key: "bid-management",
      icon: <FileTextOutlined />,
      label: "Bid Management",
    },
    {
      key: "bookings",
      icon: <CalendarOutlined />,
      label: "Bookings",
    },
    {
      key: "cms",
      icon: <TeamOutlined />,
      label: "CMS",
    },
    {
      key: "admin-settings",
      icon: <SettingOutlined />,
      label: "Admin Settings",
    },
    {
      key: "reports",
      icon: <BarChartOutlined />,
      label: "Reports",
    },
  ];

  const tabItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
    {
      key: "active-bids",
      label: "Active Bids",
      icon: <ClockCircleOutlined />,
    },
    {
      key: "bid-setup",
      label: "Bid Setup",
      icon: <SettingOutlined />,
    },
    {
      key: "payments",
      label: "Payments",
      icon: <FileTextOutlined />,
    },
    {
      key: "history",
      label: "History",
      icon: <BarChartOutlined />,
    },
  ];

  const userMenuItems = [
    { key: "profile", label: "Profile" },
    { key: "settings", label: "Settings" },
    { key: "logout", label: "Logout" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text strong style={{ fontSize: "16px", marginRight: "24px" }}>
            GRM Retail Backend
          </Text>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Button type="text" icon={<ShareAltOutlined />}>
            Share
          </Button>
          <Badge count={1}>
            <Button type="text" icon={<BellOutlined />} />
          </Badge>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
              <Text>John Doe</Text>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        {/* Sidebar */}
        <Sider
          width={250}
          style={{
            background: "#1e3a8a",
            height: "calc(100vh - 64px)",
          }}
        >
          {/* Logo */}
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                fontWeight: "bold",
                color: "#1e3a8a",
              }}
            >
              GR
            </div>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: "14px" }}>
              GROUP RETAIL
            </Text>
            <br />
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>
              ADMIN PORTAL
            </Text>
          </div>

          {/* Navigation Menu */}
          <Menu
            mode="inline"
            selectedKeys={["bid-management"]}
            style={{
              background: "transparent",
              border: "none",
              padding: "16px 0",
            }}
            items={sidebarItems.map((item) => ({
              ...item,
              style: {
                color: "#fff",
                margin: "4px 16px",
                borderRadius: "6px",
              },
            }))}
          />

          {/* Admin User Info */}
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              left: "24px",
              right: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
            <div>
              <Text style={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}>
                John Doe
              </Text>
              <br />
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>
                System Admin
              </Text>
            </div>
          </div>
        </Sider>

        {/* Main Content */}
        <Content style={{ background: "#f5f5f5" }}>
          <div style={{ padding: "24px" }}>
            {/* Page Header */}
            <div style={{ marginBottom: "24px" }}>
              <Title level={2} style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
                Bid Management
              </Title>
              <Text style={{ color: "#666", fontSize: "14px" }}>
                Manage passenger upgrade bids and bidding configurations
              </Text>
            </div>

            {/* Tabs */}
            <div style={{ marginBottom: "24px" }}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                size="large"
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  padding: "0 24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              />
            </div>

            {activeTab === "dashboard" && (
              <>
                <Row gutter={24} style={{ marginBottom: "24px" }}>
                  <Col span={8}>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <Text strong style={{ fontSize: "18px" }}>
                        Overview
                      </Text>
                    </div>
                  </Col>
                  <Col span={16}>
                    <div style={{ textAlign: "right" }}>
                      <Text strong style={{ fontSize: "18px" }}>
                        Insights
                      </Text>
                    </div>
                  </Col>
                </Row>

                {/* Statistics Cards */}
                <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <ClockCircleOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
                        <div>
                          <Statistic
                            title="Active Bids"
                            value={statistics.activeBids.value}
                            valueStyle={{ fontSize: "28px", fontWeight: "bold" }}
                          />
                          <Text style={{ color: "#666", fontSize: "12px" }}>
                            {statistics.activeBids.change}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <SettingOutlined style={{ fontSize: "24px", color: "#52c41a" }} />
                        <div>
                          <Statistic
                            title="Bid Types"
                            value={statistics.bidTypes.value}
                            valueStyle={{ fontSize: "28px", fontWeight: "bold" }}
                          />
                          <Text style={{ color: "#666", fontSize: "12px" }}>
                            {statistics.bidTypes.change}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <TrendingDownOutlined style={{ fontSize: "24px", color: "#ff4d4f" }} />
                        <div>
                          <Statistic
                            title="Monthly Revenue"
                            value={statistics.monthlyRevenue.value}
                            prefix="$"
                            valueStyle={{ fontSize: "28px", fontWeight: "bold" }}
                          />
                          <Text style={{ color: "#ff4d4f", fontSize: "12px" }}>
                            {statistics.monthlyRevenue.change}% this month
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <TrendingDownOutlined style={{ fontSize: "24px", color: "#ff4d4f" }} />
                        <div>
                          <Statistic
                            title="Acceptance Rate"
                            value={statistics.acceptanceRate.value}
                            suffix="%"
                            valueStyle={{ fontSize: "28px", fontWeight: "bold" }}
                          />
                          <Text style={{ color: "#ff4d4f", fontSize: "12px" }}>
                            {statistics.acceptanceRate.change}% this month
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <TrendingDownOutlined style={{ fontSize: "24px", color: "#ff4d4f" }} />
                        <div>
                          <Statistic
                            title="Avg Bid Value"
                            value={statistics.avgBidValue.value}
                            prefix="$"
                            valueStyle={{ fontSize: "28px", fontWeight: "bold" }}
                          />
                          <Text style={{ color: "#ff4d4f", fontSize: "12px" }}>
                            {statistics.avgBidValue.change}% this month
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12} lg={8}>
                    <Card>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <ExclamationCircleOutlined style={{ fontSize: "24px", color: "#fa8c16" }} />
                        <div>
                          <Statistic
                            title="Pending Review"
                            value={statistics.pendingReview.value}
                            valueStyle={{ fontSize: "28px", fontWeight: "bold" }}
                          />
                          <Text style={{ color: "#666", fontSize: "12px" }}>
                            {statistics.pendingReview.change}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>

                {/* Quick Actions */}
                <Card style={{ marginBottom: "32px" }}>
                  <Title level={4} style={{ marginBottom: "16px" }}>
                    Quick Actions
                  </Title>
                  <Text style={{ color: "#666", display: "block", marginBottom: "24px" }}>
                    Frequently used bid management tasks
                  </Text>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                      <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        block
                        style={{
                          height: "80px",
                          background: "#000",
                          borderColor: "#000",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div>Create New Bid</div>
                      </Button>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Button
                        size="large"
                        icon={<EyeOutlined />}
                        block
                        style={{
                          height: "80px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div>Review Pending Bids</div>
                      </Button>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Button
                        size="large"
                        icon={<FileSearchOutlined />}
                        block
                        style={{
                          height: "80px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div>Generate Report</div>
                      </Button>
                    </Col>
                  </Row>
                </Card>

                {/* Recent Bid Activity */}
                <Card>
                  <Title level={4} style={{ marginBottom: "16px" }}>
                    Recent Bid Activity
                  </Title>
                  <Text style={{ color: "#666", display: "block", marginBottom: "24px" }}>
                    Latest bid submissions and responses
                  </Text>
                  <List
                    dataSource={recentActivity}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          padding: "16px 0",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
                          {getStatusIcon(item.status)}
                          <div style={{ flex: 1 }}>
                            <Text strong>{item.title}</Text>
                          </div>
                          <Text style={{ color: "#666", fontSize: "12px" }}>{item.time}</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
