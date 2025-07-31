
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
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingPolicy?: any;
}

export default function CreatePolicyModal({
  visible,
  onCancel,
  onSubmit,
  editingPolicy,
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

  const handleCancel = () => {
    setPolicyModalStep(0);
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values: any) => {
    console.log("Policy values:", values);
    onSubmit(values);
    setPolicyModalStep(0);
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div className="border-b border-gray-200 pb-4 mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Create New Policy
          </Title>
          <Text className="text-gray-600 text-base">
            Configure comprehensive policy rules including refund/change
            policies, eligibility criteria, stacking rules, blackout dates,
            and compliance constraints
          </Text>
        </div>
      }
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      className="custom-modal"
      bodyStyle={{ padding: "24px 32px 32px" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                        <Form.Item
                          label="Refund Fee ($)"
                          name="refundFee"
                        >
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
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <UserOutlined className="text-4xl text-white" />
                </div>
                <Title level={2} className="!mb-4 text-gray-900">
                  Eligibility Configuration
                </Title>
                <Text className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
                  Define comprehensive criteria for policy eligibility
                  including loyalty status, passenger demographics, age
                  restrictions, and booking channel preferences.
                </Text>
              </div>

              <div className="space-y-12">
                {/* Loyalty & Membership Section */}
                <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                      <TrophyOutlined className="text-white text-2xl" />
                    </div>
                    <div>
                      <Title level={3} className="!mb-2 text-gray-900">
                        Loyalty & Membership
                      </Title>
                      <Text className="text-gray-600 text-base">
                        Configure tier-based access and corporate customer
                        restrictions
                      </Text>
                    </div>
                  </div>

                  <Form.Item
                    name="loyaltyTiers"
                    className="!mb-6"
                    label="Loyalty Program Tiers"
                  >
                    <Checkbox.Group className="w-full">
                      <div className="space-y-3">
                        {loyaltyOptions.map((item) => (
                          <div
                            key={item.value}
                            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
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

                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <Form.Item
                      name="corporateCustomersOnly"
                      valuePropName="checked"
                      className="!mb-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="text-blue-600 text-2xl">🏢</span>
                          </div>
                          <div>
                            <Text className="font-semibold text-gray-900 text-lg block">
                              Corporate Customers Only
                            </Text>
                            <Text className="text-gray-600 text-base">
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
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-4">
                  <CalendarOutlined className="text-red-600 mr-2" />
                  <Text className="font-medium text-red-600">
                    Blackout Dates
                  </Text>
                </div>

                <Form.Item
                  name="hasBlackoutDates"
                  valuePropName="checked"
                >
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

                <Form.Item
                  name="gdprCompliant"
                  valuePropName="checked"
                >
                  <Switch />
                  <span className="ml-2">GDPR/Data Protection Compliant</span>
                </Form.Item>

                <Form.Item
                  name="enableAuditTrail"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                  <span className="ml-2">Enable Audit Trail</span>
                </Form.Item>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <Button onClick={handleCancel} size="large">
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
          </div>
        </div>
      </Form>
    </Modal>
  );
}
