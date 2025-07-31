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
} from "antd";
import {
  DollarOutlined,
  PercentageOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useModalLogic } from "./use-modal-logic";
const { Title, Text } = Typography;

interface PolicyModalProps {
  isModalVisible: boolean;
  editingData?: any;
  setIsModalVisible: (value: boolean) => void;
  setEditingOffer: (value: any) => void;
  setPolicyTableData: (value: any) => void;
}

const steps = [
  { title: "Basic Information" },
  { title: "Refund/Change Rules" },
  { title: "Eligibility Configuration" },
  { title: "Discount Stacking & Blackout Dates" },
  { title: "Validity Period" },
];

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

export default function PolicyModal({
  isModalVisible,
  editingData,
  setIsModalVisible,
  setEditingOffer,
  setPolicyTableData,
}: PolicyModalProps) {
  const [form] = Form.useForm();
  const {
    formValues,
    setFormValues,
    policyModalStep,
    setPolicyModalStep,
    handleFormData,
  } = useModalLogic({ editingData, isModalVisible, form });

  return (
    <Modal
      style={{ top: 50 }}
      title={
        <div className="border-b border-gray-200 pb-4 mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Create New Policy
          </Title>
        </div>
      }
      visible={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        setEditingOffer(null);
        setPolicyModalStep(0);
        form.resetFields();
      }}
      footer={null}
      width={1000}
      className="custom-modal"
      bodyStyle={{ padding: "0 32px 32px" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log("Policy values:", values);
          setPolicyTableData({ ...formValues, ...form.getFieldsValue() });
          setIsModalVisible(false);
        }}
      >
        {/* Steps Navigation */}
        <div className="relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
          <div
            className="absolute top-5 left-0 h-0.5 bg-blue-500 z-10"
            style={{
              width: `${(policyModalStep / (steps.length - 1)) * 100}%`,
            }}
          ></div>
          <div className="relative flex justify-between z-20">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-3
                    ${
                      index < policyModalStep
                        ? "bg-green-500 border-green-500 text-white"
                        : index === policyModalStep
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-white border-gray-300 text-gray-500"
                    }
                  `}
                >
                  {index < policyModalStep ? (
                    <span className="text-sm">✓</span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center max-w-[120px]">
                  <Text
                    className={`text-xs font-medium ${
                      index <= policyModalStep
                        ? "text-gray-800"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div style={{ minHeight: "400px" }}>
          {/* Step 1: Basic Information */}
          {policyModalStep === 0 && (
            <div>
              <Title level={4} className="!mb-4 text-blue-600">
                Basic Information
              </Title>
              <Text className="text-gray-600 block mb-6">
                Configure the fundamental details of your policy including name,
                priority, and description.
              </Text>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Policy Name"
                    name="policyName"
                    rules={[
                      { required: true, message: "Please enter policy name" },
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
              <Form.Item label="Policy Description" name="policyDescription">
                <Input.TextArea
                  rows={4}
                  placeholder="Describe the policy purpose and scope..."
                />
              </Form.Item>
              <Form.Item name="policyEnabled" valuePropName="checked">
                <Switch
                  onChange={(value) =>
                    setFormValues((prev: any) => ({
                      ...prev,
                      policyEnabled: value,
                    }))
                  }
                />
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
                      <Switch
                        onChange={(value) =>
                          setFormValues((prev: any) => ({
                            ...prev,
                            allowRefunds: value,
                          }))
                        }
                      />
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
                      <span className="mr-2">🔄</span>Change Policy
                    </Text>
                    <Form.Item
                      name="allowChanges"
                      valuePropName="checked"
                      className="!mb-3"
                    >
                      <Switch
                        onChange={(value) =>
                          setFormValues((prev: any) => ({
                            ...prev,
                            allowChanges: value,
                          }))
                        }
                      />
                      <span className="ml-2">Allow Changes</span>
                    </Form.Item>
                    <Form.Item
                      label="Change Deadline (hours before departure)"
                      name="changeDeadline"
                    >
                      <InputNumber placeholder="24" className="w-full" />
                    </Form.Item>
                    <Form.Item label="Change Fee ($)" name="changeFee">
                      <InputNumber placeholder="0" className="w-full" min={0} />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
          )}

          {/* Step 3: Eligibility Configuration */}
          {policyModalStep === 2 && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <Title level={4} className="!mb-4 text-gray-900 flex">
                  Eligibility Configuration
                </Title>
                <Text className="text-gray-600 text-md max-w-4xl leading-relaxed">
                  Define comprehensive criteria for policy eligibility including
                  loyalty status, passenger demographics, age restrictions, and
                  booking channel preferences.
                </Text>
              </div>
              <div className="space-y-8">
                <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div>
                          <Text className="font-bold text-gray-900 text-lg">
                            Loyalty Program Tiers
                          </Text>
                          <Text className="text-gray-600 text-sm block">
                            Select eligible membership levels for this discount
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
                              Restrict access to business accounts and corporate
                              travelers
                            </Text>
                          </div>
                        </div>
                        <Switch
                          size="large"
                          className="ml-6"
                          onChange={(value) =>
                            setFormValues((prev: any) => ({
                              ...prev,
                              corporateCustomersOnly: value,
                            }))
                          }
                        />
                      </div>
                    </Form.Item>
                  </div>
                </div>
                <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <Title level={4} className="!mb-2 text-gray-900">
                        Demographics & Age
                      </Title>
                      <Text className="text-gray-600 text-sm">
                        Define passenger categories and age-based restrictions
                      </Text>
                    </div>
                  </div>
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
                              className="group/passenger cursor-pointer"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  value={type.value}
                                  className="scale-125"
                                />
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
                <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <Title level={4} className="!mb-2 text-gray-900">
                        Booking Channels
                      </Title>
                      <Text className="text-gray-600 text-sm">
                        Control which booking channels can access this policy
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
                            className="group/channel cursor-pointer"
                          >
                            <div className="flex items-start space-x-4">
                              <Checkbox
                                value={channel.value}
                                className="scale-125 mt-1"
                              />
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
                <div className="rounded-3xl border p-8">
                  <div className="flex items-start space-x-6">
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
                        to determine final policy access.{" "}
                        <span className="font-semibold">
                          Real-time validation
                        </span>{" "}
                        ensures consistent policy enforcement across all booking
                        channels.
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

          {/* Step 4: Discount Stacking & Blackout Dates */}
          {policyModalStep === 3 && (
            <div>
              <Title level={4} className="!mb-4 text-orange-600">
                Discount Stacking & Blackout Dates
              </Title>
              <Text className="text-gray-600 block mb-6">
                Configure how this policy interacts with other offers and define
                any blackout periods.
              </Text>
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
                  <Switch
                    onChange={(value) =>
                      setFormValues((prev: any) => ({
                        ...prev,
                        allowDiscountStacking: value,
                      }))
                    }
                  />
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
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-4">
                  <CalendarOutlined className="text-red-600 mr-2" />
                  <Text className="font-medium text-red-600">
                    Blackout Dates
                  </Text>
                </div>
                <Form.Item name="hasBlackoutDates" valuePropName="checked">
                  <Switch
                    onChange={(value) =>
                      setFormValues((prev: any) => ({
                        ...prev,
                        hasBlackoutDates: value,
                      }))
                    }
                  />
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
                    <Form.Item label="Blackout End Date" name="blackoutEndDate">
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
              <div className="mt-2 mb-8">
                <Title level={3} className="!mb-2 text-gray-900">
                  Validity Period
                </Title>
                <Text className="text-gray-600 text-base">
                  Set the active period for this policy including start date,
                  end date, and timezone.
                </Text>
              </div>
              <Row gutter={16} className="mb-6">
                <Col span={12}>
                  <Form.Item
                    label="Valid From"
                    name="validFrom"
                    rules={[
                      { required: true, message: "Please select start date" },
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
                      { required: true, message: "Please select end date" },
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
                      <Form.Item name="gdprCompliant" valuePropName="checked">
                        <Switch
                          onChange={(value) =>
                            setFormValues((prev: any) => ({
                              ...prev,
                              gdprCompliant: value,
                            }))
                          }
                        />
                        <span className="ml-2">
                          GDPR/Data Protection Compliant
                        </span>
                      </Form.Item>
                      <Form.Item name="adaCompliant" valuePropName="checked">
                        <Switch
                          onChange={(value) =>
                            setFormValues((prev: any) => ({
                              ...prev,
                              adaCompliant: value,
                            }))
                          }
                        />
                        <span className="ml-2">
                          ADA/Accessibility Compliant
                        </span>
                      </Form.Item>
                      <Form.Item
                        name="enableAuditTrail"
                        valuePropName="checked"
                        initialValue={true}
                      >
                        <Switch
                          onChange={(value) =>
                            setFormValues((prev: any) => ({
                              ...prev,
                              enableAuditTrail: value,
                            }))
                          }
                        />
                        <span className="ml-2">Enable Audit Trail</span>
                      </Form.Item>
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
                        <Switch
                          onChange={(value) =>
                            setFormValues((prev: any) => ({
                              ...prev,
                              requiresApproval: value,
                            }))
                          }
                        />
                        <span className="ml-2">Requires Approval</span>
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
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
                onClick={() => {
                  setPolicyModalStep(Math.min(4, policyModalStep + 1));
                  handleFormData();
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
                className="bg-green-600 hover:bg-green-700"
                size="large"
              >
                Create Policy
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
}
