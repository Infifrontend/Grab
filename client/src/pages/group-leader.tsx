import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  Typography,
  message,
  Space,
  Divider,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BookingSteps from "@/components/booking/booking-steps";
import dayjs from "dayjs";
import BookingSummary from "@/components/booking-summary/booking-summary";

const { Title, Text } = Typography;
const { Option } = Select;

export default function GroupLeader() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  // Check if this is an admin booking
  const adminMode = JSON.parse(localStorage.getItem("adminLoggedIn") || "false");
  const userMode = JSON.parse(localStorage.getItem("userLoggedIn") || "false");
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [bundleData, setBundleData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Scroll to top on page load and fetch user info
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const storedBookingData = localStorage.getItem("bookingFormData");
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData));
    }

    const storedServices = localStorage.getItem("selectedServices");
    if (storedServices) {
      setSelectedServices(JSON.parse(storedServices));
    }

    const storedBundleData = localStorage.getItem("selectedBundleData");
    if (storedBundleData) {
      setBundleData(JSON.parse(storedBundleData));
    }

    // Fetch logged-in user information
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    
    if (isAuthenticated && userName) {
      // Parse the name to get first and last name
      const nameParts = userName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      setUserInfo({
        firstName,
        lastName,
        email: userEmail || "",
        fullName: userName
      });
    }
  }, []);

  // Load previously saved form data or user info if available
  useEffect(() => {
    const tempData = localStorage.getItem("tempGroupLeaderData");
    if (tempData) {
      try {
        const savedData = JSON.parse(tempData);
        // Merge saved data with user info, prioritizing user info for email
        const mergedData = {
          ...savedData,
          // Always use logged-in user's email if available
          email: userInfo?.email || savedData.email || "",
          // Fill in name fields if empty in saved data
          firstName: savedData.firstName || userInfo?.firstName || "",
          lastName: savedData.lastName || userInfo?.lastName || "",
        };
        form.setFieldsValue(mergedData);
      } catch (error) {
        console.warn("Could not restore group leader data:", error);
        // Fallback to user info if saved data is corrupted
        if (userInfo) {
          form.setFieldsValue({
            title: "mr",
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            phoneNumber: "",
          });
        }
      }
    } else if (userInfo) {
      // Auto-fill with logged-in user data if no saved data exists
      form.setFieldsValue({
        title: "mr",
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        phoneNumber: "",
      });
    }
  }, [form, userInfo]);

  const handleBack = () => {
    // Save current form data before navigating back (without validation)
    try {
      const currentValues = form.getFieldsValue();
      // Filter out empty values to avoid storing unnecessary data
      const filteredValues = Object.fromEntries(
        Object.entries(currentValues).filter(
          ([_, value]) => value !== undefined && value !== ""
        )
      );
      localStorage.setItem(
        "tempGroupLeaderData",
        JSON.stringify(filteredValues)
      );
      console.log("Saved group leader data:", filteredValues);
    } catch (error) {
      console.warn("Could not save group leader data:", error);
    }
    navigate(adminMode ? "/admin/add-services-bundles" : "/add-services-bundles");
  };

  const handleContinue = () => {
    form
      .validateFields()
      .then((values) => {
        handleSubmit(values);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  const handleSubmit = (values: any) => {
    try {
      console.log("Group leader data:", values);

      // Store group leader data in localStorage only
      localStorage.setItem("groupLeaderData", JSON.stringify(values));

      // Calculate and store total booking amount
      const bookingData = JSON.parse(
        localStorage.getItem("bookingFormData") || "{}"
      );
      const flightData = JSON.parse(
        localStorage.getItem("selectedFlightData") || "{}"
      );
      const bundleData = JSON.parse(
        localStorage.getItem("selectedBundleData") || "{}"
      );
      const servicesData = JSON.parse(
        localStorage.getItem("selectedServices") || "[]"
      );

      const passengerCount = bookingData.totalPassengers || 1;
      let totalAmount = 0;

      // Calculate flight cost
      if (flightData.baseCost) {
        totalAmount += flightData.baseCost;
      }

      // Calculate bundle cost
      if (bundleData.bundleCost) {
        totalAmount += bundleData.bundleCost * passengerCount;
      }

      // Calculate services cost
      const servicesCost = servicesData.reduce((total, service) => {
        return total + service.price * passengerCount;
      }, 0);
      totalAmount += servicesCost;

      // Add taxes (8%)
      const subtotal = totalAmount;
      const taxes = subtotal * 0.08;

      // Apply group discount for 10+ passengers
      const groupDiscount = passengerCount >= 10 ? subtotal * 0.15 : 0;

      const finalTotal = subtotal + taxes - groupDiscount;

      // Store booking summary
      const bookingSummary = {
        subtotal,
        taxes,
        groupDiscount,
        totalAmount: finalTotal,
        passengerCount,
        calculatedAt: new Date().toISOString(),
      };

      localStorage.setItem("bookingSummary", JSON.stringify(bookingSummary));

      message.success("Group leader information saved locally!");
      navigate(adminMode ? "/admin/payment-options" : "/payment-options");
    } catch (error) {
      console.error("Error processing group leader data:", error);
      message.error("Failed to process group leader information");
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Booking Steps */}
        <div className="mb-2">
          <div className="overflow-x-auto">
            <BookingSteps
              currentStep={3}
              size="small"
              className="mb-6 min-w-[800px]"
            />
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <Title level={2} className="!mb-2 text-gray-900">
            Group Leader Review
          </Title>
          <Text className="text-gray-600">
            Please provide the details of the group leader who will be the main
            contact for this booking and review the booking.
          </Text>
        </div>

        {/* Booking Summary */}
        <div className="mb-8">
          <BookingSummary showModifySearch={false} />
        </div>

        <Card className="mb-6">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              title: "mr",
              firstName: "",
              lastName: "",
              email: "",
              phoneNumber: "",
            }}
            requiredMark={false}
            className="group-leader-form"
          >
            {/* Personal Information */}
            <div>
              <Title level={4} className="!mb-6 text-gray-800">
                Personal Information
              </Title>

              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Please select title" }]}
                  >
                    <Select size="large" placeholder="Select title">
                      <Option value="mr">Mr.</Option>
                      <Option value="mrs">Mrs.</Option>
                      <Option value="ms">Ms.</Option>
                      <Option value="dr">Dr.</Option>
                      <Option value="prof">Prof.</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[
                      { required: true, message: "Please enter first name" },
                    ]}
                  >
                    <Input size="large" placeholder="Enter first name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[
                      { required: true, message: "Please enter last name" },
                    ]}
                  >
                    <Input size="large" placeholder="Enter last name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter email address" },
                      {
                        type: "email",
                        message: "Please enter valid email address",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Enter email address" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                      { required: true, message: "Please enter phone number" },
                    ]}
                  >
                    <Input size="large" placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </Card>

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
                        ? dayjs(bookingData.departureDate).format("DD MMM YYYY")
                        : dayjs(bookingData.departureDate).format("DD MMM YYYY")
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
                  <Text className="text-gray-500 text-sm block mb-2">
                    Return Date
                  </Text>
                  <Text className="text-gray-900 font-medium text-base">
                    {bookingData?.returnDate &&
                    bookingData.tripType !== "oneWay"
                      ? typeof bookingData.returnDate === "string"
                        ? dayjs(bookingData.returnDate).format("DD MMM YYYY")
                        : dayjs(bookingData.returnDate).format("DD MMM YYYY")
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
                        ${bundleData.selectedSeat.price} per person
                      </Text>
                    </div>
                  )}
                  {bundleData.selectedBaggage && (
                    <div className="flex items-center justify-between">
                      <Text className="text-gray-900">
                        {bundleData.selectedBaggage.name}
                      </Text>
                      <Text className="text-gray-600">
                        ${bundleData.selectedBaggage.price} per person
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
                          ${meal.price} per person
                        </Text>
                      </div>
                    ))}
                </>
              )}
            </Space>
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800"
          >
            Back
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={handleContinue}
            className="px-8"
          >
            Continue
          </Button>
        </div>
      </div>

      <style jsx>{`
        .group-leader-form :global(.ant-form-item-label > label) {
          font-weight: 600;
          color: #374151;
        }

        .group-leader-form
          :global(
            .ant-form-item-label
              > label.ant-form-item-required:not(
                .ant-form-item-required-mark-optional
              )::before
          ) {
          display: inline-block;
          margin-right: 4px;
          color: var(--infiniti-light-red);
          font-size: 14px;
          font-family: inherit;
          line-height: 1;
          content: "*";
        }
      `}</style>
    </>
  );
}
