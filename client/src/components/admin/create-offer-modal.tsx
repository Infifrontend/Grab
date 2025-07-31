
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
  Tabs,
} from "antd";
import { PlusOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface CreateOfferModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingOffer?: any;
}

export default function CreateOfferModal({
  visible,
  onCancel,
  onSubmit,
  editingOffer,
}: CreateOfferModalProps) {
  const [form] = Form.useForm();
  const [offersModalTab, setOffersModalTab] = useState("basicInfo");

  const handleCancel = () => {
    setOffersModalTab("basicInfo");
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values: any) => {
    console.log("Offer values:", values);
    onSubmit(values);
    setOffersModalTab("basicInfo");
    form.resetFields();
  };

  return (
    <Modal
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
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      className="custom-modal"
      bodyStyle={{ padding: "24px 32px 32px" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Tabs for Offers Modal */}
        <Tabs
          activeKey={offersModalTab}
          onChange={setOffersModalTab}
          className="mb-6"
          items={[
            {
              key: "basicInfo",
              label: "Basic Info",
            },
            {
              key: "template",
              label: "Template",
            },
            {
              key: "ancillaries",
              label: "Ancillaries",
            },
            {
              key: "personalization",
              label: "Personalization",
            },
            {
              key: "dynamicPricing",
              label: "Dynamic Pricing",
            },
            {
              key: "outputChannels",
              label: "Output Channels",
            },
          ]}
        />

        {/* Tab Content for Offers */}
        <div style={{ minHeight: "400px" }}>
          {/* Basic Info Tab */}
          {offersModalTab === "basicInfo" && (
            <div className="space-y-6">
              <div>
                <Title level={4} className="!mb-4">
                  Basic Information
                </Title>

                <Row gutter={16} className="mb-4">
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
                      <Input placeholder="e.g., PBP001" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label={<span className="font-medium">Description</span>}
                  name="description"
                  className="mb-4"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Describe the offer package"
                  />
                </Form.Item>

                <Row gutter={16} className="mb-4">
                  <Col span={8}>
                    <Form.Item
                      label={<span className="font-medium">Status</span>}
                      name="status"
                      initialValue="draft"
                    >
                      <Select size="large">
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
                        className="w-full"
                        min={0}
                        step={0.01}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={<span className="font-medium">Start Date</span>}
                      name="startDate"
                    >
                      <DatePicker
                        placeholder="Select date"
                        size="large"
                        className="w-full"
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
                        className="w-full"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
          )}

          {/* Template Tab */}
          {offersModalTab === "template" && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500 mr-2">⭐</span>
                  <Title level={4} className="!mb-2">
                    Offer Templates
                  </Title>
                </div>
                <Text className="text-gray-600 block mb-6">
                  Choose a template that defines the offer structure and target
                  market
                </Text>

                <Form.Item name="selectedTemplate" className="mb-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 border-2 border-green-500 bg-green-50 rounded-lg cursor-pointer">
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <Text className="font-semibold">Basic</Text>
                      </div>
                      <Text className="text-sm text-gray-600 mb-2">
                        Simple upgrade package with essential services
                      </Text>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Entry level pricing</li>
                        <li>• Essential ancillaries</li>
                        <li>• Standard targeting</li>
                      </ul>
                    </div>

                    <div className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg cursor-pointer">
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <Text className="font-semibold">Value</Text>
                      </div>
                      <Text className="text-sm text-gray-600 mb-2">
                        Balanced package offering good value for money
                      </Text>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Competitive pricing</li>
                        <li>• Popular ancillaries</li>
                        <li>• Broad market appeal</li>
                      </ul>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <Text className="font-semibold">Premium</Text>
                      </div>
                      <Text className="text-sm text-gray-600 mb-2">
                        High-end package with luxury services
                      </Text>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• Premium pricing</li>
                        <li>• Luxury ancillaries</li>
                        <li>• High-value customers</li>
                      </ul>
                    </div>
                  </div>
                </Form.Item>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Text className="font-medium text-blue-900 block mb-2">
                    Selected Template: Value
                  </Text>
                  <Text className="text-blue-700 text-sm">
                    Perfect for travelers who want a good balance of features and
                    price.
                  </Text>
                </div>
              </div>
            </div>
          )}

          {/* Ancillaries Tab */}
          {offersModalTab === "ancillaries" && (
            <div className="space-y-6">
              <div>
                <Title level={4} className="!mb-4">
                  Ancillaries
                </Title>
                <Text className="text-gray-600 block mb-6">
                  Select ancillary services to include in this offer
                </Text>

                <Form.Item name="ancillaryServices">
                  <Checkbox.Group className="w-full">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Text className="font-medium text-gray-900">
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
                        <Text className="font-medium text-gray-900">
                          Food & Beverage
                        </Text>
                        <div className="space-y-2">
                          <div>
                            <Checkbox value="premium-meal">Premium Meal</Checkbox>
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
                        <Text className="font-medium text-gray-900">
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
                        <Text className="font-medium text-gray-900">
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

          {/* Personalization Tab */}
          {offersModalTab === "personalization" && (
            <div className="space-y-6">
              <div>
                <Title level={4} className="!mb-4">
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
                        <Text className="font-medium">Customer Segments</Text>
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
                              <Checkbox value="family">Family Travelers</Checkbox>
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
                        <Text className="font-medium">Behavior Triggers</Text>
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
                        <Text className="font-medium">Context Factors</Text>
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
                              <Checkbox value="weekend">Weekend travel</Checkbox>
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
                              <Checkbox value="domestic">Domestic routes</Checkbox>
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

          {/* Dynamic Pricing Tab */}
          {offersModalTab === "dynamicPricing" && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-600 mr-2">⚡</span>
                  <Title level={4} className="!mb-2">
                    Dynamic Pricing Configuration
                  </Title>
                </div>
                <Text className="text-gray-600 block mb-6">
                  Configure real-time fare integration and pricing multipliers
                </Text>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <Form.Item
                    name="enableDynamicPricing"
                    valuePropName="checked"
                    className="!mb-0"
                  >
                    <div className="flex items-center justify-between">
                      <Text className="font-medium">Enable Dynamic Pricing</Text>
                      <Switch />
                    </div>
                  </Form.Item>
                </div>

                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <span className="text-blue-600 mr-2">%</span>
                    <Text className="font-medium">
                      Discount & Promo Evaluation
                    </Text>
                  </div>
                  <Text className="text-gray-600 text-sm mb-4">
                    Configure applicable discounts and promotional codes for this
                    offer
                  </Text>

                  <div className="mb-4">
                    <Text className="font-medium text-sm mb-3">
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

                  <Row gutter={16} className="mb-4">
                    <Col span={8}>
                      <Form.Item
                        label="Loyalty Discount (%)"
                        name="loyaltyDiscount"
                        initialValue={0}
                      >
                        <InputNumber
                          className="w-full"
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
                          className="w-full"
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

          {/* Output Channels Tab */}
          {offersModalTab === "outputChannels" && (
            <div className="space-y-6">
              <div>
                <Title level={4} className="!mb-4">
                  Output Channels
                </Title>
                <Text className="text-gray-600 block mb-6">
                  Configure distribution channels for this offer
                </Text>

                <Row gutter={24}>
                  <Col span={12}>
                    <div className="bg-white border rounded-lg p-6 mb-6">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">🌐</span>
                        <Text className="font-medium text-lg">
                          Website Integration
                        </Text>
                      </div>
                      <Form.Item
                        name="enableWebsite"
                        valuePropName="checked"
                        className="mb-4"
                      >
                        <div className="flex items-center">
                          <Switch className="mr-3" />
                          <Text>Enable Website Distribution</Text>
                        </div>
                      </Form.Item>
                      <div>
                        <Text className="text-sm text-gray-600 mb-2">
                          Display Mode
                        </Text>
                        <Form.Item name="websiteDisplayMode" className="!mb-0">
                          <Select defaultValue="standard" className="w-full">
                            <Select.Option value="standard">
                              Standard
                            </Select.Option>
                            <Select.Option value="featured">
                              Featured
                            </Select.Option>
                            <Select.Option value="premium">Premium</Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </Col>

                  <Col span={12}>
                    <div className="bg-white border rounded-lg p-6 mb-6">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">📱</span>
                        <Text className="font-medium text-lg">
                          Mobile Application
                        </Text>
                      </div>
                      <Form.Item
                        name="enableMobile"
                        valuePropName="checked"
                        className="mb-4"
                      >
                        <div className="flex items-center">
                          <Switch className="mr-3" />
                          <Text>Enable Mobile Distribution</Text>
                        </div>
                      </Form.Item>
                      <Form.Item
                        name="mobileOptimized"
                        valuePropName="checked"
                        className="!mb-0"
                      >
                        <div className="flex items-center">
                          <Switch className="mr-3" />
                          <Text>Mobile Optimized Display</Text>
                        </div>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col span={12}>
                    <div className="bg-white border rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">⚡</span>
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
                          <Switch className="mr-3" />
                          <Text>Enable NDC Distribution</Text>
                        </div>
                      </Form.Item>
                    </div>
                  </Col>

                  <Col span={12}>
                    <div className="bg-white border rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">📊</span>
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
                          <Switch className="mr-3" />
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

        {/* Modal Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <Button onClick={handleCancel} size="large">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-600 hover:bg-blue-700"
            size="large"
          >
            Create Offer
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
