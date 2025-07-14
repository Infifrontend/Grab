import { useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Space,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import BookingSteps from "@/components/booking/booking-steps";

const { Title, Text } = Typography;

export default function ReviewConfirmation() {
  const [, setLocation] = useLocation();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const handleBack = () => {
    setLocation("/passenger-info");
  };

  const handleSubmit = () => {
    console.log("Submitting booking request...");
    // Here you would submit the booking request
    setIsSuccessModalVisible(true);
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalVisible(false);
    // Redirect to booking details page with a sample booking ID
    setLocation("/booking-details/GR-2024-002");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Booking Steps */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <BookingSteps
              currentStep={6}
              size="small"
              className="mb-6 min-w-[800px]"
            />
          </div>
        </div>

        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Title level={2} className="!mb-2 text-gray-900">
              Review & Confirm
            </Title>
            <Text className="text-gray-600">
              Review your booking details and confirm to submit your request.
            </Text>
          </div>
          <div className="flex items-center gap-4">
            <Button type="text" className="text-gray-600">
              Cancel
            </Button>
            <Text className="text-gray-600">Step 7 of 7</Text>
          </div>
        </div>

        <Row gutter={24}>
          <Col xs={24} lg={16}>
            {/* Review Your Booking Card */}
            <Card className="mb-6">
              <Title level={4} className="!mb-6 text-gray-800">
                Review Your Booking
              </Title>

              <Row gutter={[32, 32]}>
                {/* Left Column */}
                <Col xs={24} md={12}>
                  <Space direction="vertical" size="large" className="w-full">
                    <div>
                      <Text className="text-gray-500 text-sm block mb-2">
                        Trip Type
                      </Text>
                      <Text className="text-gray-900 font-medium text-base">
                        Round-trip
                      </Text>
                    </div>

                    <div>
                      <Text className="text-gray-500 text-sm block mb-2">
                        Route
                      </Text>
                      <Text className="text-gray-900 font-medium text-base">
                        New York (JFK) → London (LHR)
                      </Text>
                    </div>

                    <div>
                      <Text className="text-gray-500 text-sm block mb-2">
                        Departure Date
                      </Text>
                      <Text className="text-gray-900 font-medium text-base">
                        June 15, 2024
                      </Text>
                    </div>
                  </Space>
                </Col>

                {/* Right Column */}
                <Col xs={24} md={12}>
                  <Space direction="vertical" size="large" className="w-full">
                    <div>
                      <Text className="text-gray-500 text-sm block mb-2">
                        Group Type
                      </Text>
                      <Text className="text-gray-900 font-medium text-base">
                        Corporate
                      </Text>
                    </div>

                    <div>
                      <Text className="text-gray-500 text-sm block mb-2">
                        Total Passengers
                      </Text>
                      <Text className="text-gray-900 font-medium text-base">
                        32 passengers
                      </Text>
                    </div>

                    <div>
                      <Text className="text-gray-500 text-sm block mb-2">
                        Return Date
                      </Text>
                      <Text className="text-gray-900 font-medium text-base">
                        June 22, 2024
                      </Text>
                    </div>
                  </Space>
                </Col>
              </Row>

              <Divider />

              {/* Selected Services */}
              <div className="mb-4">
                <Text className="text-gray-500 text-sm block mb-3">
                  Selected Services
                </Text>
                <Space direction="vertical" size="small" className="w-full">
                  <div className="flex items-center justify-between">
                    <Text className="text-gray-900">Economy Plus Seats</Text>
                    <Text className="text-gray-600">$89 per person</Text>
                  </div>
                  <div className="flex items-center justify-between">
                    <Text className="text-gray-900">Premium Baggage</Text>
                    <Text className="text-gray-600">$125 per person</Text>
                  </div>
                  <div className="flex items-center justify-between">
                    <Text className="text-gray-900">Airport Transfers</Text>
                    <Text className="text-gray-600">$75 per person</Text>
                  </div>
                </Space>
              </div>
            </Card>

            {/* Group Leader Information */}
            <Card className="mb-6">
              <Title level={4} className="!mb-4 text-gray-800">
                Group Leader Information
              </Title>

              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Full Name
                    </Text>
                    <Text className="text-gray-900 font-medium">John Doe</Text>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Email Address
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      john.doe@company.com
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Phone Number
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      +1 (555) 123-4567
                    </Text>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      Company
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      ABC Corporation
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Summary Sidebar */}
          <Col xs={24} lg={8}>
            {/* Pricing Summary */}
            <Card className="mb-6">
              <Title level={4} className="!mb-4 text-gray-800">
                Pricing Summary
              </Title>

              <Space direction="vertical" size="middle" className="w-full">
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Base Flight Cost</Text>
                  <Text className="font-medium">₹38,400</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Selected Services</Text>
                  <Text className="font-medium">₹9,248</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Taxes & Fees</Text>
                  <Text className="font-medium">₹3,200</Text>
                </div>

                <Divider className="!my-3" />

                <div className="flex justify-between items-center">
                  <Text className="text-lg font-semibold text-gray-900">
                    Total Amount
                  </Text>
                  <Text className="text-xl font-bold text-blue-600">
                    ₹50,848
                  </Text>
                </div>

                <Text className="text-gray-500 text-sm text-center">
                  For 32 passengers
                </Text>
              </Space>
            </Card>

            {/* Next Steps */}
            <Card
              style={{ backgroundColor: "#f0f9ff", borderColor: "#bae6fd" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircleOutlined className="text-blue-600" />
                <Title level={4} className="!mb-0 text-gray-800">
                  Next Steps
                </Title>
              </div>

              <Space direction="vertical" size="middle" className="w-full">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-medium">1</span>
                  </div>
                  <Text className="text-blue-800">
                    We'll search for the best available flights for your group
                  </Text>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-medium">2</span>
                  </div>
                  <Text className="text-blue-800">
                    You'll receive a detailed quote within 24 hours
                  </Text>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-medium">3</span>
                  </div>
                  <Text className="text-blue-800">
                    Once approved, you can finalize passenger details and make
                    payment
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800"
            size="large"
          >
            Back
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            className="px-8"
            style={{
              backgroundColor: "#2a0a22",
              borderColor: "#2a0a22",
            }}
          >
            Submit Booking Request
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        open={isSuccessModalVisible}
        onCancel={handleSuccessModalClose}
        footer={null}
        width={480}
        centered
        closable={false}
        className="success-modal"
      >
        <div className="text-center p-6">
          {/* Close Button */}
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={handleSuccessModalClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            size="small"
          />

          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircleOutlined className="text-3xl text-green-600" />
            </div>
          </div>

          {/* Title */}
          <Title level={3} className="!mb-4 text-gray-900 font-semibold">
            Booking Request Submitted Successfully!
          </Title>

          {/* Description */}
          <Text className="text-gray-600 block mb-8 leading-relaxed">
            Your group booking request has been submitted. We'll review your
            request and get back to you within 24 hours with available options
            and pricing.
          </Text>

          {/* OK Button */}
          <Button
            type="primary"
            size="large"
            onClick={handleSuccessModalClose}
            className="px-8"
            style={{
              backgroundColor: "#2a0a22",
              borderColor: "#2a0a22",
              fontWeight: "500",
            }}
          >
            OK
          </Button>
        </div>
      </Modal>

      <style jsx>{`
        .ant-card {
          border-radius: 8px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .ant-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .ant-divider {
          margin: 16px 0;
        }

        :global(.success-modal .ant-modal-content) {
          border-radius: 12px;
          padding: 0;
        }

        :global(.success-modal .ant-modal-body) {
          padding: 0;
        }
      `}</style>
    </div>
  );
}
