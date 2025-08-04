import React, { useRef } from "react";
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Spin,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  MailOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function DownloadItinerary() {
  const navigate = useNavigate();
  // const [match, params] = useRoute("/download-itinerary/:id");
  const params = useParams();

  const printRef = useRef(null);

  // const bookingId = params?.id;
  const bookingId = params.id;

  // Fetch booking details from API
  const {
    data: bookingDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/booking-details", bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error("No booking ID provided");
      const response = await fetch(`/api/booking-details/${bookingId}`);
      if (!response.ok) throw new Error("Failed to fetch booking details");
      return response.json();
    },
    enabled: !!bookingId,
  });

  const handleBackToBookingDetails = () => {
    if (bookingId) {
      navigate(`/booking-details/${bookingId}`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleDownloadPDF = async () => {
    if (!bookingDetails) return;

    try {
      // Create a printable version of the content
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const { booking, passengers, flightData, comprehensiveData } =
        bookingDetails;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Travel Itinerary - ${booking.bookingReference}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #2a0a22; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { color: #2a0a22; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .booking-ref { font-size: 18px; color: #666; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 16px; font-weight: bold; color: #2a0a22; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .detail-label { font-weight: 600; color: #666; }
            .detail-value { color: #333; }
            .passenger-list { margin-top: 15px; }
            .passenger-item { background: #f9f9f9; padding: 10px; margin-bottom: 5px; border-radius: 4px; }
            .flight-info { background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Group Airline Booking</div>
            <div class="booking-ref">Travel Itinerary</div>
          </div>

          <div class="section">
            <div class="section-title">Booking Information</div>
            <div class="detail-row">
              <span class="detail-label">Booking Reference:</span>
              <span class="detail-value">${booking.bookingReference}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Booking Status:</span>
              <span class="detail-value">${booking.bookingStatus}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Passengers:</span>
              <span class="detail-value">${booking.passengerCount}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Amount:</span>
              <span class="detail-value">$${parseFloat(booking.totalAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Booking Date:</span>
              <span class="detail-value">${new Date(booking.bookedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
          </div>

          ${
            flightData
              ? `
          <div class="section">
            <div class="section-title">Flight Details</div>
            <div class="flight-info">
              <div class="detail-row">
                <span class="detail-label">Flight Number:</span>
                <span class="detail-value">${flightData.flightNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Airline:</span>
                <span class="detail-value">${flightData.airline}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Aircraft:</span>
                <span class="detail-value">${flightData.aircraft}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Route:</span>
                <span class="detail-value">${flightData.origin} → ${flightData.destination}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Departure:</span>
                <span class="detail-value">${new Date(flightData.departureTime).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} at ${new Date(flightData.departureTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Arrival:</span>
                <span class="detail-value">${new Date(flightData.arrivalTime).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} at ${new Date(flightData.arrivalTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${flightData.duration}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Class:</span>
                <span class="detail-value">${flightData.cabin}</span>
              </div>
            </div>
          </div>
          `
              : ""
          }

          ${
            passengers && passengers.length > 0
              ? `
          <div class="section">
            <div class="section-title">Passenger Details</div>
            <div class="passenger-list">
              ${passengers
                .map(
                  (passenger, index) => `
                <div class="passenger-item">
                  <div class="detail-row">
                    <span class="detail-label">Passenger ${index + 1}:</span>
                    <span class="detail-value">${passenger.title} ${passenger.firstName} ${passenger.lastName}</span>
                  </div>
                  ${
                    passenger.nationality
                      ? `
                  <div class="detail-row">
                    <span class="detail-label">Nationality:</span>
                    <span class="detail-value">${passenger.nationality}</span>
                  </div>
                  `
                      : ""
                  }
                  ${
                    passenger.dateOfBirth
                      ? `
                  <div class="detail-row">
                    <span class="detail-label">Date of Birth:</span>
                    <span class="detail-value">${new Date(passenger.dateOfBirth).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                  `
                      : ""
                  }
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
          `
              : ""
          }

          ${
            comprehensiveData?.groupLeaderInfo
              ? `
          <div class="section">
            <div class="section-title">Group Leader Information</div>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${comprehensiveData.groupLeaderInfo.name || comprehensiveData.groupLeaderInfo.firstName || "N/A"}</span>
            </div>
            ${
              comprehensiveData.groupLeaderInfo.email
                ? `
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${comprehensiveData.groupLeaderInfo.email}</span>
            </div>
            `
                : ""
            }
            ${
              comprehensiveData.groupLeaderInfo.phone ||
              comprehensiveData.groupLeaderInfo.phoneNumber
                ? `
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${comprehensiveData.groupLeaderInfo.phone || comprehensiveData.groupLeaderInfo.phoneNumber}</span>
            </div>
            `
                : ""
            }
          </div>
          `
              : ""
          }

          <div class="footer">
            <p>This is a computer-generated itinerary. Please contact us for any queries.</p>
            <p>Generated on: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} at ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then trigger print dialog which allows save as PDF
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleEmailItinerary = () => {
    if (!bookingDetails) return;

    const { booking, flightData } = bookingDetails;
    const subject = `Travel Itinerary - ${booking.bookingReference}`;
    const body = `Dear Traveler,

Please find your travel itinerary details below:

Booking Reference: ${booking.bookingReference}
${
  flightData
    ? `Flight: ${flightData.flightNumber} (${flightData.airline})
Route: ${flightData.origin} → ${flightData.destination}
Departure: ${new Date(flightData.departureTime).toLocaleString("en-IN")}`
    : ""
}
Passengers: ${booking.passengerCount}
Total Amount: ₹${parseFloat(booking.totalAmount).toLocaleString("en-IN")}

For detailed itinerary, please download the PDF version.

Best regards,
Group Airline Booking Team`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handlePrintItinerary = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-center items-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Alert
            message="Booking Not Found"
            description="The booking you're looking for could not be found."
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  const { booking, passengers, flightData, comprehensiveData } = bookingDetails;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6" ref={printRef}>
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
                    Booking #{booking.bookingReference}
                  </Text>
                  {comprehensiveData?.groupLeaderInfo && (
                    <Text className="text-gray-600">
                      Group Leader:{" "}
                      {comprehensiveData.groupLeaderInfo.name ||
                        comprehensiveData.groupLeaderInfo.firstName ||
                        "N/A"}
                    </Text>
                  )}
                </div>

                <Divider className="my-4" />

                {/* Travel Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Text className="text-gray-600 font-medium">
                      Passengers:
                    </Text>
                    <Text className="text-gray-900 font-semibold">
                      {booking.passengerCount}
                    </Text>
                  </div>

                  {flightData && (
                    <>
                      <div className="flex justify-between">
                        <Text className="text-gray-600 font-medium">
                          Route:
                        </Text>
                        <Text className="text-gray-900 font-semibold">
                          {flightData.origin} → {flightData.destination}
                        </Text>
                      </div>

                      <div className="flex justify-between">
                        <Text className="text-gray-600 font-medium">
                          Departure:
                        </Text>
                        <Text className="text-gray-900 font-semibold">
                          {new Date(
                            flightData.departureTime,
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(
                            flightData.departureTime,
                          ).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </div>

                      <div className="flex justify-between">
                        <Text className="text-gray-600 font-medium">
                          Arrival:
                        </Text>
                        <Text className="text-gray-900 font-semibold">
                          {new Date(flightData.arrivalTime).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}{" "}
                          at{" "}
                          {new Date(flightData.arrivalTime).toLocaleTimeString(
                            "en-GB",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </Text>
                      </div>

                      <div className="flex justify-between">
                        <Text className="text-gray-600 font-medium">
                          Airline:
                        </Text>
                        <Text className="text-gray-900 font-semibold">
                          {flightData.airline}
                        </Text>
                      </div>

                      <div className="flex justify-between">
                        <Text className="text-gray-600 font-medium">
                          Flight:
                        </Text>
                        <Text className="text-gray-900 font-semibold">
                          {flightData.flightNumber}
                        </Text>
                      </div>

                      <div className="flex justify-between">
                        <Text className="text-gray-600 font-medium">
                          Class:
                        </Text>
                        <Text className="text-gray-900 font-semibold">
                          {flightData.cabin}
                        </Text>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between">
                    <Text className="text-gray-600 font-medium">
                      Total Amount:
                    </Text>
                    <Text className="text-gray-900 font-semibold">
                      $
                      {parseFloat(booking.totalAmount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </Text>
                  </div>

                  <div className="flex justify-between">
                    <Text className="text-gray-600 font-medium">Status:</Text>
                    <Text
                      className={`font-semibold ${booking.bookingStatus === "confirmed" ? "text-green-600" : "text-orange-600"}`}
                    >
                      {booking.bookingStatus}
                    </Text>
                  </div>
                </div>

                <Divider className="my-4" />

                {/* Additional Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <Text className="text-gray-700 text-sm">
                    The full itinerary includes detailed flight information,
                    passenger lists, special requests, and contact information.
                    Use the download button above to get the complete PDF
                    version.
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
          border: 1px solid var(--ant-border-color);
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

        @media print {
          .ant-btn {
            display: none !important;
          }

          .ant-typography {
            color: #000 !important;
          }
        }
      `}</style>
    </div>
  );
}
