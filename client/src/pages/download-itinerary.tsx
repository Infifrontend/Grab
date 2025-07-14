
import React from "react";
import { Card, Button, Typography, Row, Col, Space, Divider } from "antd";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  MailOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useLocation, useRoute } from "wouter";
import Header from "@/components/layout/header";

const { Title, Text } = Typography;

export default function DownloadItinerary() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/download-itinerary/:id");

  const handleBackToBookingDetails = () => {
    setLocation(`/booking-details/${params?.id || "GR-2024-002"}`);
  };

  const handleDownloadPDF = () => {
    // Implementation for PDF download
    console.log("Downloading PDF...");
  };

  const handleEmailItinerary = () => {
    // Implementation for email itinerary
    console.log("Emailing itinerary...");
  };

  const handlePrintItinerary = () => {
    // Implementation for print itinerary
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <Title level={2} className="!mb-0 text-gray-900">
            Download Itinerary
          </Title>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToBookingDetails}
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            Back to Booking Details
          </Button>
        </div>

        <Row gutter={32}>
          {/* Left Column - Download Options */}
          <Col xs={24} lg={10}>
            <Card className="h-fit">
              <Title level={4} className="!mb-2 text-gray-800">
                Download Options
              </Title>
              <Text className="text-gray-600 block mb-6">
                Choose how you'd like to receive your itinerary
              </Text>

              <Space direction="vertical" className="w-full" size={16}>
                <Button
                  type="primary"
                  size="large"
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center justify-center h-12"
                  style={{
                    backgroundColor: "#2a0a22",
                    borderColor: "#2a0a22",
                  }}
                >
                  Download PDF
                </Button>

                <Button
                  size="large"
                  icon={<MailOutlined />}
                  onClick={handleEmailItinerary}
                  className="w-full flex items-center justify-center h-12 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800"
                >
                  Email Itinerary
                </Button>

                <Button
                  size="large"
                  icon={<PrinterOutlined />}
                  onClick={handlePrintItinerary}
                  className="w-full flex items-center justify-center h-12 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800"
                >
                  Print Itinerary
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Right Column - Itinerary Preview */}
          <Col xs={24} lg={14}>
            <Card>
              <Title level={4} className="!mb-2 text-gray-800">
                Itinerary Preview
              </Title>
              <Text className="text-gray-600 block mb-6">
                Preview of your travel itinerary
              </Text>

              <div className="space-y-4">
                {/* Booking Information */}
                <div>
                  <Text className="font-semibold text-gray-900 block text-lg">
                    Booking #GR-2024-1001
                  </Text>
                  <Text className="text-gray-600">
                    Group: ABC Corporation Annual Meeting
                  </Text>
                </div>

                <Divider className="my-4" />

                {/* Travel Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Text className="text-gray-600 font-medium">
                      Passengers:
                    </Text>
                    <Text className="text-gray-900 font-semibold">32</Text>
                  </div>

                  <div className="flex justify-between">
                    <Text className="text-gray-600 font-medium">Route:</Text>
                    <Text className="text-gray-900 font-semibold">
                      New York (JFK) → London (LHR)
                    </Text>
                  </div>

                  <div className="flex justify-between">
                    <Text className="text-gray-600 font-medium">
                      Departure:
                    </Text>
                    <Text className="text-gray-900 font-semibold">
                      June 15, 2024 at 10:30 AM
                    </Text>
                  </div>

                  <div className="flex justify-between">
                    <Text className="text-gray-600 font-medium">Return:</Text>
                    <Text className="text-gray-900 font-semibold">
                      June 22, 2024 at 12:45 PM
                    </Text>
                  </div>

                  <div className="flex justify-between">
                    <Text className="text-gray-600 font-medium">Airline:</Text>
                    <Text className="text-gray-900 font-semibold">
                      British Airways
                    </Text>
                  </div>

                  <div className="flex justify-between">
                    <Text className="text-gray-600 font-medium">Class:</Text>
                    <Text className="text-gray-900 font-semibold">Economy</Text>
                  </div>
                </div>

                <Divider className="my-4" />

                {/* Additional Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <Text className="text-gray-700 text-sm">
                    The full itinerary includes detailed flight information,
                    passenger lists, special requests, and contact information.
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <style jsx>{`
        .ant-card {
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .ant-btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .ant-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
        }

        .ant-divider {
          margin: 16px 0;
          border-color: #e5e7eb;
        }

        @media (max-width: 768px) {
          .ant-col {
            margin-bottom: 24px;
          }
        }
      `}</style>
    </div>
  );
}
