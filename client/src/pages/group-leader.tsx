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
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/header";
import BookingSteps from "@/components/booking/booking-steps";

const { Title, Text } = Typography;
const { Option } = Select;

export default function GroupLeader() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Load previously saved form data if available
  useEffect(() => {
    const tempData = localStorage.getItem("tempGroupLeaderData");
    if (tempData) {
      try {
        const savedData = JSON.parse(tempData);
        form.setFieldsValue(savedData);
      } catch (error) {
        console.warn("Could not restore group leader data:", error);
      }
    }
  }, [form]);

  const handleBack = () => {
    // Save current form data before navigating back (without validation)
    try {
      const currentValues = form.getFieldsValue();
      // Filter out empty values to avoid storing unnecessary data
      const filteredValues = Object.fromEntries(
        Object.entries(currentValues).filter(
          ([_, value]) => value !== undefined && value !== "",
        ),
      );
      localStorage.setItem(
        "tempGroupLeaderData",
        JSON.stringify(filteredValues),
      );
      console.log("Saved group leader data:", filteredValues);
    } catch (error) {
      console.warn("Could not save group leader data:", error);
    }
    navigate("/add-services-bundles");
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
        localStorage.getItem("bookingFormData") || "{}",
      );
      const flightData = JSON.parse(
        localStorage.getItem("selectedFlightData") || "{}",
      );
      const bundleData = JSON.parse(
        localStorage.getItem("selectedBundleData") || "{}",
      );
      const servicesData = JSON.parse(
        localStorage.getItem("selectedServices") || "[]",
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
      navigate("/passenger-info");
    } catch (error) {
      console.error("Error processing group leader data:", error);
      message.error("Failed to process group leader information");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Booking Steps */}
        <div className="mb-8">
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
            Group Leader Information
          </Title>
          <Text className="text-gray-600">
            Please provide the details of the group leader who will be the main
            contact for this booking.
          </Text>
        </div>

        <Card className="mb-6">
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            className="group-leader-form"
          >
            {/* Personal Information */}
            <div className="mb-8">
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

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Date of Birth" name="dateOfBirth">
                    <DatePicker
                      size="large"
                      placeholder="DD MMM YYYY"
                      format="DD MMM YYYY"
                      className="w-full"
                      disabledDate={(current) =>
                        current && current.isAfter(new Date(), "day")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Nationality" name="nationality">
                    <Select
                      size="large"
                      placeholder="Select nationality"
                      showSearch
                    >
                      <Option value="us">United States</Option>
                      <Option value="uk">United Kingdom</Option>
                      <Option value="ca">Canada</Option>
                      <Option value="au">Australia</Option>
                      <Option value="de">Germany</Option>
                      <Option value="fr">France</Option>
                      <Option value="jp">Japan</Option>
                      <Option value="in">India</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Passport Information */}
            <div className="mb-8">
              <Title level={4} className="!mb-6 text-gray-800">
                Passport Information
              </Title>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Passport Number" name="passportNumber">
                    <Input size="large" placeholder="Enter passport number" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Passport Expiry Date"
                    name="passportExpiryDate"
                  >
                    <DatePicker
                      size="large"
                      placeholder="DD MMM YYYY"
                      format="DD MMM YYYY"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Address Information */}
            <div className="mb-8">
              <Title level={4} className="!mb-6 text-gray-800">
                Address Information
              </Title>

              <Row gutter={24}>
                <Col xs={24}>
                  <Form.Item label="Street Address" name="streetAddress">
                    <Input size="large" placeholder="Enter street address" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="City" name="city">
                    <Input size="large" placeholder="Enter city" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="State/Province" name="stateProvince">
                    <Input size="large" placeholder="Enter state/province" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Postal Code" name="postalCode">
                    <Input size="large" placeholder="Enter postal code" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Country" name="country">
                    <Select
                      size="large"
                      placeholder="Select country"
                      showSearch
                    >
                      <Option value="us">United States</Option>
                      <Option value="uk">United Kingdom</Option>
                      <Option value="ca">Canada</Option>
                      <Option value="au">Australia</Option>
                      <Option value="de">Germany</Option>
                      <Option value="fr">France</Option>
                      <Option value="jp">Japan</Option>
                      <Option value="in">India</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Emergency Contact */}
            <div className="mb-8">
              <Title level={4} className="!mb-6 text-gray-800">
                Emergency Contact
              </Title>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Contact Name" name="emergencyContactName">
                    <Input size="large" placeholder="Enter contact name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Contact Phone" name="emergencyContactPhone">
                    <Input size="large" placeholder="Enter contact phone" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24}>
                  <Form.Item
                    label="Relationship"
                    name="emergencyContactRelationship"
                  >
                    <Select size="large" placeholder="Select relationship">
                      <Option value="spouse">Spouse</Option>
                      <Option value="parent">Parent</Option>
                      <Option value="sibling">Sibling</Option>
                      <Option value="child">Child</Option>
                      <Option value="friend">Friend</Option>
                      <Option value="colleague">Colleague</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
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
    </div>
  );
}
