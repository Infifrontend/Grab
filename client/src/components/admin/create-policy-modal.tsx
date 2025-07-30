import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Checkbox,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Badge,
  Progress,
} from "antd";
import {
  DollarOutlined,
  PercentageOutlined,
  CalendarOutlined,
  UserOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface CreatePolicyModalProps {
  activeTab: any;
  isModalVisible: boolean;
  setIsModalVisible: (values: any) => void;
  setEditingOffer: (values: any) => void;
}

export default function CreatePolicyModal({
  activeTab,
  isModalVisible,
  setIsModalVisible,
  setEditingOffer,
}: CreatePolicyModalProps) {
  const [form] = Form.useForm();
  const [policyModalStep, setPolicyModalStep] = useState(0);

  const loyaltyOptions = [
    {
      value: "bronze",
      label: "Bronze",
      bg: "bg-amber-50",
      border: "border-amber-200",
      hover: "hover:border-amber-300",
      text: "text-amber-800",
    },
    {
      value: "silver",
      label: "Silver",
      bg: "bg-gray-50",
      border: "border-gray-200",
      hover: "hover:border-gray-300",
      text: "text-gray-700",
    },
    {
      value: "gold",
      label: "Gold",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      hover: "hover:border-yellow-300",
      text: "text-yellow-800",
    },
    {
      value: "platinum",
      label: "Platinum",
      bg: "bg-slate-50",
      border: "border-slate-200",
      hover: "hover:border-slate-300",
      text: "text-slate-700",
    },
    {
      value: "diamond",
      label: "Diamond",
      bg: "bg-blue-50",
      border: "border-blue-200",
      hover: "hover:border-blue-300",
      text: "text-blue-800",
    },
  ];

  return (
    // Create Modal (Dynamic based on active tab)
    <Modal
      style={{ top: 50 }}
      title={
        <div className="border-b border-gray-200 pb-4 mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            {activeTab === "policies"
              ? "Create New Policy"
              : activeTab === "ancillaries"
                ? "Add New Ancillary"
                : activeTab === "discounts"
                  ? "Create New Discount"
                  : activeTab === "promocodes"
                    ? "Create New Promo Code"
                    : "Create New Item"}
          </Title>
        </div>
      }
      visible={isModalVisible && activeTab !== "offers"}
      onCancel={() => {
        setIsModalVisible(false);
        setEditingOffer(null);
        setPolicyModalStep(0);
        form.resetFields();
      }}
      footer={null}
      width={
        activeTab === "policies" || activeTab === "ancillaries" ? 1000 : 600
      }
      className="custom-modal"
      bodyStyle={{ padding: "0 32px 32px" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log(`${activeTab} values:`, values);
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        {activeTab === "policies" ? (
          // Policy Form Fields - Multi-step
          <>
            {/* Steps Navigation */}

            {/* Step Content */}
            <div style={{ minHeight: "400px" }}>
              {/* Step 1: Basic Information */}
              {policyModalStep === 0 && (
                <div>
                  <Title level={4} className="!mb-4 text-blue-600">
                    Basic Information
                  </Title>
                  <Text className="text-gray-600 block mb-6">
                    Configure the fundamental details of your policy including
                    name, priority, and description.
                  </Text>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Policy Name"
                        name="policyName"
                        rules={[
                          {
                            required: true,
                            message: "Please enter policy name",
                          },
                        ]}
                      >
                        <Input
                          placeholder="e.g., Premium Member Refund Policy"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Priority Level"
                        name="priorityLevel"
                        rules={[
                          {
                            required: true,
                            message: "Please select priority level",
                          },
                        ]}
                      >
                        <Select placeholder="Select priority" size="large">
                          <Select.Option value="high">High</Select.Option>
                          <Select.Option value="medium">Medium</Select.Option>
                          <Select.Option value="low">Low</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Policy Description"
                    name="policyDescription"
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Describe the policy purpose and scope..."
                    />
                  </Form.Item>

                  <Form.Item
                    name="policyEnabled"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch />
                    <span className="ml-2">Policy Enabled</span>
                  </Form.Item>
                </div>
              )}

              {/* Step 2: Refund/Change Rules */}
              {policyModalStep === 1 && (
                <div>
                  <Title level={4} className="!mb-4 text-green-600">
                    Refund/Change Rules
                  </Title>
                  <Text className="text-gray-600 block mb-6">
                    Define the refund and change policies including deadlines,
                    percentages, and fees.
                  </Text>

                  <Row gutter={24}>
                    <Col span={12}>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <Text className="font-medium block mb-3 text-green-600">
                          <DollarOutlined className="mr-2" />
                          Refund Policy
                        </Text>
                        <Form.Item
                          name="allowRefunds"
                          valuePropName="checked"
                          className="!mb-3"
                        >
                          <Switch />
                          <span className="ml-2">Allow Refunds</span>
                        </Form.Item>

                        <Form.Item
                          label="Refund Deadline (hours before departure)"
                          name="refundDeadline"
                        >
                          <InputNumber placeholder="24" className="w-full" />
                        </Form.Item>

                        <Row gutter={12}>
                          <Col span={12}>
                            <Form.Item
                              label="Refund Percentage (%)"
                              name="refundPercentage"
                            >
                              <InputNumber
                                placeholder="100"
                                className="w-full"
                                min={0}
                                max={100}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="Refund Fee ($)" name="refundFee">
                              <InputNumber
                                placeholder="0"
                                className="w-full"
                                min={0}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    </Col>

                    <Col span={12}>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <Text className="font-medium block mb-3 text-blue-600">
                          <span className="mr-2">🔄</span>
                          Change Policy
                        </Text>
                        <Form.Item
                          name="allowChanges"
                          valuePropName="checked"
                          className="!mb-3"
                        >
                          <Switch />
                          <span className="ml-2">Allow Changes</span>
                        </Form.Item>

                        <Form.Item
                          label="Change Deadline (hours before departure)"
                          name="changeDeadline"
                        >
                          <InputNumber placeholder="24" className="w-full" />
                        </Form.Item>

                        <Form.Item label="Change Fee ($)" name="changeFee">
                          <InputNumber
                            placeholder="0"
                            className="w-full"
                            min={0}
                          />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}

              {/* Step 3: Eligibility Rules */}
              {policyModalStep === 2 && (
                <div className="max-w-6xl mx-auto">
                  {/* Modern Header Section */}
                  <div className="mb-6">
                    <Title level={4} className="!mb-4 text-gray-900 flex">
                      Eligibility Configuration
                    </Title>
                    <Text className="text-gray-600 text-md max-w-4xl leading-relaxed">
                      Define comprehensive criteria for policy eligibility
                      including loyalty status, passenger demographics, age
                      restrictions, and booking channel preferences.
                    </Text>
                  </div>

                  {/* Clean Grid Layout */}
                  <div className="space-y-8">
                    {/* Loyalty & Membership Section */}
                    <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                      {/* Loyalty Tiers */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div>
                              <Text className="font-bold text-gray-900 text-lg">
                                Loyalty Program Tiers
                              </Text>
                              <Text className="text-gray-600 text-sm block">
                                Select eligible membership levels for this
                                discount
                              </Text>
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg border-0">
                            Multi-Select
                          </Badge>
                        </div>
                        <Form.Item
                          name="loyaltyTiers"
                          className="!mb-6"
                          label="Loyalty Program Tiers"
                        >
                          <Checkbox.Group className="w-full">
                            <div className="flex items-center space-x-10 ml-5">
                              {loyaltyOptions.map((item) => (
                                <div
                                  key={item.value}
                                  className="flex items-center space-x-3"
                                >
                                  <Checkbox
                                    value={item.value}
                                    className="scale-110"
                                  />
                                  <div
                                    className={`w-4 h-4 rounded-full ${
                                      item.value === "bronze"
                                        ? "bg-amber-600"
                                        : item.value === "silver"
                                          ? "bg-gray-400"
                                          : item.value === "gold"
                                            ? "bg-yellow-500"
                                            : item.value === "platinum"
                                              ? "bg-slate-400"
                                              : "bg-blue-500"
                                    }`}
                                  ></div>
                                  <Text className="font-medium text-gray-700">
                                    {item.label}
                                  </Text>
                                </div>
                              ))}
                            </div>
                          </Checkbox.Group>
                        </Form.Item>
                      </div>

                      {/* Corporate Customers */}
                      <div className="pb-2">
                        <Form.Item
                          name="corporateCustomersOnly"
                          valuePropName="checked"
                          className="!mb-0"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div>
                                <Text className="font-semibold text-gray-900 text-lg block">
                                  Corporate Customers Only
                                </Text>
                                <Text className="text-gray-600 text-sm">
                                  Restrict access to business accounts and
                                  corporate travelers
                                </Text>
                              </div>
                            </div>
                            <Switch size="large" className="ml-6" />
                          </div>
                        </Form.Item>
                      </div>
                    </div>

                    {/* Demographics & Age Section */}
                    <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <Title level={4} className="!mb-2 text-gray-900">
                            Demographics & Age
                          </Title>
                          <Text className="text-gray-600 text-sm">
                            Define passenger categories and age-based
                            restrictions
                          </Text>
                        </div>
                      </div>

                      {/* Passenger Types */}
                      <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                          <Text className="font-semibold text-gray-800 text-lg">
                            Passenger Categories
                          </Text>
                          <Badge className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                            Select All That Apply
                          </Badge>
                        </div>
                        <Form.Item name="passengerTypes" className="!mb-0">
                          <Checkbox.Group className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {[
                                {
                                  value: "adult",
                                  label: "Adult",
                                  icon: "👨",
                                  desc: "18+ years",
                                  bgColor: "bg-blue-50",
                                  borderColor: "border-blue-200",
                                },
                                {
                                  value: "child",
                                  label: "Child",
                                  icon: "👧",
                                  desc: "2-17 years",
                                  bgColor: "bg-purple-50",
                                  borderColor: "border-purple-200",
                                },
                                {
                                  value: "infant",
                                  label: "Infant",
                                  icon: "👶",
                                  desc: "0-2 years",
                                  bgColor: "bg-pink-50",
                                  borderColor: "border-pink-200",
                                },
                                {
                                  value: "senior",
                                  label: "Senior",
                                  icon: "👴",
                                  desc: "65+ years",
                                  bgColor: "bg-orange-50",
                                  borderColor: "border-orange-200",
                                },
                                {
                                  value: "student",
                                  label: "Student",
                                  icon: "🎓",
                                  desc: "With valid ID",
                                  bgColor: "bg-indigo-50",
                                  borderColor: "border-indigo-200",
                                },
                                {
                                  value: "military",
                                  label: "Military",
                                  icon: "🪖",
                                  desc: "Active/Veteran",
                                  bgColor: "bg-emerald-50",
                                  borderColor: "border-emerald-200",
                                },
                              ].map((type) => (
                                <div
                                  key={type.value}
                                  className={`group/passenger cursor-pointer`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      value={type.value}
                                      className="scale-125"
                                    />
                                    {/* <span className="text-2xl">
                                      {type.icon}
                                    </span> */}
                                    <div>
                                      <Text className="font-semibold text-gray-900 text-sm pl-2 pr-1">
                                        {type.label}
                                      </Text>
                                      <Text className="text-gray-500 text-xs">
                                        {type.desc}
                                      </Text>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Checkbox.Group>
                        </Form.Item>
                      </div>

                      {/* Age Restrictions */}
                      <div>
                        <div className="flex items-center mb-4">
                          <Text className="font-semibold text-gray-800 text-lg">
                            Age Restrictions
                          </Text>
                        </div>
                        <Row gutter={24} className="mb-1">
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span className="font-medium text-gray-700 text-sm">
                                  Minimum Age
                                </span>
                              }
                              name="minAge"
                              className="!mb-4"
                            >
                              <InputNumber
                                placeholder="0"
                                className="w-full rounded-lg"
                                min={0}
                                max={120}
                                size="large"
                                suffix="years"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label={
                                <span className="font-medium text-gray-700 text-sm">
                                  Maximum Age
                                </span>
                              }
                              name="maxAge"
                              className="!mb-4"
                            >
                              <InputNumber
                                placeholder="100"
                                className="w-full rounded-lg"
                                min={0}
                                max={120}
                                size="large"
                                suffix="years"
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item
                          name="requiresAdultSupervision"
                          valuePropName="checked"
                          className="!mb-0"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-4">
                              <div>
                                <Text className="font-medium text-gray-900 text-base block">
                                  Requires Adult Supervision
                                </Text>
                                <Text className="text-gray-600 text-sm">
                                  Apply to minors traveling alone without adult
                                  supervision
                                </Text>
                              </div>
                            </div>
                            <Checkbox className="ml-4 scale-125" />
                          </div>
                        </Form.Item>
                      </div>
                    </div>

                    {/* Booking Channels Section */}
                    <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <Title level={4} className="!mb-2 text-gray-900">
                            Booking Channels
                          </Title>
                          <Text className="text-gray-600 text-sm">
                            Control which booking channels can access this
                            policy
                          </Text>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <Text className="font-semibold text-gray-800 text-lg">
                          Allowed Channels
                        </Text>
                        <Badge className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium border border-purple-200">
                          Multi-Channel Support
                        </Badge>
                      </div>
                      <Form.Item name="bookingChannels" className="!mb-0">
                        <Checkbox.Group className="w-full">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                              {
                                value: "website",
                                label: "Website",
                                icon: "🌐",
                                desc: "Desktop & mobile web platforms",
                                bgColor: "bg-blue-50",
                                borderColor: "border-blue-200",
                              },
                              {
                                value: "mobile",
                                label: "Mobile App",
                                icon: "📱",
                                desc: "iOS & Android native applications",
                                bgColor: "bg-green-50",
                                borderColor: "border-green-200",
                              },
                              {
                                value: "callcenter",
                                label: "Call Center",
                                icon: "☎️",
                                desc: "Phone bookings and customer service",
                                bgColor: "bg-orange-50",
                                borderColor: "border-orange-200",
                              },
                              {
                                value: "agent",
                                label: "Travel Agent",
                                icon: "🏢",
                                desc: "Third-party travel agencies",
                                bgColor: "bg-indigo-50",
                                borderColor: "border-indigo-200",
                              },
                              {
                                value: "airport",
                                label: "Airport Counter",
                                icon: "✈️",
                                desc: "Airport check-in and kiosks",
                                bgColor: "bg-red-50",
                                borderColor: "border-red-200",
                              },
                            ].map((channel) => (
                              <div
                                key={channel.value}
                                className={`group/channel cursor-pointer`}
                              >
                                <div className="flex items-start space-x-4">
                                  <Checkbox
                                    value={channel.value}
                                    className="scale-125 mt-1"
                                  />
                                  {/* <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <span className="text-2xl">
                                      {channel.icon}
                                    </span>
                                  </div> */}
                                  <div className="flex-1">
                                    <Text className="font-semibold text-gray-900 text-sm block">
                                      {channel.label}
                                    </Text>
                                    <Text className="text-gray-600 text-xs leading-relaxed">
                                      {channel.desc}
                                    </Text>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>

                    {/* Configuration Summary */}
                    <div className="rounded-3xl border p-8">
                      <div className="flex items-start space-x-6">
                        {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-2xl">📋</span>
                        </div> */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <Title level={4} className="!mb-0 text-gray-900">
                              Eligibility Configuration Summary
                            </Title>
                            <Badge className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                              Auto-Generated Rules
                            </Badge>
                          </div>
                          <Text className="text-gray-700 leading-relaxed text-sm mb-6">
                            Configure the above criteria to define comprehensive
                            eligibility rules. All selected conditions will be
                            evaluated using{" "}
                            <span className="font-semibold text-blue-600">
                              AND logic
                            </span>{" "}
                            to determine final policy access.
                            <span className="font-semibold">
                              Real-time validation
                            </span>{" "}
                            ensures consistent policy enforcement across all
                            booking channels.
                          </Text>
                          <div className="flex flex-wrap gap-6 mt-3">
                            <div className="flex items-center text-gray-600">
                              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                              <Text className="font-medium">
                                Auto-validation enabled
                              </Text>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                              <Text className="font-medium">
                                Multi-criteria support
                              </Text>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                              <Text className="font-medium">
                                Real-time enforcement
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Discount Stacking/Combinability Rules & Blackout Dates */}
              {policyModalStep === 3 && (
                <div>
                  <Title level={4} className="!mb-4 text-orange-600">
                    Discount Stacking & Blackout Dates
                  </Title>
                  <Text className="text-gray-600 block mb-6">
                    Configure how this policy interacts with other offers and
                    define any blackout periods.
                  </Text>

                  {/* Discount Stacking Section */}
                  <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-4">
                      <PercentageOutlined className="text-orange-600 mr-2" />
                      <Text className="font-medium text-orange-600">
                        Discount Stacking/Combinability Rules
                      </Text>
                    </div>

                    <Form.Item
                      name="allowDiscountStacking"
                      valuePropName="checked"
                      className="mb-4"
                    >
                      <Switch />
                      <span className="ml-2">Allow Discount Stacking</span>
                    </Form.Item>

                    <div>
                      <Text className="font-medium block mb-3">
                        Conflicting Offers (Cannot be combined)
                      </Text>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item name="conflictingOffers1">
                            <Checkbox.Group>
                              <Space direction="vertical" className="w-full">
                                <Checkbox value="comfort-plus">
                                  Comfort Plus Offer
                                </Checkbox>
                                <Checkbox value="early-bird">
                                  Early Bird Discount
                                </Checkbox>
                                <Checkbox value="baggage-fixed">
                                  Baggage Fixed Discount
                                </Checkbox>
                              </Space>
                            </Checkbox.Group>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="conflictingOffers2">
                            <Checkbox.Group>
                              <Space direction="vertical" className="w-full">
                                <Checkbox value="business-traveler">
                                  Business Traveler Offer
                                </Checkbox>
                                <Checkbox value="meal-service">
                                  Meal Service Discount
                                </Checkbox>
                                <Checkbox value="summer-travel">
                                  Summer Travel Promo
                                </Checkbox>
                              </Space>
                            </Checkbox.Group>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  {/* Blackout Dates Section */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-4">
                      <CalendarOutlined className="text-red-600 mr-2" />
                      <Text className="font-medium text-red-600">
                        Blackout Dates
                      </Text>
                    </div>

                    <Form.Item name="hasBlackoutDates" valuePropName="checked">
                      <Switch />
                      <span className="ml-2">Has Blackout Dates</span>
                    </Form.Item>

                    <Row gutter={16} className="mt-4">
                      <Col span={12}>
                        <Form.Item
                          label="Blackout Start Date"
                          name="blackoutStartDate"
                        >
                          <DatePicker
                            size="large"
                            className="w-full"
                            placeholder="Select start date"
                            format="MMM DD, YYYY"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Blackout End Date"
                          name="blackoutEndDate"
                        >
                          <DatePicker
                            size="large"
                            className="w-full"
                            placeholder="Select end date"
                            format="MMM DD, YYYY"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Step 5: Validity Period */}
              {policyModalStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarOutlined className="text-2xl text-purple-600" />
                    </div>
                    <Title level={3} className="!mb-2 text-gray-900">
                      Validity Period
                    </Title>
                    <Text className="text-gray-600 text-base">
                      Set the active period for this policy including start
                      date, end date, and timezone.
                    </Text>
                  </div>

                  <Row gutter={16} className="mb-6">
                    <Col span={12}>
                      <Form.Item
                        label="Valid From"
                        name="validFrom"
                        rules={[
                          {
                            required: true,
                            message: "Please select start date",
                          },
                        ]}
                      >
                        <DatePicker
                          size="large"
                          className="w-full"
                          placeholder="Pick start date"
                          format="MMM DD, YYYY"
                          disabledDate={(current) =>
                            current && current.isBefore(new Date(), "day")
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Valid To"
                        name="validTo"
                        rules={[
                          {
                            required: true,
                            message: "Please select end date",
                          },
                        ]}
                      >
                        <DatePicker
                          size="large"
                          className="w-full"
                          placeholder="Pick end date"
                          format="MMM DD, YYYY"
                          disabledDate={(current) =>
                            current && current.isBefore(new Date(), "day")
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Regulatory/Compliance Constraints */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-4">
                      <span className="text-purple-600 mr-2">📋</span>
                      <Text className="font-medium text-purple-600">
                        Regulatory/Compliance Constraints
                      </Text>
                    </div>

                    <Row gutter={24}>
                      <Col span={12}>
                        <div className="mb-4">
                          <Text className="font-medium block mb-2">
                            Applicable Regions
                          </Text>
                          <Form.Item name="applicableRegions">
                            <Checkbox.Group>
                              <Row gutter={[12, 8]}>
                                <Col span={12}>
                                  <Checkbox value="north-america">
                                    North America
                                  </Checkbox>
                                </Col>
                                <Col span={12}>
                                  <Checkbox value="europe">Europe</Checkbox>
                                </Col>
                                <Col span={12}>
                                  <Checkbox value="asia-pacific">
                                    Asia Pacific
                                  </Checkbox>
                                </Col>
                                <Col span={12}>
                                  <Checkbox value="latin-america">
                                    Latin America
                                  </Checkbox>
                                </Col>
                                <Col span={12}>
                                  <Checkbox value="middle-east">
                                    Middle East
                                  </Checkbox>
                                </Col>
                                <Col span={12}>
                                  <Checkbox value="africa">Africa</Checkbox>
                                </Col>
                              </Row>
                            </Checkbox.Group>
                          </Form.Item>
                        </div>

                        <Space direction="vertical" className="w-full">
                          <div>
                            <Form.Item
                              name="gdprCompliant"
                              valuePropName="checked"
                            >
                              <Switch />
                              <span className="ml-2">
                                GDPR/Data Protection Compliant
                              </span>
                            </Form.Item>
                          </div>

                          <div>
                            <Form.Item
                              name="adaCompliant"
                              valuePropName="checked"
                            >
                              <Switch />
                              <span className="ml-2">
                                ADA/Accessibility Compliant
                              </span>
                            </Form.Item>
                          </div>

                          <div>
                            <Form.Item
                              name="enableAuditTrail"
                              valuePropName="checked"
                              initialValue={true}
                            >
                              <Switch />
                              <span className="ml-2">Enable Audit Trail</span>
                            </Form.Item>
                          </div>
                        </Space>
                      </Col>

                      <Col span={12}>
                        <div className="mb-4">
                          <Text className="font-medium block mb-2">
                            Tax Implications
                          </Text>
                          <Form.Item name="taxImplications">
                            <Input.TextArea
                              rows={3}
                              placeholder="Describe any tax implications or considerations..."
                            />
                          </Form.Item>
                        </div>

                        <div className="mb-4">
                          <Text className="font-medium block mb-2">
                            Regulatory Notes
                          </Text>
                          <Form.Item name="regulatoryNotes">
                            <Input.TextArea
                              rows={3}
                              placeholder="Additional regulatory notes and constraints..."
                            />
                          </Form.Item>

                          <Form.Item
                            name="requiresApproval"
                            valuePropName="checked"
                          >
                            <Switch />
                            <span className="ml-2">Requires Approval</span>
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : activeTab === "discounts" ? (
          // Discount Form Fields - Multi-step
          <>
            {/* Steps Navigation */}

            {/* Step Content */}
            <div style={{ minHeight: "400px" }}>
              {/* Step 1: Basic Info */}
              {policyModalStep === 0 && (
                <div>
                  <Title level={4} className="!mb-4 text-blue-600">
                    Basic Information
                  </Title>
                  <Text className="text-gray-600 block mb-6">
                    Configure the fundamental details of your discount including
                    name, code, and description.
                  </Text>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label={
                          <span className="font-medium">
                            Discount Name{" "}
                            <span className="text-red-500">*</span>
                          </span>
                        }
                        name="discountName"
                        rules={[
                          {
                            required: true,
                            message: "Please enter discount name",
                          },
                        ]}
                      >
                        <Input
                          placeholder="e.g., Early Bird Discount"
                          size="large"
                          className="rounded-lg"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={
                          <span className="font-medium">
                            Discount Code{" "}
                            <span className="text-red-500">*</span>
                          </span>
                        }
                        name="discountCode"
                        rules={[
                          {
                            required: true,
                            message: "Please enter discount code",
                          },
                        ]}
                      >
                        <Input
                          placeholder="e.g., EARLY20"
                          size="large"
                          className="rounded-lg"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label={<span className="font-medium">Description</span>}
                    name="description"
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Describe what this discount offers..."
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        label={
                          <span className="font-medium">
                            Discount Type{" "}
                            <span className="text-red-500">*</span>
                          </span>
                        }
                        name="discountType"
                        rules={[
                          {
                            required: true,
                            message: "Please select discount type",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Percentage (%)"
                          size="large"
                          className="rounded-lg"
                        >
                          <Select.Option value="percentage">
                            Percentage (%)
                          </Select.Option>
                          <Select.Option value="fixed">
                            Fixed Amount
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label={
                          <span className="font-medium">
                            Discount Value{" "}
                            <span className="text-red-500">*</span>
                          </span>
                        }
                        name="discountValue"
                        rules={[
                          {
                            required: true,
                            message: "Please enter discount value",
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="20"
                          size="large"
                          className="w-full rounded-lg"
                          min={0}
                          max={100}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label={<span className="font-medium">Status</span>}
                        name="status"
                        initialValue="active"
                      >
                        <Select
                          placeholder="Active"
                          size="large"
                          className="rounded-lg"
                        >
                          <Select.Option value="active">Active</Select.Option>
                          <Select.Option value="inactive">
                            Inactive
                          </Select.Option>
                          <Select.Option value="draft">Draft</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )}

              {/* Step 2: Discount Rules */}
              {policyModalStep === 1 && (
                <div>
                  <Title level={4} className="!mb-4 text-green-600">
                    Target Application
                  </Title>
                  <Text className="text-gray-600 block mb-6">
                    Define how and where this discount should be applied.
                  </Text>

                  <div className="space-y-4 mb-6">
                    <Form.Item
                      name="targetApplication"
                      initialValue="baseFareOnly"
                    >
                      <div className="space-y-3">
                        <div className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              value="baseFareOnly"
                              className="mr-3"
                            />
                            <div>
                              <Text className="font-semibold text-blue-900">
                                Base Fare Only
                              </Text>
                              <Text className="text-blue-700 text-sm block">
                                Apply discount to base fare/ticket price
                              </Text>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              value="ancillariesOnly"
                              className="mr-3"
                            />
                            <div>
                              <Text className="font-semibold">
                                Ancillaries Only
                              </Text>
                              <Text className="text-gray-600 text-sm block">
                                Apply discount to selected ancillary services
                              </Text>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                          <div className="flex items-center">
                            <input type="radio" value="both" className="mr-3" />
                            <div>
                              <Text className="font-semibold">
                                Both Base Fare & Ancillaries
                              </Text>
                              <Text className="text-gray-600 text-sm block">
                                Apply discount to both fare and selected
                                services
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form.Item>
                  </div>

                  <Row gutter={24}>
                    <Col span={8}>
                      <Form.Item
                        label={
                          <span className="font-medium">Total Usage Limit</span>
                        }
                        name="totalUsageLimit"
                      >
                        <InputNumber
                          placeholder="1000"
                          size="large"
                          className="w-full rounded-lg"
                          min={1}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label={
                          <span className="font-medium">Per User Limit</span>
                        }
                        name="perUserLimit"
                      >
                        <InputNumber
                          placeholder="1"
                          size="large"
                          className="w-full rounded-lg"
                          min={1}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label={
                          <span className="font-medium">
                            Maximum Discount Cap ($)
                          </span>
                        }
                        name="maxDiscountCap"
                      >
                        <InputNumber
                          placeholder="100"
                          size="large"
                          className="w-full rounded-lg"
                          min={0}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )}

              {/* Step 3: Eligibility */}
              {policyModalStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <Title level={4} className="!mb-4 text-blue-600">
                      Eligibility Criteria
                    </Title>
                    <Text className="text-gray-600 text-base">
                      Define who can access this discount based on loyalty
                      status, location, and spending requirements.
                    </Text>
                  </div>

                  {/* Loyalty Program Tiers */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="mb-4">
                      <Title
                        level={5}
                        className="!mb-2 text-gray-900 font-semibold"
                      >
                        Loyalty Program Tiers
                      </Title>
                      <Text className="text-gray-600 text-sm">
                        Select which loyalty tiers are eligible for this
                        discount
                      </Text>
                    </div>
                    <Form.Item name="loyaltyTiers" className="!mb-0">
                      <Checkbox.Group className="block">
                        <div className="p-1 flex gap-2 items-center">
                          <Checkbox value="bronze" className="scale-110" />
                          <div className="w-4 h-4 bg-amber-600 rounded-full"></div>
                          <Text className="font-medium text-amber-800">
                            Bronze
                          </Text>
                        </div>
                        <div className="p-1 flex gap-2 items-center">
                          <Checkbox value="silver" className="scale-110" />
                          <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                          <Text className="font-medium text-gray-700">
                            Silver
                          </Text>
                        </div>
                        <div className="p-1 flex gap-2 items-center">
                          <Checkbox value="gold" className="scale-110" />
                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                          <Text className="font-medium text-yellow-800">
                            Gold
                          </Text>
                        </div>
                        <div className="p-1 flex gap-2 items-center">
                          <Checkbox value="platinum" className="scale-110" />
                          <div className="w-4 h-4 bg-slate-400 rounded-full"></div>
                          <Text className="font-medium text-slate-700">
                            Platinum
                          </Text>
                        </div>
                        <div className="p-1 flex gap-2 items-center">
                          <Checkbox value="diamond" className="scale-110" />
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <Text className="font-medium text-blue-800">
                            Diamond
                          </Text>
                        </div>
                      </Checkbox.Group>
                    </Form.Item>
                  </div>

                  {/* Geographic Eligibility */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="mb-6">
                      <Title
                        level={5}
                        className="!mb-2 text-gray-900 font-semibold"
                      >
                        Geographic Eligibility
                      </Title>
                      <Text className="text-gray-600 text-sm">
                        Select which countries/regions are eligible for this
                        discount
                      </Text>
                    </div>
                    <Form.Item name="geographicEligibility" className="!mb-0">
                      <Checkbox.Group className="w-full">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                            <Checkbox value="US" className="scale-110" />
                            <Text className="font-medium text-blue-800">
                              🇺🇸 US
                            </Text>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors">
                            <Checkbox value="CA" className="scale-110" />
                            <Text className="font-medium text-red-800">
                              🇨🇦 CA
                            </Text>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:border-green-300 transition-colors">
                            <Checkbox value="MX" className="scale-110" />
                            <Text className="font-medium text-green-800">
                              🇲🇽 MX
                            </Text>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors">
                            <Checkbox value="UK" className="scale-110" />
                            <Text className="font-medium text-purple-800">
                              🇬🇧 UK
                            </Text>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                            <Checkbox value="AU" className="scale-110" />
                            <Text className="font-medium text-orange-800">
                              🇦🇺 AU
                            </Text>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-colors">
                            <Checkbox value="DE" className="scale-110" />
                            <Text className="font-medium text-yellow-800">
                              🇩🇪 DE
                            </Text>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors">
                            <Checkbox value="FR" className="scale-110" />
                            <Text className="font-medium text-indigo-800">
                              🇫🇷 FR
                            </Text>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg border border-pink-200 hover:border-pink-300 transition-colors">
                            <Checkbox value="JP" className="scale-110" />
                            <Text className="font-medium text-pink-800">
                              🇯🇵 JP
                            </Text>
                          </div>
                        </div>
                      </Checkbox.Group>
                    </Form.Item>
                  </div>

                  {/* Route Restrictions */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="mb-6">
                      <Title
                        level={5}
                        className="!mb-2 text-gray-900 font-semibold"
                      >
                        Route Restrictions
                      </Title>
                      <Text className="text-gray-600 text-sm">
                        Limit discount to specific flight routes (leave empty
                        for all routes)
                      </Text>
                    </div>
                    <Form.Item name="routeRestrictions" className="!mb-0">
                      <Checkbox.Group className="w-full">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                            <Checkbox value="LAX-JFK" className="scale-110" />
                            <Text className="font-medium text-gray-700">
                              LAX-JFK
                            </Text>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                            <Checkbox value="ORD-SFO" className="scale-110" />
                            <Text className="font-medium text-gray-700">
                              ORD-SFO
                            </Text>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                            <Checkbox value="MIA-DEN" className="scale-110" />
                            <Text className="font-medium text-gray-700">
                              MIA-DEN
                            </Text>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                            <Checkbox value="ATL-SEA" className="scale-110" />
                            <Text className="font-medium text-gray-700">
                              ATL-SEA
                            </Text>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                            <Checkbox value="DEN-BOS" className="scale-110" />
                            <Text className="font-medium text-gray-700">
                              DEN-BOS
                            </Text>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                            <Checkbox value="LAX-ORD" className="scale-110" />
                            <Text className="font-medium text-gray-700">
                              LAX-ORD
                            </Text>
                          </div>
                        </div>
                      </Checkbox.Group>
                    </Form.Item>
                  </div>

                  {/* Minimum Spend Threshold */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="mb-6">
                      <Title
                        level={5}
                        className="!mb-2 text-gray-900 font-semibold"
                      >
                        Minimum Spend Threshold ($)
                      </Title>
                      <Text className="text-gray-600 text-sm">
                        Set a minimum purchase amount required to use this
                        discount
                      </Text>
                    </div>
                    <Form.Item name="minSpendThreshold" className="!mb-0">
                      <InputNumber
                        placeholder="100"
                        size="large"
                        className="w-full rounded-lg"
                        min={0}
                        defaultValue={100}
                        formatter={(value) =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) =>
                          value?.replace(/\$\s?|(,*)/g, "") || ""
                        }
                        style={{
                          fontSize: "16px",
                          padding: "12px 16px",
                          borderRadius: "8px",
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              )}

              {/* Step 4: Date Windows */}
              {policyModalStep === 3 && (
                <div>
                  <Title level={4} className="!mb-4 text-orange-600">
                    Date Windows & Validity
                  </Title>
                  <Text className="text-gray-600 block mb-6">
                    Set the validity period and any blackout dates for this
                    discount.
                  </Text>

                  <Row gutter={16} className="mb-8">
                    <Col span={12}>
                      <Form.Item
                        label={
                          <span className="font-medium">
                            Valid From <span className="text-red-500">*</span>
                          </span>
                        }
                        name="validFrom"
                        rules={[
                          {
                            required: true,
                            message: "Please select start date",
                          },
                        ]}
                      >
                        <DatePicker
                          placeholder="Pick start date"
                          size="large"
                          className="w-full rounded-lg"
                          format="MMM DD, YYYY"
                          disabledDate={(current) =>
                            current && current.isBefore(new Date(), "day")
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={
                          <span className="font-medium">
                            Valid Until <span className="text-red-500">*</span>
                          </span>
                        }
                        name="validTo"
                        rules={[
                          {
                            required: true,
                            message: "Please select end date",
                          },
                        ]}
                      >
                        <DatePicker
                          placeholder="Pick end date"
                          size="large"
                          className="w-full rounded-lg"
                          format="MMM DD, YYYY"
                          disabledDate={(current) =>
                            current && current.isBefore(new Date(), "day")
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div className="mb-6">
                    <Title level={5} className="!mb-4">
                      Blackout Dates
                    </Title>
                    <Form.Item name="blackoutDates">
                      <DatePicker
                        placeholder="dd-----yyyy"
                        size="large"
                        className="w-full rounded-lg"
                        format="MMM DD, YYYY"
                      />
                    </Form.Item>
                  </div>
                </div>
              )}

              {/* Step 5: Combinability */}
              {policyModalStep === 4 && (
                <div>
                  <Title level={4} className="!mb-4 text-pink-600">
                    Promo Code Combinability
                  </Title>
                  <Text className="text-gray-600 block mb-6">
                    Configure how this discount interacts with promotional
                    codes.
                  </Text>

                  <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <Form.Item
                      name="allowPromoCodeCombination"
                      valuePropName="checked"
                      className="!mb-4"
                    >
                      <div className="flex items-start">
                        <Checkbox className="mr-4 mt-1" />
                        <div>
                          <Text className="font-semibold text-lg block mb-2">
                            Allow Combination with Promo Codes
                          </Text>
                          <Text className="text-gray-600">
                            This discount can be used together with promotional
                            codes
                          </Text>
                        </div>
                      </div>
                    </Form.Item>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : activeTab === "ancillaries" ? (
          // Ancillary Form Fields - Multi-step
          <>
            {/* Steps Navigation */}

            {/* Step Content */}
            <div style={{ minHeight: "400px" }}>
              {/* Step 1: Basic Information */}
              {policyModalStep === 0 && (
                <div>
                  <Title level={4} className="!mb-4 text-blue-600">
                    Basic Information
                  </Title>
                  <Text className="text-gray-600 block mb-6">
                    Configure comprehensive ancillary details including product
                    definitions, pricing rules, availability logic, bundle
                    options, and categories.
                  </Text>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Ancillary Name"
                        name="ancillaryName"
                        rules={[
                          {
                            required: true,
                            message: "Please enter ancillary name",
                          },
                        ]}
                      >
                        <Input
                          placeholder="e.g., Premium Meal Service"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Category"
                        name="category"
                        rules={[
                          {
                            required: true,
                            message: "Please select category",
                          },
                        ]}
                      >
                        <Select placeholder="Select category" size="large">
                          <Select.Option value="seat">Seat</Select.Option>
                          <Select.Option value="food-beverage">
                            Food & Beverage
                          </Select.Option>
                          <Select.Option value="service">Service</Select.Option>
                          <Select.Option value="baggage">Baggage</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Ancillary Type"
                        name="ancillaryType"
                        rules={[
                          { required: true, message: "Please select type" },
                        ]}
                      >
                        <Select placeholder="Select type" size="large">
                          <Select.Option value="mandatory">
                            Mandatory
                          </Select.Option>
                          <Select.Option value="optional">
                            Optional
                          </Select.Option>
                          <Select.Option value="bundle">Bundle</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Status"
                        name="status"
                        initialValue="active"
                      >
                        <Select placeholder="Select status" size="large">
                          <Select.Option value="active">Active</Select.Option>
                          <Select.Option value="inactive">
                            Inactive
                          </Select.Option>
                          <Select.Option value="draft">Draft</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Description" name="description">
                    <Input.TextArea
                      rows={4}
                      placeholder="Describe the ancillary service..."
                    />
                  </Form.Item>
                </div>
              )}

              {/* Step 2: Terms and Conditions */}
              {policyModalStep === 1 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-600 text-xs">📋</span>
                    </div>
                    <Title level={4} className="!mb-0 text-blue-600">
                      Terms and Conditions
                    </Title>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Form.Item
                        name="refundable"
                        valuePropName="checked"
                        className="!mb-0"
                      >
                        <div className="flex items-center">
                          <Switch className="mr-2" />
                          <Text>Refundable</Text>
                        </div>
                      </Form.Item>

                      <Form.Item
                        name="changeable"
                        valuePropName="checked"
                        className="!mb-0"
                      >
                        <div className="flex items-center">
                          <Switch className="mr-2" />
                          <Text>Changeable</Text>
                        </div>
                      </Form.Item>

                      <Form.Item
                        name="transferable"
                        valuePropName="checked"
                        className="!mb-0"
                      >
                        <div className="flex items-center">
                          <Switch className="mr-2" />
                          <Text>Transferable</Text>
                        </div>
                      </Form.Item>
                    </div>
                  </div>

                  <div className="mb-6">
                    <Text className="font-medium block mb-3">
                      Cancellation Policy
                    </Text>
                    <Form.Item name="cancellationPolicy">
                      <Input.TextArea
                        rows={4}
                        placeholder="Describe cancellation terms and conditions..."
                        className="bg-gray-50"
                      />
                    </Form.Item>
                  </div>

                  <div>
                    <Text className="font-medium block mb-3">
                      Special Conditions
                    </Text>
                    <Form.Item name="specialConditions">
                      <Input.TextArea
                        rows={4}
                        placeholder="Any special terms, restrictions, or conditions..."
                        className="bg-gray-50"
                      />
                    </Form.Item>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : activeTab === "promocodes" ? (
          // Promo Code Form Fields - Multi-step
          <>
            {/* Steps Navigation */}

            {/* Step Content */}
            <div style={{ minHeight: "400px" }}>
              {/* Step 1: Basic Information */}
              {policyModalStep === 0 && (
                <div>
                  <Title level={4} className="!mb-4 text-blue-600">
                    Basic Information
                  </Title>
                  <Text className="text-gray-600 block mb-6">
                    Create a new promo in the system
                  </Text>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <Row gutter={16} className="mb-4">
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-medium">Promo Name</span>
                          }
                          name="promoName"
                          rules={[
                            {
                              required: true,
                              message: "Please enter promo name",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Enter promo name"
                            size="large"
                            className="rounded-lg"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-medium">Promo Code</span>
                          }
                          name="promoCode"
                          rules={[
                            {
                              required: true,
                              message: "Please enter promo code",
                            },
                          ]}
                        >
                          <div className="flex">
                            <Input
                              placeholder="Enter promo code"
                              size="large"
                              className="rounded-lg flex-1"
                            />
                            <Button
                              type="text"
                              icon={<span className="text-gray-400">🎲</span>}
                              className="ml-2"
                              size="large"
                            />
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label={<span className="font-medium">Description</span>}
                      name="description"
                      className="mb-6"
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="Describe the promotional offer"
                        className="rounded-lg"
                      />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          label={
                            <span className="font-medium">Discount Type</span>
                          }
                          name="discountType"
                          initialValue="percentage"
                        >
                          <Select size="large" className="rounded-lg">
                            <Select.Option value="percentage">
                              Percentage
                            </Select.Option>
                            <Select.Option value="fixed">
                              Fixed Amount
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={
                            <span className="font-medium">Discount Value</span>
                          }
                          name="discountValue"
                          initialValue={25}
                        >
                          <InputNumber
                            placeholder="25"
                            size="large"
                            className="w-full rounded-lg"
                            min={0}
                            max={100}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={<span className="font-medium">Status</span>}
                          name="status"
                          initialValue="active"
                        >
                          <Select size="large" className="rounded-lg">
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">
                              Inactive
                            </Select.Option>
                            <Select.Option value="draft">Draft</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {/* Step 2: Code Generation */}
              {policyModalStep === 1 && (
                <div>
                  <Title level={4} className="!mb-4 text-green-600">
                    Code Generation
                  </Title>
                  <Text className="text-gray-600 block mb-6">
                    Configure how promo codes are generated and managed
                  </Text>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
                    <div className="mb-6">
                      <Text className="font-semibold text-lg block mb-4">
                        Generation Type
                      </Text>
                      <Form.Item name="generationType" initialValue="manual">
                        <div className="space-y-3">
                          <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                            <input
                              type="radio"
                              value="manual"
                              className="mr-3"
                            />
                            <Text className="font-medium">Manual Entry</Text>
                          </div>
                          <div className="flex items-center p-3 border-2 border-blue-500 bg-blue-50 rounded-lg">
                            <input
                              type="radio"
                              value="auto"
                              className="mr-3"
                              checked
                            />
                            <Text className="font-medium text-blue-900">
                              Auto Generator
                            </Text>
                          </div>
                        </div>
                      </Form.Item>
                    </div>

                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          label={<span className="font-medium">Prefix</span>}
                          name="prefix"
                          initialValue="PROMO"
                        >
                          <Input
                            placeholder="PROMO"
                            size="large"
                            className="rounded-lg bg-gray-50"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={
                            <span className="font-medium">Code Length</span>
                          }
                          name="codeLength"
                          initialValue={8}
                        >
                          <InputNumber
                            placeholder="8"
                            size="large"
                            className="w-full rounded-lg bg-gray-50"
                            min={4}
                            max={20}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={<span className="font-medium">Quantity</span>}
                          name="quantity"
                          initialValue={1}
                        >
                          <InputNumber
                            placeholder="1"
                            size="large"
                            className="w-full rounded-lg bg-gray-50"
                            min={1}
                            max={1000}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <Text className="font-semibold text-lg block mb-4">
                      Associated Discount Rule
                    </Text>
                    <Form.Item
                      label={<span className="font-medium">Discount Rule</span>}
                      name="discountRule"
                    >
                      <Select
                        placeholder="Select discount rule"
                        size="large"
                        className="w-full rounded-lg"
                        suffixIcon={<span className="text-gray-400">▼</span>}
                      >
                        <Select.Option value="percentage-15">
                          15% Off All Services
                        </Select.Option>
                        <Select.Option value="fixed-50">
                          $50 Off Bookings
                        </Select.Option>
                        <Select.Option value="bogo">
                          Buy One Get One
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              )}

              {/* Step 3: Usage Limits & Channel Restrictions */}
              {policyModalStep === 2 && (
                <div>
                  <Title level={4} className="!mb-4 text-orange-600">
                    Usage Limits & Channel Restrictions
                  </Title>
                  <Text className="text-gray-600 block mb-6">
                    Configure usage constraints and channel availability
                  </Text>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
                    <Text className="font-semibold text-lg block mb-4">
                      Usage Limits
                    </Text>
                    <Row gutter={16} className="mb-4">
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-medium">
                              Minimum Purchase ($)
                            </span>
                          }
                          name="minPurchase"
                          initialValue={0}
                        >
                          <InputNumber
                            placeholder="0"
                            size="large"
                            className="w-full rounded-lg bg-gray-50"
                            min={0}
                            formatter={(value) =>
                              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) =>
                              value?.replace(/\$\s?|(,*)/g, "") || ""
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-medium">
                              Maximum Discount ($)
                            </span>
                          }
                          name="maxDiscount"
                          initialValue={100}
                        >
                          <InputNumber
                            placeholder="100"
                            size="large"
                            className="w-full rounded-lg bg-gray-50"
                            min={0}
                            formatter={(value) =>
                              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) =>
                              value?.replace(/\$\s?|(,*)/g, "") || ""
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16} className="mb-6">
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-medium">
                              Total Usage Limit (Max Redemptions)
                            </span>
                          }
                          name="totalUsageLimit"
                          initialValue={1000}
                        >
                          <InputNumber
                            placeholder="1000"
                            size="large"
                            className="w-full rounded-lg bg-gray-50"
                            min={1}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-medium">Per User Limit</span>
                          }
                          name="perUserLimit"
                          initialValue={1}
                        >
                          <InputNumber
                            placeholder="1"
                            size="large"
                            className="w-full rounded-lg bg-gray-50"
                            min={1}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="allowStacking"
                      valuePropName="checked"
                      className="!mb-0"
                    >
                      <div className="flex items-center">
                        <Switch className="mr-3" />
                        <Text className="font-medium">
                          Allow stacking with other discounts
                        </Text>
                      </div>
                    </Form.Item>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <Text className="font-semibold text-lg block mb-4">
                      Channel Restrictions
                    </Text>
                    <div className="mb-4">
                      <Text className="font-medium block mb-3">
                        Available Channels
                      </Text>
                      <Form.Item name="availableChannels" className="!mb-0">
                        <Checkbox.Group className="w-full">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                              <Checkbox value="web" className="scale-110" />
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600">🌐</span>
                              </div>
                              <Text className="font-medium text-blue-800">
                                Web
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:border-green-300 transition-colors">
                              <Checkbox value="mobile" className="scale-110" />
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600">📱</span>
                              </div>
                              <Text className="font-medium text-green-800">
                                Mobile App
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors">
                              <Checkbox value="ndc" className="scale-110" />
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-purple-600">💬</span>
                              </div>
                              <Text className="font-medium text-purple-800">
                                NDC
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                              <Checkbox value="phone" className="scale-110" />
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <span className="text-orange-600">📞</span>
                              </div>
                              <Text className="font-medium text-orange-800">
                                Phone
                              </Text>
                            </div>
                          </div>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Target Segments & Validity Period */}
              {policyModalStep === 3 && (
                <div>
                  <Title level={4} className="!mb-4 text-purple-600">
                    Target Segments & Validity Period
                  </Title>
                  <Text className="text-gray-600 block mb-6">
                    Define target customer segments and validity dates
                  </Text>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
                    <Text className="font-semibold text-lg block mb-4">
                      Target Segments
                    </Text>
                    <div className="mb-4">
                      <Text className="font-medium block mb-3">
                        Customer Segments
                      </Text>
                      <Form.Item name="customerSegments" className="!mb-0">
                        <Checkbox.Group className="w-full">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                              <Checkbox value="all" className="scale-110" />
                              <Text className="font-medium text-gray-700">
                                All
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:border-green-300 transition-colors">
                              <Checkbox value="new" className="scale-110" />
                              <Text className="font-medium text-green-800">
                                New Customers
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-colors">
                              <Checkbox value="vip" className="scale-110" />
                              <Text className="font-medium text-yellow-800">
                                VIP
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors">
                              <Checkbox value="premium" className="scale-110" />
                              <Text className="font-medium text-purple-800">
                                Premium
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                              <Checkbox
                                value="business"
                                className="scale-110"
                              />
                              <Text className="font-medium text-blue-800">
                                Business
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors">
                              <Checkbox value="family" className="scale-110" />
                              <Text className="font-medium text-indigo-800">
                                Family
                              </Text>
                            </div>
                            <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                              <Checkbox
                                value="platinum"
                                className="scale-110"
                              />
                              <Text className="font-medium text-orange-800">
                                Platinum
                              </Text>
                            </div>
                          </div>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <Text className="font-semibold text-lg block mb-4">
                      Validity Period (Start/End Date)
                    </Text>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label={
                            <span className="font-medium">Start Date</span>
                          }
                          name="startDate"
                          rules={[
                            {
                              required: true,
                              message: "Please select start date",
                            },
                          ]}
                        >
                          <DatePicker
                            placeholder="Select start date"
                            size="large"
                            className="w-full rounded-lg"
                            format="MMM DD, YYYY"
                            suffixIcon={
                              <CalendarOutlined className="text-gray-400" />
                            }
                            disabledDate={(current) =>
                              current && current.isBefore(new Date(), "day")
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={<span className="font-medium">End Date</span>}
                          name="endDate"
                          rules={[
                            {
                              required: true,
                              message: "Please select end date",
                            },
                          ]}
                        >
                          <DatePicker
                            placeholder="Select end date"
                            size="large"
                            className="w-full rounded-lg"
                            format="MMM DD, YYYY"
                            suffixIcon={
                              <CalendarOutlined className="text-gray-400" />
                            }
                            disabledDate={(current) =>
                              current && current.isBefore(new Date(), "day")
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // Default form for other tabs
          <div>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="Enter name" size="large" />
            </Form.Item>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button
            onClick={() => {
              setIsModalVisible(false);
              setEditingOffer(null);
              setPolicyModalStep(0);
              form.resetFields();
            }}
            size="large"
          >
            Cancel
          </Button>

          <div className="flex space-x-3">
            {activeTab === "policies" && (
              <>
                <Button
                  onClick={() =>
                    setPolicyModalStep(Math.max(0, policyModalStep - 1))
                  }
                  disabled={policyModalStep === 0}
                  size="large"
                >
                  Previous
                </Button>
                {policyModalStep < 4 ? (
                  <Button
                    type="primary"
                    onClick={() =>
                      setPolicyModalStep(Math.min(4, policyModalStep + 1))
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                    size="large"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-green-600 hover:bg-green-700"
                    size="large"
                  >
                    Create Policy
                  </Button>
                )}
              </>
            )}

            {activeTab === "ancillaries" && (
              <>
                <Button
                  onClick={() =>
                    setPolicyModalStep(Math.max(0, policyModalStep - 1))
                  }
                  disabled={policyModalStep === 0}
                  size="large"
                >
                  Previous
                </Button>
                {policyModalStep < 1 ? (
                  <Button
                    type="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      setPolicyModalStep(Math.min(1, policyModalStep + 1));
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="large"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    size="large"
                  >
                    Create Ancillary
                  </Button>
                )}
              </>
            )}

            {activeTab === "discounts" && (
              <>
                <Button
                  onClick={() =>
                    setPolicyModalStep(Math.max(0, policyModalStep - 1))
                  }
                  disabled={policyModalStep === 0}
                  size="large"
                >
                  Previous
                </Button>
                {policyModalStep < 4 ? (
                  <Button
                    type="primary"
                    onClick={() =>
                      setPolicyModalStep(Math.min(4, policyModalStep + 1))
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                    size="large"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-green-600 hover:bg-green-700"
                    size="large"
                  >
                    Create Discount
                  </Button>
                )}
              </>
            )}

            {activeTab === "promocodes" && (
              <>
                <Button
                  onClick={() =>
                    setPolicyModalStep(Math.max(0, policyModalStep - 1))
                  }
                  disabled={policyModalStep === 0}
                  size="large"
                >
                  Previous
                </Button>
                {policyModalStep < 3 ? (
                  <Button
                    type="primary"
                    onClick={() =>
                      setPolicyModalStep(Math.min(3, policyModalStep + 1))
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                    size="large"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-green-600 hover:bg-green-700"
                    size="large"
                  >
                    Create Promo Code
                  </Button>
                )}
              </>
            )}

            {
              // Other forms
              <>
                {activeTab !== "policies" &&
                  activeTab !== "ancillaries" &&
                  activeTab !== "discounts" &&
                  activeTab !== "promocodes" &&
                  activeTab !== "offers" && (
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      size="large"
                    >
                      Create
                    </Button>
                  )}
              </>
            }
          </div>
        </div>
      </Form>
    </Modal>
  );
}
