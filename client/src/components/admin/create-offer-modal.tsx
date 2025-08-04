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
  Radio,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useModalLogic } from "./use-modal-logic";
import dayjs from "dayjs";
import { useWatch } from "antd/es/form/Form";

const { Title, Text } = Typography;

interface CreateOfferModalProps {
  visible: boolean;
  onCancel: () => void;
  setIsModalVisible: (values: any) => void;
  setOffersTableData: (values: any) => void;
  editingData?: any;
}

const steps = [
  { title: "Basic Information" },
  { title: "Template" },
  { title: "Ancillaries" },
  { title: "Personalization" },
  { title: "Dynamic Pricing" },
  { title: "Output Channels" },
];

export default function CreateOfferModal({
  visible,
  onCancel,
  setIsModalVisible,
  setOffersTableData,
  editingData,
}: CreateOfferModalProps) {
  const [form] = Form.useForm();
  const {
    formValues,
    setFormValues,
    policyModalStep: offerModalStep,
    setPolicyModalStep: setOfferModalStep,
    handleFormData,
  } = useModalLogic({
    editingData: editingData,
    isModalVisible: visible,
    form,
  });

  const selectedTemplate = useWatch("selectedTemplate", form);

  // Handle "Next" button click with validation
  const handleNext = async () => {
    try {
      if (offerModalStep === 0) {
        await form.validateFields(["offerName", "offerCode"]);
      }
      handleFormData();
      setTimeout(() => {
        setOfferModalStep(Math.min(5, offerModalStep + 1));
      }, 100);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    setOfferModalStep(0);
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      style={{ top: 50 }}
      title={
        <div className="border-b border-gray-200 pb-4 mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Create New Offer
          </Title>
          <Text className="text-gray-600 text-base">
            Create a new offer in the system
          </Text>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={900}
      className="custom-modal"
      bodyStyle={{ padding: "24px 32px 32px" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={() => {
          setOffersTableData({ ...formValues, ...form.getFieldsValue() });
          setIsModalVisible(false);
        }}
      >
        {/* Steps Navigation */}
        <div className="relative mb-8">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-blue-500 z-10"
            style={{
              width: `${(offerModalStep / (steps.length - 1)) * 100}%`,
            }}
          />
          <div className="relative flex justify-between z-20">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-3
                    ${
                      index < offerModalStep
                        ? "bg-green-500 border-green-500 text-white"
                        : index === offerModalStep
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white border-gray-300 text-gray-500"
                    }
                  `}
                >
                  {index < offerModalStep ? (
                    <span className="text-sm">✓</span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center max-w-[120px]">
                  <Text
                    className={`text-xs font-medium ${
                      index <= offerModalStep
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

        <div style={{ minHeight: "400px" }}>
          {/* Step 1: Basic Information */}
          {offerModalStep === 0 && (
            <div className="space-y-6">
              <div>
                <Title level={4} className="!mb-4 text-blue-600">
                  Basic Information
                </Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={
                        <span className="font-medium">
                          Offer Name <span className="text-red-500">*</span>
                        </span>
                      }
                      name="offerName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter offer name",
                        },
                      ]}
                    >
                      <Input
                        placeholder="e.g., Premium Business Package"
                        size="large"
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={
                        <span className="font-medium">
                          Offer Code <span className="text-red-500">*</span>
                        </span>
                      }
                      name="offerCode"
                      rules={[
                        {
                          required: true,
                          message: "Please enter offer code",
                        },
                      ]}
                    >
                      <Input
                        placeholder="e.g., PBP001"
                        size="large"
                        className="rounded-lg"
                      />
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
                    placeholder="Describe the offer package"
                    className="rounded-lg"
                  />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      label={<span className="font-medium">Status</span>}
                      name="status"
                      initialValue="draft"
                    >
                      <Select size="large" className="rounded-lg">
                        <Select.Option value="draft">Draft</Select.Option>
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="inactive">Inactive</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={
                        <span className="font-medium">Base Price ($)</span>
                      }
                      name="basePrice"
                      initialValue={0}
                    >
                      <InputNumber
                        placeholder="0.00"
                        size="large"
                        className="w-full rounded-lg"
                        min={0}
                        step={0.01}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16} className="mb-2">
                  <Col span={12}>
                    <Form.Item
                      label={<span className="font-medium">Start Date</span>}
                      name="startDate"
                    >
                      <DatePicker
                        placeholder="Select date"
                        size="large"
                        className="w-full rounded-lg"
                        suffixIcon={
                          <CalendarOutlined className="text-gray-400" />
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={<span className="font-medium">End Date</span>}
                      name="endDate"
                    >
                      <DatePicker
                        placeholder="Select date"
                        size="large"
                        className="w-full rounded-lg"
                        suffixIcon={
                          <CalendarOutlined className="text-gray-400" />
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
          )}

          {/* Step 2: Template */}
          {offerModalStep === 1 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center">
                  <span className="text-yellow-500 !mb-2 mr-2">⭐</span>
                  <Title level={4} className="!mb-2 text-green-600">
                    Offer Templates
                  </Title>
                </div>
                <Text className="text-gray-600 block mb-6">
                  Choose a template that defines the offer structure and target
                  market
                </Text>
                <Form.Item name="selectedTemplate" className="mb-6">
                  <Radio.Group className="w-full">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Basic Template */}
                      <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-colors has-[:checked]:border-green-500 has-[:checked]:bg-green-50 hover:border-gray-300">
                        <Radio value="basic" className="w-full">
                          <div className="flex items-center mb-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <Text className="font-semibold has-[:checked]:text-green-900">
                              Basic
                            </Text>
                          </div>
                          <Text className="text-sm text-gray-600 block mb-2 ml-5 has-[:checked]:text-green-700">
                            Simple upgrade package with essential services
                          </Text>
                          <ul className="text-xs text-gray-500 space-y-1 ml-5 has-[:checked]:text-green-600">
                            <li>• Entry level pricing</li>
                            <li>• Essential ancillaries</li>
                            <li>• Standard targeting</li>
                          </ul>
                        </Radio>
                      </div>

                      {/* Value Template */}
                      <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 hover:border-gray-300">
                        <Radio value="value" className="w-full">
                          <div className="flex items-center mb-1">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <Text className="font-semibold has-[:checked]:text-blue-900">
                              Value
                            </Text>
                          </div>
                          <Text className="text-sm text-gray-600 block mb-2 ml-5 has-[:checked]:text-blue-700">
                            Balanced package offering good value for money
                          </Text>
                          <ul className="text-xs text-gray-500 space-y-1 ml-5 has-[:checked]:text-blue-600">
                            <li>• Competitive pricing</li>
                            <li>• Popular ancillaries</li>
                            <li>• Broad market appeal</li>
                          </ul>
                        </Radio>
                      </div>

                      {/* Premium Template */}
                      <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-colors has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50 hover:border-gray-300">
                        <Radio value="premium" className="w-full">
                          <div className="flex items-center mb-1">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                            <Text className="font-semibold has-[:checked]:text-purple-900">
                              Premium
                            </Text>
                          </div>
                          <Text className="text-sm text-gray-600 block mb-2 ml-5 has-[:checked]:text-purple-700">
                            High-end package with luxury services
                          </Text>
                          <ul className="text-xs text-gray-500 space-y-1 ml-5 has-[:checked]:text-purple-600">
                            <li>• Premium pricing</li>
                            <li>• Luxury ancillaries</li>
                            <li>• High-value customers</li>
                          </ul>
                        </Radio>
                      </div>
                    </div>
                  </Radio.Group>
                </Form.Item>
                {/* Selected Template Display */}
                <div className="relative">
                  {selectedTemplate === "basic" && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <Text className="font-medium text-green-900 block mb-2">
                        Selected Template: Basic
                      </Text>
                      <Text className="text-green-700 text-sm">
                        Perfect for budget-conscious travelers who want
                        essential upgrades.
                      </Text>
                    </div>
                  )}
                  {selectedTemplate === "value" && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <Text className="font-medium text-blue-900 block mb-2">
                        Selected Template: Value
                      </Text>
                      <Text className="text-blue-700 text-sm">
                        Perfect for travelers who want a good balance of
                        features and price.
                      </Text>
                    </div>
                  )}
                  {selectedTemplate === "premium" && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <Text className="font-medium text-purple-900 block mb-2">
                        Selected Template: Premium
                      </Text>
                      <Text className="text-purple-700 text-sm">
                        Ideal for luxury travelers seeking premium services and
                        exclusivity.
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Ancillaries */}
          {offerModalStep === 2 && (
            <div className="space-y-6">
              <div>
                <Title level={4} className="!mb-2 text-orange-600">
                  Ancillaries
                </Title>
                <Text className="text-gray-600 block mb-6">
                  Select ancillary services to include in this offer
                </Text>
                <Form.Item name="ancillaryServices">
                  <Checkbox.Group className="w-full">
                    <div className="grid grid-cols-2 gap-10 w-[75%]">
                      <div className="space-y-3">
                        <Text className="font-bold text-md text-gray-900">
                          Seating
                        </Text>
                        <div className="space-y-2">
                          <div>
                            <Checkbox value="extra-legroom">
                              Extra Legroom
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox value="window-seat">
                              Window Seat Selection
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox value="aisle-seat">
                              Aisle Seat Selection
                            </Checkbox>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Text className="font-bold text-md text-gray-900">
                          Food & Beverage
                        </Text>
                        <div className="space-y-2">
                          <div>
                            <Checkbox value="premium-meal">
                              Premium Meal
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox value="special-meal">
                              Special Dietary Meal
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox value="drinks-package">
                              Drinks Package
                            </Checkbox>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Text className="font-bold text-md text-gray-900">
                          Services
                        </Text>
                        <div className="space-y-2">
                          <div>
                            <Checkbox value="priority-boarding">
                              Priority Boarding
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox value="fast-track">
                              Fast Track Security
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox value="lounge-access">
                              Lounge Access
                            </Checkbox>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Text className="font-bold text-md text-gray-900">
                          Baggage
                        </Text>
                        <div className="space-y-2">
                          <div>
                            <Checkbox value="extra-baggage">
                              Extra Baggage
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox value="priority-baggage">
                              Priority Baggage
                            </Checkbox>
                          </div>
                          <div>
                            <Checkbox value="fragile-handling">
                              Fragile Item Handling
                            </Checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </div>
          )}

          {/* Step 4: Personalization */}
          {offerModalStep === 3 && (
            <div className="space-y-6">
              <div>
                <Title level={4} className="!mb-2 text-purple-600">
                  Personalization
                </Title>
                <Text className="text-gray-600 block mb-6">
                  Configure targeting criteria for this offer
                </Text>
                <Row gutter={24}>
                  <Col span={8}>
                    <div className="space-y-4">
                      <div className="flex items-center mb-3">
                        <span className="mr-2">👥</span>
                        <Text className="font-bold">Customer Segments</Text>
                      </div>
                      <Form.Item name="customerSegments">
                        <Checkbox.Group>
                          <div className="space-y-2">
                            <div>
                              <Checkbox value="business">
                                Business Travelers
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="leisure">
                                Leisure Travelers
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="frequent">
                                Frequent Flyers
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="first-time">
                                First Time Flyers
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="family">
                                Family Travelers
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="price-sensitive">
                                Price Sensitive
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="premium">
                                Premium Customers
                              </Checkbox>
                            </div>
                          </div>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="space-y-4">
                      <div className="flex items-center mb-3">
                        <span className="mr-2">🎯</span>
                        <Text className="font-bold">Behavior Triggers</Text>
                      </div>
                      <Form.Item name="behaviorTriggers">
                        <Checkbox.Group>
                          <div className="space-y-2">
                            <div>
                              <Checkbox value="previous-premium">
                                Previous premium purchases
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="route-frequency">
                                Route frequency 5
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="price-comparison">
                                Price comparison activity
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="previous-bookings">
                                Previous bookings
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="first-booking">
                                First booking
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="multiple-passenger">
                                Multiple passenger bookings
                              </Checkbox>
                            </div>
                          </div>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="space-y-4">
                      <div className="flex items-center mb-3">
                        <span className="mr-2">📍</span>
                        <Text className="font-bold">Context Factors</Text>
                      </div>
                      <Form.Item name="contextFactors">
                        <Checkbox.Group>
                          <div className="space-y-2">
                            <div>
                              <Checkbox value="flight-duration">
                                Flight duration &gt; 4hrs
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="international">
                                International routes
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="weekend">
                                Weekend travel
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="vacation">
                                Vacation destinations
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="short-flights">
                                Short flights &lt; 3hrs
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="domestic">
                                Domestic routes
                              </Checkbox>
                            </div>
                            <div>
                              <Checkbox value="business-hours">
                                Business hours
                              </Checkbox>
                            </div>
                          </div>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}

          {/* Step 5: Dynamic Pricing */}
          {offerModalStep === 4 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center">
                  <Title level={4} className="!mb-2 text-yellow-600">
                    Dynamic Pricing Configuration
                  </Title>
                </div>
                <Text className="text-gray-600 block mb-6">
                  Configure real-time fare integration and pricing multipliers
                </Text>
                <div className="bg-gray-50 p-3 rounded-lg mb-6">
                  <Form.Item
                    name="enableDynamicPricing"
                    valuePropName="checked"
                    className="!mb-0"
                  >
                    <div className="flex items-center justify-between">
                      <Text className="font-medium">
                        Enable Dynamic Pricing
                      </Text>
                      <Switch
                        onChange={(value) =>
                          setFormValues((prev: any) => ({
                            ...prev,
                            enableDynamicPricing: value,
                          }))
                        }
                      />
                    </div>
                  </Form.Item>
                </div>
                <div className="mb-8">
                  <div className="flex items-center mb-2">
                    <Text className="font-bold text-md">
                      Discount & Promo Evaluation
                    </Text>
                  </div>
                  <Text className="text-gray-600 text-sm block mb-4">
                    Configure applicable discounts and promotional codes for
                    this offer
                  </Text>
                  <div className="mb-4">
                    <Text className="font-medium text-sm block mb-3">
                      Applicable Promo Codes
                    </Text>
                    <Form.Item name="promoCodes">
                      <Checkbox.Group>
                        <Row gutter={[16, 8]}>
                          <Col span={6}>
                            <Checkbox value="BUSINESS25">BUSINESS25</Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox value="PREMIUM15">PREMIUM15</Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox value="SAVE20">SAVE20</Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox value="WEEKEND15">WEEKEND15</Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox value="FIRST10">FIRST10</Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox value="BASIC5">BASIC5</Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox value="SUMMER2024">SUMMER2024</Checkbox>
                          </Col>
                          <Col span={6}>
                            <Checkbox value="LOYALTY25">LOYALTY25</Checkbox>
                          </Col>
                        </Row>
                      </Checkbox.Group>
                    </Form.Item>
                  </div>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        label="Loyalty Discount (%)"
                        name="loyaltyDiscount"
                        initialValue={0}
                      >
                        <InputNumber
                          className="w-full rounded-lg"
                          min={0}
                          max={100}
                          placeholder="0"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Bundle Discount (%)"
                        name="bundleDiscount"
                        initialValue={0}
                      >
                        <InputNumber
                          className="w-full rounded-lg"
                          min={0}
                          max={100}
                          placeholder="0"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <div className="mt-6">
                        <Form.Item
                          name="allowDiscountStacking"
                          valuePropName="checked"
                          className="!mb-0"
                        >
                          <Checkbox>Allow Discount Stacking</Checkbox>
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Output Channels */}
          {offerModalStep === 5 && (
            <div className="space-y-6">
              <div>
                <Title level={4} className="!mb-2 text-pink-600">
                  Output Channels
                </Title>
                <Text className="text-gray-600 block mb-6">
                  Configure distribution channels for this offer
                </Text>
                <Row gutter={24}>
                  <Col span={12}>
                    <div className="bg-white border rounded-lg p-4 mb-6">
                      <div className="flex items-center mb-2">
                        <Text className="font-medium text-lg">
                          Website Integration
                        </Text>
                      </div>
                      <Form.Item
                        name="enableWebsite"
                        valuePropName="checked"
                        className="mb-2"
                        rules={[
                          {
                            required: true,
                            message: "Please choose",
                          },
                        ]}
                      >
                        <div className="flex items-center">
                          <Switch
                            className="mr-3"
                            onChange={(value) =>
                              setFormValues((prev: any) => ({
                                ...prev,
                                enableWebsite: value,
                              }))
                            }
                          />
                          <Text>Enable Website Distribution</Text>
                        </div>
                      </Form.Item>
                      <div>
                        <Text className="text-sm text-gray-600 mb-2">
                          Display Mode
                        </Text>
                        <Form.Item name="websiteDisplayMode" className="!mb-0">
                          <Select
                            defaultValue="standard"
                            className="w-full rounded-lg"
                          >
                            <Select.Option value="standard">
                              Standard
                            </Select.Option>
                            <Select.Option value="featured">
                              Featured
                            </Select.Option>
                            <Select.Option value="premium">
                              Premium
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="bg-white border rounded-lg p-6 mb-6">
                      <div className="flex items-center mb-4">
                        <Text className="font-medium text-lg">
                          Mobile Application
                        </Text>
                      </div>
                      <Form.Item
                        name="enableMobile"
                        valuePropName="checked"
                        className="mb-2"
                      >
                        <div className="flex items-center">
                          <Switch
                            className="mr-3"
                            onChange={(value) =>
                              setFormValues((prev: any) => ({
                                ...prev,
                                enableMobile: value,
                              }))
                            }
                          />
                          <Text>Enable Mobile Distribution</Text>
                        </div>
                      </Form.Item>
                      <Form.Item
                        name="mobileOptimized"
                        valuePropName="checked"
                        className="!mb-0"
                      >
                        <div className="flex items-center">
                          <Switch
                            className="mr-3"
                            onChange={(value) =>
                              setFormValues((prev: any) => ({
                                ...prev,
                                mobileOptimized: value,
                              }))
                            }
                          />
                          <Text>Mobile Optimized Display</Text>
                        </div>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Text className="font-medium text-lg">
                          NDC Integration
                        </Text>
                      </div>
                      <Form.Item
                        name="enableNDC"
                        valuePropName="checked"
                        className="!mb-0"
                      >
                        <div className="flex items-center">
                          <Switch
                            className="mr-3"
                            onChange={(value) =>
                              setFormValues((prev: any) => ({
                                ...prev,
                                enableDNC: value,
                              }))
                            }
                          />
                          <Text>Enable NDC Distribution</Text>
                        </div>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="bg-white border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Text className="font-medium text-lg">
                          API Integration
                        </Text>
                      </div>
                      <Form.Item
                        name="enableAPI"
                        valuePropName="checked"
                        className="!mb-0"
                      >
                        <div className="flex items-center">
                          <Switch
                            className="mr-3"
                            onChange={(value) =>
                              setFormValues((prev: any) => ({
                                ...prev,
                                enableAPI: value,
                              }))
                            }
                          />
                          <Text>Enable API Access</Text>
                        </div>
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
          <Button onClick={handleCancel} size="large">
            Cancel
          </Button>
          <div className="flex space-x-3">
            <Button
              onClick={() => setOfferModalStep(Math.max(0, offerModalStep - 1))}
              disabled={offerModalStep === 0}
              size="large"
            >
              Previous
            </Button>
            {offerModalStep < 5 ? (
              <Button
                type="primary"
                onClick={handleNext}
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
                {(editingData && Object.keys(editingData)?.length) ? "Update " : "Create "}  Offer
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
}
