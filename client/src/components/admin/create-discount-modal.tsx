
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
  Progress,
} from "antd";
import { RiseOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface CreateDiscountModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingDiscount?: any;
}

export default function CreateDiscountModal({
  visible,
  onCancel,
  onSubmit,
  editingDiscount,
}: CreateDiscountModalProps) {
  const [form] = Form.useForm();
  const [discountModalStep, setDiscountModalStep] = useState(0);

  const loyaltyOptions = [
    { value: "bronze", label: "Bronze" },
    { value: "silver", label: "Silver" },
    { value: "gold", label: "Gold" },
    { value: "platinum", label: "Platinum" },
    { value: "diamond", label: "Diamond" },
  ];

  const handleCancel = () => {
    setDiscountModalStep(0);
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values: any) => {
    console.log("Discount values:", values);
    onSubmit(values);
    setDiscountModalStep(0);
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div className="border-b border-gray-200 pb-4 mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Create New Discount
          </Title>
          <Text className="text-gray-600 text-base">
            Configure discount rules with advanced targeting and
            combinability options
          </Text>
        </div>
      }
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      className="custom-modal"
      bodyStyle={{ padding: "24px 32px 32px" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div style={{ minHeight: "400px" }}>
          {/* Step 1: Basic Info */}
          {discountModalStep === 0 && (
            <div>
              <Title level={4} className="!mb-4 text-blue-600">
                Basic Information
              </Title>
              <Text className="text-gray-600 block mb-6">
                Configure the fundamental details of your discount
                including name, code, and description.
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
                      <Select.Option value="inactive">Inactive</Select.Option>
                      <Select.Option value="draft">Draft</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {/* Step 2: Target Application */}
          {discountModalStep === 1 && (
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
                        <input
                          type="radio"
                          value="both"
                          className="mr-3"
                        />
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
                      <span className="font-medium">
                        Total Usage Limit
                      </span>
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
          {discountModalStep === 2 && (
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
                    {loyaltyOptions.map((tier) => (
                      <div key={tier.value} className="p-1 flex gap-2 items-center">
                        <Checkbox value={tier.value} className="scale-110" />
                        <div
                          className={`w-4 h-4 rounded-full ${
                            tier.value === "bronze"
                              ? "bg-amber-600"
                              : tier.value === "silver"
                                ? "bg-gray-400"
                                : tier.value === "gold"
                                  ? "bg-yellow-500"
                                  : tier.value === "platinum"
                                    ? "bg-slate-400"
                                    : "bg-blue-500"
                          }`}
                        ></div>
                        <Text
                          className={`font-medium ${
                            tier.value === "bronze"
                              ? "text-amber-800"
                              : tier.value === "silver"
                                ? "text-gray-700"
                                : tier.value === "gold"
                                  ? "text-yellow-800"
                                  : tier.value === "platinum"
                                    ? "text-slate-700"
                                    : "text-blue-800"
                          }`}
                        >
                          {tier.label}
                        </Text>
                      </div>
                    ))}
                  </Checkbox.Group>
                </Form.Item>
              </div>

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
                  />
                </Form.Item>
              </div>
            </div>
          )}

          {/* Step 4: Date Windows */}
          {discountModalStep === 3 && (
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
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="font-medium">
                        Valid Until{" "}
                        <span className="text-red-500">*</span>
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
                    placeholder="Select blackout dates"
                    size="large"
                    className="w-full rounded-lg"
                    format="MMM DD, YYYY"
                  />
                </Form.Item>
              </div>
            </div>
          )}

          {/* Step 5: Combinability */}
          {discountModalStep === 4 && (
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
                        This discount can be used together with
                        promotional codes
                      </Text>
                    </div>
                  </div>
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
                setDiscountModalStep(Math.max(0, discountModalStep - 1))
              }
              disabled={discountModalStep === 0}
              size="large"
            >
              Previous
            </Button>
            {discountModalStep < 4 ? (
              <Button
                type="primary"
                onClick={() =>
                  setDiscountModalStep(Math.min(4, discountModalStep + 1))
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
          </div>
        </div>
      </Form>
    </Modal>
  );
}
