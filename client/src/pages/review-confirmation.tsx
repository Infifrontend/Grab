import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import BookingSteps from "@/components/booking/booking-steps";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function ReviewConfirmation() {
  const [, setLocation] = useLocation();
  const [bookingData, setBookingData] = useState<any>(null);
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
      bookingSummary
    };
    localStorage.setItem("tempReviewData", JSON.stringify(reviewData));
    console.log("Saved review data before going back");
    setLocation("/passenger-info");
  };

  

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Booking Steps */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <BookingSteps
              currentStep={5}
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
            <Text className="text-gray-600">Step 6 of 7</Text>
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
                      <Text className="text-gray-500 text-sm block mb-2">
                        Route
                      </Text>
                      <Text className="text-gray-900 font-medium text-base">
                        {bookingData
                          ? `${bookingData.origin} → ${bookingData.destination}`
                          : "Chennai → Delhi"}
                      </Text>
                    </div>

                    <div>
                      <Text className="text-gray-500 text-sm block mb-2">
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
                  </Space>
                </Col>

                {/* Right Column */}
                <Col xs={24} md={12}>
                  <Space direction="vertical" size="large" className="w-full">
                    <div>
                      <Text className="text-gray-500 text-sm block mb-2">
                        Cabin Class
                      </Text>
                      <Text className="text-gray-900 font-medium text-base">
                        {bookingData ? bookingData.cabin : "Economy"}
                      </Text>
                    </div>

                    <div>
                      <Text className="text-gray-500 text-sm block mb-2">
                        Total Passengers
                      </Text>
                      <Text className="text-gray-900 font-medium text-base">
                        {bookingData
                          ? `${bookingData.totalPassengers || bookingData.adults + bookingData.kids + bookingData.infants} passengers`
                          : "1 passenger"}
                      </Text>
                    </div>

                    <div>
                      <Text className="text-gray-500 text-sm block mb-2">
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
                  {selectedServices.length > 0 ? (
                    selectedServices.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <Text className="text-gray-900">{service.name}</Text>
                        <Text className="text-gray-600">
                          ₹{service.price} per person
                        </Text>
                      </div>
                    ))
                  ) : (
                    <Text className="text-gray-500 italic">
                      No additional services selected
                    </Text>
                  )}

                  {/* Show bundle services if available */}
                  {bundleData && (
                    <>
                      {bundleData.selectedSeat && (
                        <div className="flex items-center justify-between">
                          <Text className="text-gray-900">
                            {bundleData.selectedSeat.name}
                          </Text>
                          <Text className="text-gray-600">
                            ₹{bundleData.selectedSeat.price} per person
                          </Text>
                        </div>
                      )}
                      {bundleData.selectedBaggage && (
                        <div className="flex items-center justify-between">
                          <Text className="text-gray-900">
                            {bundleData.selectedBaggage.name}
                          </Text>
                          <Text className="text-gray-600">
                            ₹{bundleData.selectedBaggage.price} per person
                          </Text>
                        </div>
                      )}
                      {bundleData.selectedMeals &&
                        bundleData.selectedMeals.length > 0 &&
                        bundleData.selectedMeals.map((meal, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <Text className="text-gray-900">{meal.name}</Text>
                            <Text className="text-gray-600">
                              ₹{meal.price} per person
                            </Text>
                          </div>
                        ))}
                    </>
                  )}
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
                <Col xs={24} md={12}>
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      {groupLeaderData?.groupType === "corporate"
                        ? "Company"
                        : "Organization"}
                    </Text>
                    <Text className="text-gray-900 font-medium">
                      {groupLeaderData?.companyName ||
                        groupLeaderData?.organizationName ||
                        "Not provided"}
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
                  <Text className="font-medium">
                    ₹
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
                      ₹
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
                    ₹{bookingSummary?.taxes || "304"}
                  </Text>
                </div>

                {bookingSummary?.groupDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <Text className="text-gray-600">Group Discount (15%)</Text>
                    <Text className="font-medium text-green-600">
                      -₹{bookingSummary.groupDiscount}
                    </Text>
                  </div>
                )}

                <Divider className="!my-3" />

                <div className="flex justify-between items-center">
                  <Text className="text-lg font-semibold text-gray-900">
                    Total Amount
                  </Text>
                  <Text className="text-xl font-bold text-blue-600">
                    ₹{bookingSummary?.totalAmount || "4,104"}
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
            onClick={() => setLocation("/payment-options")}
            className="px-8"
            style={{
              backgroundColor: "#2a0a22",
              borderColor: "#2a0a22",
            }}
          >
            Continue to Payment
          </Button>
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

        
      `}</style>
    </div>
  );
}
