import { useState } from "react";
import {
  Card,
  Typography,
  Tabs,
  Switch,
  Button,
  Input,
  Select,
  Row,
  Col,
} from "antd";
import {
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import Header from "@/components/layout/header";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [bidsEnabled, setBidsEnabled] = useState(true);
  const [marketplaceEnabled, setMarketplaceEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  const tabItems = [
    {
      key: "general",
      label: "General",
      icon: <SettingOutlined />,
    },
    {
      key: "features",
      label: "Features",
      icon: <AppstoreOutlined />,
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: <BellOutlined />,
    },
    {
      key: "account",
      label: "Account",
      icon: <UserOutlined />,
    },
  ];

  const handleSaveChanges = () => {
    console.log("Saving changes...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <Title level={2} className="!mb-2">
            Settings
          </Title>
          <Text className="text-gray-600">
            Manage your account settings and preferences
          </Text>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="mb-6"
        />

        {/* Tab Content */}
        {activeTab === "general" && (
          <Card>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <SettingOutlined className="text-gray-700" />
                <Title level={4} className="!mb-0 text-gray-900">
                  General Settings
                </Title>
              </div>
              <Text className="text-gray-600">
                Manage your display preferences
              </Text>
            </div>

            <Row gutter={[48, 24]}>
              <Col xs={24} md={12}>
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Language
                  </Text>
                  <Select
                    defaultValue="english"
                    className="w-full"
                    size="large"
                  >
                    <Option value="english">English</Option>
                    <Option value="spanish">Spanish</Option>
                    <Option value="french">French</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Currency
                  </Text>
                  <Select defaultValue="usd" className="w-full" size="large">
                    <Option value="usd">USD ($)</Option>
                    <Option value="eur">EUR (€)</Option>
                    <Option value="gbp">GBP (£)</Option>
                  </Select>
                </div>
              </Col>
            </Row>

            <Row gutter={[48, 24]} className="mt-6">
              <Col xs={24} md={12}>
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Timezone
                  </Text>
                  <Select defaultValue="utc" className="w-full" size="large">
                    <Option value="utc">UTC (GMT+0)</Option>
                    <Option value="est">EST (GMT-5)</Option>
                    <Option value="pst">PST (GMT-8)</Option>
                  </Select>
                </div>
              </Col>
            </Row>

            <div className="flex justify-end mt-8">
              <Button
                type="primary"
                size="large"
                className="infiniti-btn-primary"
                onClick={handleSaveChanges}
                icon={<SettingOutlined />}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        {activeTab === "features" && (
          <Card>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AppstoreOutlined className="text-gray-700" />
                <Title level={4} className="!mb-0 text-gray-900">
                  Feature Configuration
                </Title>
              </div>
              <Text className="text-gray-600">
                Enable or disable platform features
              </Text>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-start py-4">
                <div className="flex-1">
                  <Text className="font-semibold text-gray-900 block mb-1">
                    Bids
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Enable the bidding system for group travel
                  </Text>
                </div>
                <Switch
                  checked={bidsEnabled}
                  onChange={setBidsEnabled}
                  size="default"
                />
              </div>

              <div className="flex justify-between items-start py-4">
                <div className="flex-1">
                  <Text className="font-semibold text-gray-900 block mb-1">
                    Marketplace
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Enable the marketplace for travel packages
                  </Text>
                </div>
                <Switch
                  checked={marketplaceEnabled}
                  onChange={setMarketplaceEnabled}
                  size="default"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <Text className="text-blue-700">
                <strong>Note:</strong> Changes to feature settings will take
                effect after you save and refresh the page.
              </Text>
            </div>

            <div className="flex justify-end mt-8">
              <Button
                type="primary"
                size="large"
                className="infiniti-btn-primary"
                onClick={handleSaveChanges}
                icon={<SettingOutlined />}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        {activeTab === "notifications" && (
          <Card>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <BellOutlined className="text-gray-700" />
                <Title level={4} className="!mb-0 text-gray-900">
                  Notification Preferences
                </Title>
              </div>
              <Text className="text-gray-600">
                Manage how you receive notifications
              </Text>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-start py-4">
                <div className="flex-1">
                  <Text className="font-semibold text-gray-900 block mb-1">
                    Email Notifications
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Receive booking updates and offers via email
                  </Text>
                </div>
                <Switch
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                  size="default"
                />
              </div>

              <div className="flex justify-between items-start py-4">
                <div className="flex-1">
                  <Text className="font-semibold text-gray-900 block mb-1">
                    SMS Notifications
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Receive booking updates and alerts via SMS
                  </Text>
                </div>
                <Switch
                  checked={smsNotifications}
                  onChange={setSmsNotifications}
                  size="default"
                />
              </div>

              <div className="flex justify-between items-start py-4">
                <div className="flex-1">
                  <Text className="font-semibold text-gray-900 block mb-1">
                    Push Notifications
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Receive real-time updates in your browser
                  </Text>
                </div>
                <Switch
                  checked={pushNotifications}
                  onChange={setPushNotifications}
                  size="default"
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button
                type="primary"
                size="large"
                className="infiniti-btn-primary"
                onClick={handleSaveChanges}
                icon={<SettingOutlined />}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        {activeTab === "account" && (
          <Card>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <UserOutlined className="text-gray-700" />
                <Title level={4} className="!mb-0 text-gray-900">
                  Account Information
                </Title>
              </div>
              <Text className="text-gray-600">
                Update your personal information
              </Text>
            </div>

            <Row gutter={[48, 24]}>
              <Col xs={24} md={12}>
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Full Name
                  </Text>
                  <Input
                    defaultValue="John Doe"
                    size="large"
                    placeholder="Enter your full name"
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Email Address
                  </Text>
                  <Input
                    defaultValue="john.doe@example.com"
                    size="large"
                    placeholder="Enter your email address"
                  />
                </div>
              </Col>
            </Row>

            <Row gutter={[48, 24]} className="mt-6">
              <Col xs={24} md={12}>
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Phone Number
                  </Text>
                  <Input
                    defaultValue="+1 (555) 123-4567"
                    size="large"
                    placeholder="Enter your phone number"
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Company
                  </Text>
                  <Input
                    defaultValue="Acme Corp"
                    size="large"
                    placeholder="Enter your company name"
                  />
                </div>
              </Col>
            </Row>

            <div className="flex justify-end mt-8">
              <Button
                type="primary"
                size="large"
                className="infiniti-btn-primary"
                onClick={handleSaveChanges}
                icon={<SettingOutlined />}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
