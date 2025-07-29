
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Space,
  Steps,
  Form,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BookingSteps from "@/components/booking/booking-steps";
import dayjs from "dayjs";
import AdminHeader from "./admin-header";
import AdminSidebar from "./admin-sidebar";

const { Title, Text } = Typography;

export default function ReviewConfirmation() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [flightData, setFlightData] = useState<any>(null);
  const [groupLeaderData, setGroupLeaderData] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [bundleData, setBundleData] = useState<any>(null);
  const [bookingSummary, setBookingSummary] = useState<any>(null);

  // Load all booking data from localStorage
  useEffect(() => {
    const storedBookingData = localStorage.getItem("bookingFormData");
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData));
    }

    const storedFlightData = localStorage.getItem("selectedFlightData");
    if (storedFlightData) {
      setFlightData(JSON.parse(storedFlightData));
    }

    const storedGroupLeaderData = localStorage.getItem("groupLeaderData");
    if (storedGroupLeaderData) {
      setGroupLeaderData(JSON.parse(storedGroupLeaderData));
    }

    const storedServices = localStorage.getItem("selectedServices");
    if (storedServices) {
      setSelectedServices(JSON.parse(storedServices));
    }

    const storedBundleData = localStorage.getItem("selectedBundleData");
    if (storedBundleData) {
      setBundleData(JSON.parse(storedBundleData));
    }

    const storedBookingSummary = localStorage.getItem("bookingSummary");
    if (storedBookingSummary) {
      setBookingSummary(JSON.parse(storedBookingSummary));
    }
  }, []);

  const handleBack = () => {
    // Save current review state before navigating back
    const reviewData = {
      bookingData,
      flightData,
      groupLeaderData,
      selectedServices,
      bundleData,
      bookingSummary,
    };
    localStorage.setItem("tempReviewData", JSON.stringify(reviewData));
    console.log("Saved review data before going back");
    navigate("/admin/passenger-info");
  };

  const handleConfirm = () => {
    setIsLoading(true);
    // Simulate processing
    setTimeout(() => {
      navigate("/admin/payment-options");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <AdminHeader />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar activeMenu="Booking Management" />

        <div className="flex-1 p-6">
          {/* Custom Header - matching Create Bid Configuration modal */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <CheckCircleOutlined className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <Title level={4} className="!mb-1 text-gray-800 font-bold">
                      Review & Confirm Booking
                    </Title>
                    <Text className="text-gray-600 text-sm">
                      Review your booking details and confirm to proceed with payment
                    </Text>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button type="text" className="text-gray-600">
                    Cancel
                  </Button>
                  <Text className="text-gray-600">Step 6 of 7</Text>
                </div>
              </div>
            </div>

            {/* Steps Navigation - matching Create Bid Configuration modal */}
            <div className="px-6 py-4">
              <Steps
                current={5}
                size="small"
                items={[
                  {
                    title: "Flight Details",
                    description: "Route & schedule",
                    icon: <GlobalOutlined />,
                  },
                  {
                    title: "Passenger Info",
                    description: "Group details",
                    icon: <UserOutlined />,
                  },
                  {
                    title: "Services",
                    description: "Add-ons & bundles",
                    icon: <CheckCircleOutlined />,
                  },
                  {
                    title: "Review",
                    description: "Confirm details",
                    icon: <CheckCircleOutlined />,
                  },
                  {
                    title: "Payment",
                    description: "Complete booking",
                    icon: <DollarOutlined />,
                  },
                ]}
              />
            </div>
          </div>

          {/* Booking Steps Component */}
          <div className="mb-6">
            <div className="overflow-x-auto">
              <BookingSteps
                currentStep={5}
                size="small"
                className="mb-6 min-w-[800px]"
              />
            </div>
          </div>

          {/* Main Content Container */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <Row gutter={24}>
              <Col xs={24} lg={16}>
                {/* Flight & Route Details Section */}
                <Card className="mb-6" size="small">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <GlobalOutlined className="text-blue-600 text-xs" />
                    </div>
                    <Title level={5} className="!mb-0 text-blue-800">
                      Flight & Route Details
                    </Title>
                  </div>

                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                      <div className="space-y-4">
                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">
                            Trip Type
                          </Text>
                          <Text className="text-gray-900 font-medium text-base">
                            {bookingData
                              ? bookingData.tripType === "oneWay"
                                ? "One-way"
                                : bookingData.tripType === "roundTrip"
                                  ? "Round-trip"
                                  : "Multi-city"
                              : "One-way"}
                          </Text>
                        </div>

                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">
                            Route
                          </Text>
                          <Text className="text-gray-900 font-medium text-base">
                            {bookingData
                              ? `${bookingData.origin} → ${bookingData.destination}`
                              : "Chennai → Delhi"}
                          </Text>
                        </div>

                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">
                            Departure Date
                          </Text>
                          <Text className="text-gray-900 font-medium text-base">
                            {bookingData?.departureDate
                              ? typeof bookingData.departureDate === "string"
                                ? dayjs(bookingData.departureDate).format(
                                    "DD MMM YYYY",
                                  )
                                : dayjs(bookingData.departureDate).format(
                                    "DD MMM YYYY",
                                  )
                              : "22 Jun 2024"}
                          </Text>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div className="space-y-4">
                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">
                            Cabin Class
                          </Text>
                          <Text className="text-gray-900 font-medium text-base">
                            {bookingData ? bookingData.cabin : "Economy"}
                          </Text>
                        </div>

                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">
                            Total Passengers
                          </Text>
                          <Text className="text-gray-900 font-medium text-base">
                            {bookingData
                              ? `${
                                  bookingData.totalPassengers ||
                                  bookingData.adults +
                                    bookingData.kids +
                                    bookingData.infants
                                } passengers`
                              : "1 passenger"}
                          </Text>
                        </div>

                        <div>
                          <Text className="text-gray-500 text-sm block mb-1">
                            Return Date
                          </Text>
                          <Text className="text-gray-900 font-medium text-base">
                            {bookingData?.returnDate &&
                            bookingData.tripType !== "oneWay"
                              ? typeof bookingData.returnDate === "string"
                                ? dayjs(bookingData.returnDate).format(
                                    "DD MMM YYYY",
                                  )
                                : dayjs(bookingData.returnDate).format(
                                    "DD MMM YYYY",
                                  )
                              : "N/A"}
                          </Text>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>

                {/* Services & Add-ons Section */}
                <Card className="mb-6" size="small">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleOutlined className="text-green-600 text-xs" />
                    </div>
                    <Title level={5} className="!mb-0 text-green-800">
                      Selected Services & Add-ons
                    </Title>
                  </div>

                  <div className="space-y-3">
                    {selectedServices.length > 0 ? (
                      selectedServices.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600">✓</span>
                            <Text className="text-gray-900 font-medium">{service.name}</Text>
                          </div>
                          <Text className="text-gray-600 font-medium">
                            $
                            {service.price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            per person
                          </Text>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 bg-gray-50 rounded-md">
                        <Text className="text-gray-500 italic">
                          No additional services selected
                        </Text>
                      </div>
                    )}

                    {/* Bundle services */}
                    {bundleData && (
                      <>
                        {bundleData.selectedSeat && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600">✓</span>
                              <Text className="text-gray-900 font-medium">
                                {bundleData.selectedSeat.name}
                              </Text>
                            </div>
                            <Text className="text-gray-600 font-medium">
                              ${bundleData.selectedSeat.price} per person
                            </Text>
                          </div>
                        )}
                        {bundleData.selectedBaggage && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600">✓</span>
                              <Text className="text-gray-900 font-medium">
                                {bundleData.selectedBaggage.name}
                              </Text>
                            </div>
                            <Text className="text-gray-600 font-medium">
                              ${bundleData.selectedBaggage.price} per person
                            </Text>
                          </div>
                        )}
                        {bundleData.selectedMeals &&
                          bundleData.selectedMeals.length > 0 &&
                          bundleData.selectedMeals.map((meal, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-green-600">✓</span>
                                <Text className="text-gray-900 font-medium">{meal.name}</Text>
                              </div>
                              <Text className="text-gray-600 font-medium">
                                ${meal.price} per person
                              </Text>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                </Card>

                {/* Group Leader Information */}
                <Card className="mb-6" size="small">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <UserOutlined className="text-purple-600 text-xs" />
                    </div>
                    <Title level={5} className="!mb-0 text-purple-800">
                      Group Leader Information
                    </Title>
                  </div>

                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                      <div>
                        <Text className="text-gray-500 text-sm block mb-1">
                          Full Name
                        </Text>
                        <Text className="text-gray-900 font-medium">
                          {groupLeaderData
                            ? `${groupLeaderData.firstName} ${groupLeaderData.lastName}`
                            : "Not provided"}
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <div>
                        <Text className="text-gray-500 text-sm block mb-1">
                          Email Address
                        </Text>
                        <Text className="text-gray-900 font-medium">
                          {groupLeaderData?.email || "Not provided"}
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <div>
                        <Text className="text-gray-500 text-sm block mb-1">
                          Phone Number
                        </Text>
                        <Text className="text-gray-900 font-medium">
                          {groupLeaderData?.phoneNumber || "Not provided"}
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Pricing Summary Sidebar */}
              <Col xs={24} lg={8}>
                <Card className="sticky top-6" size="small">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarOutlined className="text-green-600 text-xs" />
                    </div>
                    <Title level={5} className="!mb-0 text-green-800">
                      Pricing Summary
                    </Title>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Text className="text-gray-600">Base Flight Cost</Text>
                      <Text className="font-medium">
                        $
                        {flightData?.baseCost ||
                          (bookingSummary
                            ? bookingSummary.subtotal -
                              (bundleData?.bundleCost || 0) *
                                (bookingData?.totalPassengers || 1) -
                              selectedServices.reduce(
                                (total, service) =>
                                  total +
                                  service.price *
                                    (bookingData?.totalPassengers || 1),
                                0,
                              )
                            : "3,800")}
                      </Text>
                    </div>

                    {(selectedServices.length > 0 || bundleData?.bundleCost) && (
                      <div className="flex justify-between items-center">
                        <Text className="text-gray-600">Selected Services</Text>
                        <Text className="font-medium">
                          $
                          {((bundleData?.bundleCost || 0) +
                            selectedServices.reduce(
                              (total, service) => total + service.price,
                              0,
                            )) *
                            (bookingData?.totalPassengers || 1)}
                        </Text>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <Text className="text-gray-600">Taxes & Fees</Text>
                      <Text className="font-medium">
                        ${bookingSummary?.taxes.toFixed(2) || "304"}
                      </Text>
                    </div>

                    {bookingSummary?.groupDiscount > 0 && (
                      <div className="flex justify-between items-center">
                        <Text className="text-gray-600">
                          Group Discount (15%)
                        </Text>
                        <Text className="font-medium text-green-600">
                          -${bookingSummary.groupDiscount}
                        </Text>
                      </div>
                    )}

                    <Divider className="!my-3" />

                    <div className="flex justify-between items-center">
                      <Text className="text-lg font-semibold text-gray-900">
                        Total Amount
                      </Text>
                      <Text className="text-xl font-bold text-blue-600">
                        ${bookingSummary?.totalAmount || "4,104"}
                      </Text>
                    </div>

                    <Text className="text-gray-500 text-sm text-center">
                      For{" "}
                      {bookingData?.totalPassengers ||
                        (bookingData
                          ? bookingData.adults +
                            bookingData.kids +
                            bookingData.infants
                          : 1)}{" "}
                      passengers
                    </Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Navigation Footer - matching Create Bid Configuration modal */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800"
              size="large"
            >
              Previous
            </Button>

            <div className="flex space-x-3">
              <Button
                onClick={() => navigate("/admin/booking-details")}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                loading={isLoading}
                onClick={handleConfirm}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                Confirm & Continue to Payment
              </Button>
            </div>
          </div>
        </div>
      </div>

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

        .ant-steps-item-process .ant-steps-item-icon {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .ant-steps-item-finish .ant-steps-item-icon {
          background-color: #10b981;
          border-color: #10b981;
        }

        .ant-steps-item-wait .ant-steps-item-icon {
          background-color: #f3f4f6;
          border-color: #d1d5db;
        }
      `}</style>
    </div>
  );
}
