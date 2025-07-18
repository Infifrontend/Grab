import { useState } from "react";
import {
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Radio,
  Typography,
  Row,
  Col,
  InputNumber,
} from "antd";
import { ArrowLeftOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import BookingSteps from "@/components/booking/booking-steps";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function NewBooking() {
  const [form] = Form.useForm();
  const [tripType, setTripType] = useState("roundTrip");
  const [, setLocation] = useLocation();

  const handleBackToHome = () => {
    setLocation("/");
  };

  const handleContinueToFlightSearch = () => {
    console.log("Continue to Flight Search");
    setLocation("/flight-search-bundle");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Multi-step Progress */}
        <div className="mb-8">
          <BookingSteps currentStep={0} size="small" className="mb-6" />
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <Title level={2} className="!mb-2 text-gray-900">
            New Group Booking
          </Title>
          <Text className="text-gray-600">
            Let's start by gathering some basic information about your trip.
          </Text>
        </div>

        {/* Trip Details Form */}
        <Card className="mb-6">
          <Title level={4} className="!mb-6 text-gray-800">
            Trip Details
          </Title>

          <Form form={form} layout="vertical" requiredMark={false}>
            {/* Trip Type */}
            <div className="mb-6">
              <Text className="block mb-3 text-gray-700 font-medium">
                Trip Type
              </Text>
              <Radio.Group
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="flex gap-8"
              >
                <Radio value="oneWay">One way</Radio>
                <Radio value="roundTrip">Round trip</Radio>
                <Radio value="multiCity">Multi city</Radio>
              </Radio.Group>
            </div>

            {/* Origin and Destination */}
            <Row gutter={24} className="mb-6">
              <Col xs={24} md={12}>
                <Form.Item
                  label="Origin *"
                  name="origin"
                  rules={[{ required: true, message: "Please enter origin" }]}
                >
                  <Input
                    size="large"
                    placeholder="City / Airport"
                    prefix={<EnvironmentOutlined className="text-gray-400" />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Destination *"
                  name="destination"
                  rules={[
                    { required: true, message: "Please enter destination" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="City / Airport"
                    prefix={<EnvironmentOutlined className="text-gray-400" />}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Dates */}
            <Row gutter={24} className="mb-6">
              <Col xs={24} md={12}>
                <Form.Item
                  label="Departure date *"
                  name="departureDate"
                  rules={[
                    { required: true, message: "Please select departure date" },
                  ]}
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    placeholder="DD MMM YYYY"
                    format="DD MMM YYYY"
                    disabledDate={(current) => current && current.isBefore(new Date(), 'day')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Return date *"
                  name="returnDate"
                  rules={
                    tripType !== "oneWay"
                      ? [
                          {
                            required: true,
                            message: "Please select return date",
                          },
                        ]
                      : []
                  }
                >
                  <DatePicker
                    size="large"
                    className="w-full"
                    placeholder="DD MMM YYYY"
                    format="DD MMM YYYY"
                    disabled={tripType === "oneWay"}
                    disabledDate={(current) => current && current.isBefore(new Date(), 'day')}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Passengers */}
            <div className="mb-6">
              <Text className="block mb-3 text-gray-700 font-medium">
                Passengers *
              </Text>
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="block mb-2 text-gray-600 text-sm">
                      Adults (12+ years)
                    </Text>
                    <Form.Item name="adults" initialValue={0}>
                      <InputNumber
                        size="large"
                        min={0}
                        className="w-full"
                        placeholder="0"
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="block mb-2 text-gray-600 text-sm">
                      Kids (2-11 years)
                    </Text>
                    <Form.Item name="kids" initialValue={0}>
                      <InputNumber
                        size="large"
                        min={0}
                        className="w-full"
                        placeholder="0"
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div>
                    <Text className="block mb-2 text-gray-600 text-sm">
                      Infants (0-2 years)
                    </Text>
                    <Form.Item name="infants" initialValue={0}>
                      <InputNumber
                        size="large"
                        min={0}
                        className="w-full"
                        placeholder="0"
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Cabin and Group Type */}
            <Row gutter={24} className="mb-6">
              <Col xs={24} md={12}>
                <Form.Item
                  label="Cabin *"
                  name="cabin"
                  initialValue="economy"
                  rules={[
                    { required: true, message: "Please select cabin class" },
                  ]}
                >
                  <Select size="large" placeholder="Select cabin class">
                    <Option value="economy">Economy</Option>
                    <Option value="business">Business</Option>
                    <Option value="first">First Class</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Group Type *"
                  name="groupType"
                  rules={[
                    { required: true, message: "Please select group type" },
                  ]}
                >
                  <Select size="large" placeholder="Select group type">
                    <Option value="corporate">Corporate</Option>
                    <Option value="leisure">Leisure</Option>
                    <Option value="educational">Educational</Option>
                    <Option value="religious">Religious</Option>
                    <Option value="sports">Sports</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Special Requests */}
            <Form.Item label="Special Requests" name="specialRequests">
              <TextArea
                rows={4}
                placeholder="Any special requirements or requests for your group..."
                className="resize-none"
              />
            </Form.Item>
          </Form>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToHome}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Home
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={handleContinueToFlightSearch}
            className="infiniti-btn-primary px-8"
          >
            Continue to Flight Search
          </Button>
        </div>
      </div>
    </div>
  );
}