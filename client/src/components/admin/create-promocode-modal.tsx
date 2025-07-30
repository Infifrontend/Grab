
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
  Steps,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Step } = Steps;

interface CreatePromoCodeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingPromoCode?: any;
}

export default function CreatePromoCodeModal({
  visible,
  onCancel,
  onSubmit,
  editingPromoCode,
}: CreatePromoCodeModalProps) {
  const [form] = Form.useForm();
  const [promoModalStep, setPromoModalStep] = useState(0);

  const handleCancel = () => {
    setPromoModalStep(0);
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values: any) => {
    console.log("Promo Code values:", values);
    onSubmit(values);
    setPromoModalStep(0);
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div className="border-b border-gray-200 pb-4 mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            {editingPromoCode ? "Edit Promo Code" : "Create New Promo Code"}
          </Title>
          <Text className="text-gray-600 text-base">
            Manage promotional codes for marketing campaigns
          </Text>
        </div>
      }
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      className="custom-modal"
      bodyStyle={{ padding: "24px 32px 32px" }}
    >
      {/* Steps Navigation */}
      <div className="mb-8">
        <Steps 
          current={promoModalStep} 
          className="custom-steps"
          items={[
            {
              title: "Basic Info",
              description: "Code details",
            },
            {
              title: "Generation",
              description: "Code settings",
            },
            {
              title: "Usage Limits",
              description: "Restrictions",
            },
            {
              title: "Targeting",
              description: "Segments & dates",
            },
          ]}
        />
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div style={{ minHeight: "400px" }}>
          {/* Step 1: Basic Information */}
          {promoModalStep === 0 && (
            <div>
              <Title level={4} className="!mb-4 text-blue-600">
                Basic Information
              </Title>
              <Text className="text-gray-600 block mb-6">
                Set up the fundamental details of your promotional code
              </Text>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <Row gutter={16} className="mb-4">
                  <Col span={12}>
                    <Form.Item
                      label={<span className="font-medium">Promo Name</span>}
                      name="promoName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter promo name",
                        },
                      ]}
                    >
                      <Input
                        placeholder="e.g., Summer Vacation Deal"
                        size="large"
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={<span className="font-medium">Promo Code</span>}
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
                          placeholder="e.g., SUMMER2024"
                          size="large"
                          className="rounded-lg flex-1"
                          style={{ textTransform: 'uppercase' }}
                        />
                        <Button
                          type="text"
                          icon={<span className="text-gray-400">🎲</span>}
                          className="ml-2"
                          size="large"
                          onClick={() => {
                            const randomCode = 'PROMO' + Math.random().toString(36).substring(2, 8).toUpperCase();
                            form.setFieldsValue({ promoCode: randomCode });
                          }}
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
                    placeholder="Describe the promotional offer..."
                    className="rounded-lg"
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      label={<span className="font-medium">Discount Type</span>}
                      name="discountType"
                      initialValue="percentage"
                      rules={[{ required: true, message: "Please select type" }]}
                    >
                      <Select size="large" className="rounded-lg">
                        <Select.Option value="percentage">
                          Percentage (%)
                        </Select.Option>
                        <Select.Option value="fixed">
                          Fixed Amount ($)
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={<span className="font-medium">Discount Value</span>}
                      name="discountValue"
                      initialValue={25}
                      rules={[{ required: true, message: "Please enter value" }]}
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
                        <Select.Option value="inactive">Inactive</Select.Option>
                        <Select.Option value="draft">Draft</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
          )}

          {/* Step 2: Code Generation */}
          {promoModalStep === 1 && (
            <div>
              <Title level={4} className="!mb-4 text-green-600">
                Code Generation & Rules
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
                      <div className="flex items-center p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
                        <input
                          type="radio"
                          value="manual"
                          name="generationType"
                          className="mr-3"
                          defaultChecked
                        />
                        <div>
                          <Text className="font-medium text-blue-900">Manual Entry</Text>
                          <Text className="text-blue-700 text-sm block">
                            Use the code entered above
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <input
                          type="radio"
                          value="auto"
                          name="generationType"
                          className="mr-3"
                        />
                        <div>
                          <Text className="font-medium">Auto Generator</Text>
                          <Text className="text-gray-600 text-sm block">
                            Generate multiple codes automatically
                          </Text>
                        </div>
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
                      label={<span className="font-medium">Code Length</span>}
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
                    <Select.Option value="first-time">
                      First-Time Customer Discount
                    </Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
          )}

          {/* Step 3: Usage Limits & Channel Restrictions */}
          {promoModalStep === 2 && (
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
                      label={<span className="font-medium">Minimum Purchase ($)</span>}
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
                      label={<span className="font-medium">Maximum Discount ($)</span>}
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
                      label={<span className="font-medium">Total Usage Limit</span>}
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
                      label={<span className="font-medium">Per User Limit</span>}
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
                            Website
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
                            NDC API
                          </Text>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                          <Checkbox value="phone" className="scale-110" />
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-orange-600">📞</span>
                          </div>
                          <Text className="font-medium text-orange-800">
                            Call Center
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
          {promoModalStep === 3 && (
            <div>
              <Title level={4} className="!mb-4 text-purple-600">
                Target Segments & Validity Period
              </Title>
              <Text className="text-gray-600 block mb-6">
                Define target customer segments and validity dates
              </Text>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
                <Text className="font-semibold text-lg block mb-4">
                  Target Customer Segments
                </Text>
                <div className="mb-4">
                  <Text className="font-medium block mb-3">
                    Customer Categories
                  </Text>
                  <Form.Item name="customerSegments" className="!mb-0">
                    <Checkbox.Group className="w-full">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                          <Checkbox value="all" className="scale-110" />
                          <Text className="font-medium text-gray-700">
                            All Customers
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
                            VIP Members
                          </Text>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors">
                          <Checkbox value="premium" className="scale-110" />
                          <Text className="font-medium text-purple-800">
                            Premium
                          </Text>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
                          <Checkbox value="business" className="scale-110" />
                          <Text className="font-medium text-blue-800">
                            Business
                          </Text>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors">
                          <Checkbox value="family" className="scale-110" />
                          <Text className="font-medium text-indigo-800">
                            Family Travelers
                          </Text>
                        </div>
                      </div>
                    </Checkbox.Group>
                  </Form.Item>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <Text className="font-semibold text-lg block mb-4">
                  Validity Period
                </Text>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={<span className="font-medium">Start Date</span>}
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

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <Button onClick={handleCancel} size="large">
            Cancel
          </Button>

          <div className="flex space-x-3">
            <Button
              onClick={() =>
                setPromoModalStep(Math.max(0, promoModalStep - 1))
              }
              disabled={promoModalStep === 0}
              size="large"
            >
              Previous
            </Button>
            {promoModalStep < 3 ? (
              <Button
                type="primary"
                onClick={() =>
                  setPromoModalStep(Math.min(3, promoModalStep + 1))
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
          </div>
        </div>
      </Form>

      <style jsx>{`
        .custom-modal .ant-modal-header {
          border-bottom: none;
          padding: 24px 32px 0;
        }

        .custom-modal .ant-modal-title {
          font-size: 18px;
          font-weight: 600;
        }

        .custom-steps .ant-steps-item-title {
          font-weight: 500;
          font-size: 14px;
        }

        .custom-steps .ant-steps-item-description {
          font-size: 12px;
          color: #6b7280;
        }

        .custom-steps .ant-steps-item-finish .ant-steps-item-icon {
          background-color: #10b981;
          border-color: #10b981;
        }

        .custom-steps .ant-steps-item-process .ant-steps-item-icon {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .ant-form-item-label > label {
          font-weight: 500;
          color: #374151;
        }

        .ant-input,
        .ant-select-selector,
        .ant-input-number {
          border-radius: 6px;
          border-color: #d1d5db;
          transition: all 0.2s ease;
        }

        .ant-input:focus,
        .ant-select-focused .ant-select-selector,
        .ant-input-number:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .ant-switch-checked {
          background-color: #10b981;
        }
      `}</style>
    </Modal>
  );
}
