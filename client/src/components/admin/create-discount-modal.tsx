import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Checkbox,
  Row,
  Col,
  Button,
  Typography,
  Radio,
} from "antd";
import { useModalLogic } from "./use-modal-logic";
const { Title, Text } = Typography;

interface DiscountModalProps {
  isModalVisible: boolean;
  editingData?: any;
  setIsModalVisible: (value: boolean) => void;
  setEditingData: (value: any) => void;
  setDiscountTableData: (value: any) => void;
}

const steps = [
  { title: "Basic Information" },
  { title: "Target Application" },
  { title: "Eligibility Criteria" },
  { title: "Date Windows & Validity" },
  { title: "Promo Code Combinability" },
];

export default function DiscountModal({
  isModalVisible,
  editingData,
  setIsModalVisible,
  setEditingData,
  setDiscountTableData,
}: DiscountModalProps) {
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
            Create New Discount
          </Title>
        </div>
      }
      visible={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        setEditingData(null);
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
          console.log("Discount values:", values);
          setDiscountTableData({ ...formValues, ...form.getFieldsValue() });
          setIsModalVisible(false);
          setEditingData(null);
        }}
      >
        {/* Steps Navigation */}
        <div className="relative mb-8">
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
                <div className="mt-2 text-center max-w-[100px]">
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

        <div style={{ minHeight: "400px" }} className="mb-6">
          {/* Step 1: Basic Information */}
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
                        Discount Name <span className="text-red-500">*</span>
                      </span>
                    }
                    name="discountName"
                    rules={[
                      { required: true, message: "Please enter discount name" },
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
                        Discount Code <span className="text-red-500">*</span>
                      </span>
                    }
                    name="discountCode"
                    rules={[
                      { required: true, message: "Please enter discount code" },
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
                        Discount Type <span className="text-red-500">*</span>
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
                      <Select.Option value="fixed">Fixed Amount</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={
                      <span className="font-medium">
                        Discount Value <span className="text-red-500">*</span>
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
          {policyModalStep === 1 && (
            <div>
              <Title level={4} className="!mb-4 text-green-600">
                Target Application
              </Title>
              <Text className="text-gray-600 block mb-6">
                Define how and where this discount should be applied.
              </Text>
              <div className="space-y-4 mb-6">
                <Form.Item name="targetApplication" initialValue="baseFareOnly">
                  <Radio.Group className="w-full">
                    <div className="space-y-3">
                      <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                        <Radio value="baseFareOnly" className="w-full">
                          <div className="flex items-center">
                            <div className="ml-3">
                              <Text className="font-semibold text-blue-900">
                                Base Fare Only
                              </Text>
                              <Text className="text-blue-700 text-sm block">
                                Apply discount to base fare/ticket price
                              </Text>
                            </div>
                          </div>
                        </Radio>
                      </div>

                      <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                        <Radio value="ancillariesOnly" className="w-full">
                          <div className="flex items-center">
                            <div className="ml-3">
                              <Text className="font-semibold">
                                Ancillaries Only
                              </Text>
                              <Text className="text-gray-600 text-sm block">
                                Apply discount to selected ancillary services
                              </Text>
                            </div>
                          </div>
                        </Radio>
                      </div>

                      <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                        <Radio value="both" className="w-full">
                          <div className="flex items-center">
                            <div className="ml-3">
                              <Text className="font-semibold">
                                Both Base Fare & Ancillaries
                              </Text>
                              <Text className="text-gray-600 text-sm block">
                                Apply discount to both fare and selected
                                services
                              </Text>
                            </div>
                          </div>
                        </Radio>
                      </div>
                    </div>
                  </Radio.Group>
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
                    label={<span className="font-medium">Per User Limit</span>}
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

          {/* Step 3: Eligibility Criteria */}
          {policyModalStep === 2 && (
            <div className="space-y-6">
              <div className="mb-4">
                <Title level={4} className="!mb-4 text-blue-600">
                  Eligibility Criteria
                </Title>
                <Text className="text-gray-600 text-base">
                  Define who can access this discount based on loyalty status,
                  location, and spending requirements.
                </Text>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <div className="mb-4">
                  <Title
                    level={5}
                    className="!mb-2 text-gray-900 font-semibold"
                  >
                    Loyalty Program Tiers
                  </Title>
                  <Text className="text-gray-600 text-sm">
                    Select which loyalty tiers are eligible for this discount
                  </Text>
                </div>
                <Form.Item name="loyaltyTiers" className="!mb-0">
                  <Checkbox.Group className="grid grid-cols-6 gap-4 w-full">
                    {["bronze", "silver", "gold", "platinum", "diamond"].map(
                      (tier) => (
                        <Checkbox value={tier} className="w-[135px]">
                            <div key={tier} className="p-1 flex gap-2 items-center">
                          <div
                            className={`flex w-4 h-4 rounded-full ${
                              tier === "bronze"
                                ? "bg-amber-600"
                                : tier === "silver"
                                ? "bg-gray-400"
                                : tier === "gold"
                                ? "bg-yellow-500"
                                : tier === "platinum"
                                ? "bg-slate-400"
                                : "bg-blue-500"
                            }`}
                          ></div>
                          <Text
                            className={`font-medium ${
                              tier === "bronze"
                                ? "text-amber-800"
                                : tier === "silver"
                                ? "text-gray-700"
                                : tier === "gold"
                                ? "text-yellow-800"
                                : tier === "platinum"
                                ? "text-slate-700"
                                : "text-blue-800"
                            }`}
                          >
                            {tier.charAt(0).toUpperCase() + tier.slice(1)}
                          </Text>
                          </div>
                          </Checkbox>
                      )
                    )}
                  </Checkbox.Group>
                </Form.Item>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <div className="mb-4">
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
                    <div className="grid grid-cols-6 gap-4">
                      {["US", "CA", "MX", "UK", "AU", "DE", "FR", "JP"].map(
                        (country) => (
                          <div
                            key={country}
                            className={`flex items-center space-x-3 w-[135px]`}
                          >
                            <Checkbox value={country}>
                              <Text
                                className={`flex font-medium ${
                                  country === "US"
                                    ? "text-blue-800"
                                    : country === "CA"
                                    ? "text-red-800"
                                    : country === "MX"
                                    ? "text-green-800"
                                    : country === "UK"
                                    ? "text-purple-800"
                                    : country === "AU"
                                    ? "text-orange-800"
                                    : country === "DE"
                                    ? "text-yellow-800"
                                    : country === "FR"
                                    ? "text-indigo-800"
                                    : "text-pink-800"
                                }`}
                              >
                                {country === "US"
                                  ? "🇺🇸 US"
                                  : country === "CA"
                                  ? "🇨🇦 CA"
                                  : country === "MX"
                                  ? "🇲🇽 MX"
                                  : country === "UK"
                                  ? "🇬🇧 UK"
                                  : country === "AU"
                                  ? "🇦🇺 AU"
                                  : country === "DE"
                                  ? "🇩🇪 DE"
                                  : country === "FR"
                                  ? "🇫🇷 FR"
                                  : "🇯🇵 JP"}
                              </Text>
                            </Checkbox>
                          </div>
                        )
                      )}
                    </div>
                  </Checkbox.Group>
                </Form.Item>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <div className="mb-4">
                  <Title
                    level={5}
                    className="!mb-2 text-gray-900 font-semibold"
                  >
                    Route Restrictions
                  </Title>
                  <Text className="text-gray-600 text-sm">
                    Limit discount to specific flight routes (leave empty for
                    all routes)
                  </Text>
                </div>
                <Form.Item name="routeRestrictions" className="!mb-0">
                  <Checkbox.Group className="w-full">
                    <div className="grid grid-cols-6 gap-4">
                      {[
                        "LAX-JFK",
                        "ORD-SFO",
                        "MIA-DEN",
                        "ATL-SEA",
                        "DEN-BOS",
                        "LAX-ORD",
                      ].map((route) => (
                        <Checkbox value={route} className="w-[135px]">
                            <div
                              key={route}
                              className="flex items-center space-x-3"
                            >
                          <Text className="font-medium text-gray-700">
                            {route}
                          </Text>
                        </div>
                        </Checkbox>
                    
                  ))}
                  </div>
                  </Checkbox.Group>
                </Form.Item>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <div className="mb-4">
                  <Title
                    level={5}
                    className="!mb-2 text-gray-900 font-semibold"
                  >
                    Minimum Spend Threshold ($)
                  </Title>
                  <Text className="text-gray-600 text-sm">
                    Set a minimum purchase amount required to use this discount
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
                    parser={(value:any) => value?.replace(/\$\s?|(,*)/g, "") || ""}
                    style={{
                      fontSize: "16px",
                      padding: "5px",
                      borderRadius: "8px",
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          )}

          {/* Step 4: Date Windows & Validity */}
          {policyModalStep === 3 && (
            <div>
              <Title level={4} className="!mb-2 text-orange-600">
                Date Windows & Validity
              </Title>
              <Text className="text-gray-600 block mb-6">
                Set the validity period and any blackout dates for this
                discount.
              </Text>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <span className="font-medium">
                        Valid From <span className="text-red-500">*</span>
                      </span>
                    }
                    name="validFrom"
                    rules={[
                      { required: true, message: "Please select start date" },
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
                      { required: true, message: "Please select end date" },
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
                <Col span={12}>
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
                </Col>
              </Row>
            </div>
          )}

          {/* Step 5: Combinability */}
          {policyModalStep === 4 && (
            <div>
              <Title level={4} className="!mb-4 text-pink-600">
                Promo Code Combinability
              </Title>
              <Text className="text-gray-600 block mb-6">
                Configure how this discount interacts with promotional codes.
              </Text>
              <div className="pt-4 px-4 pb-2 border border-gray-200 rounded-lg bg-gray-50">
                <Form.Item
                  name="allowPromoCodeCombination"
                  valuePropName="checked"
                  className="!mb-4"
                  rules={[
                    {
                      required: true,
                      message: "Please choose",
                    },
                  ]}
                >
                  <div className="flex items-start">
                    <Checkbox className="mr-4 mt-1" />
                    <div>
                      <Text className="font-semibold text-md block">
                        Allow Combination with Promo Codes
                      </Text>
                      <Text className="text-gray-600 text-sm">
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

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button
            onClick={() => {
              setIsModalVisible(false);
              setEditingData(null);
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
                  handleFormData();
                  setTimeout(() => {
                    setPolicyModalStep(Math.min(4, policyModalStep + 1));
                  }, 100);
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
                {(editingData && Object.keys(editingData)?.length) ? "Update " : "Create "}  Discount
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
}
