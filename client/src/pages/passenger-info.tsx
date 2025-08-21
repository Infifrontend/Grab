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
  Progress,
  Upload,
  message,
  Collapse,
} from "antd";
import {
  ArrowLeftOutlined,
  UploadOutlined,
  PlusOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import BookingSteps from "@/components/booking/booking-steps";
import BookingSummary from "@/components/booking-summary/booking-summary";
import { motion } from "framer-motion";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface PassengerInfo {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  specialRequests: string;
}

export default function PassengerInfo() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  // Check if this is an admin booking
  const adminMode = JSON.parse(localStorage.getItem("adminLoggedIn") || "false");
  const [totalPassengers, setTotalPassengers] = useState(32);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [bookingData, setBookingData] = useState<any>(null);
  const [bookingReference, setBookingReference] = useState("");

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setBookingReference(localStorage.getItem("bookingReference") || "");
  }, []);

  // Initialize passenger data from localStorage
  useEffect(() => {
    const storedBookingData = localStorage.getItem("bookingFormData");
    const searchCriteria = localStorage.getItem("searchCriteria");
    const storedPassengerCount = localStorage.getItem("passengerCount");

    if (storedBookingData || searchCriteria) {
      const data = JSON.parse(storedBookingData || "{}");
      const paxCount = JSON.parse(searchCriteria || "{}")?.passengers || "32";
      setBookingData(data);
      const count =
        data.totalPassengers || parseInt(storedPassengerCount || paxCount);
      setTotalPassengers(count);

      // Check for previously saved passenger data
      const tempPassengerData = localStorage.getItem("tempPassengerData");
      if (tempPassengerData) {
        try {
          const savedPassengers = JSON.parse(tempPassengerData);
          console.log("Restored passenger data:", savedPassengers);
          if (Array.isArray(savedPassengers) && savedPassengers.length > 0) {
            // Ensure we have the correct number of passengers
            const passengerArray = Array.from({ length: count }, (_, index) => {
              if (savedPassengers[index]) {
                return {
                  title: savedPassengers[index].title || "",
                  firstName: savedPassengers[index].firstName || "",
                  lastName: savedPassengers[index].lastName || "",
                  dateOfBirth: savedPassengers[index].dateOfBirth || "",
                  nationality: savedPassengers[index].nationality || "",
                  passportNumber: savedPassengers[index].passportNumber || "",
                  passportExpiry: savedPassengers[index].passportExpiry || "",
                  specialRequests: savedPassengers[index].specialRequests || "",
                };
              }
              return {
                title: "",
                firstName: "",
                lastName: "",
                dateOfBirth: "",
                nationality: "",
                passportNumber: "",
                passportExpiry: "",
                specialRequests: "",
              };
            });
            setPassengers(passengerArray);
          } else {
            // Initialize with empty passengers if no valid saved data
            setPassengers(
              Array.from({ length: count }, () => ({
                title: "",
                firstName: "",
                lastName: "",
                dateOfBirth: "",
                nationality: "",
                passportNumber: "",
                passportExpiry: "",
                specialRequests: "",
              }))
            );
          }
        } catch (error) {
          console.warn("Could not restore passenger data:", error);
          // Fallback to empty passengers
          setPassengers(
            Array.from({ length: count }, () => ({
              title: "",
              firstName: "",
              lastName: "",
              dateOfBirth: "",
              nationality: "",
              passportNumber: "",
              passportExpiry: "",
              specialRequests: "",
            }))
          );
        }
      } else {
        // Initialize passenger array based on actual passenger count
        setPassengers(
          Array.from({ length: count }, () => ({
            title: "",
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            nationality: "",
            passportNumber: "",
            passportExpiry: "",
            specialRequests: "",
          }))
        );
      }
    }
  }, []);

  const completedPassengers = passengers.filter(
    (p) =>
      p.title &&
      p.firstName &&
      p.lastName &&
      p.dateOfBirth &&
      p.nationality &&
      p.passportNumber &&
      p.passportExpiry
  ).length;

  const handleBack = () => {
    // Save current passenger data before navigating back
    const currentPassengerData = passengers.map((p) => ({
      title: p.title || "",
      firstName: p.firstName || "",
      lastName: p.lastName || "",
      dateOfBirth: p.dateOfBirth || "",
      nationality: p.nationality || "",
      passportNumber: p.passportNumber || "",
      passportExpiry: p.passportExpiry || "",
      specialRequests: p.specialRequests || "",
    }));
    localStorage.setItem(
      "tempPassengerData",
      JSON.stringify(currentPassengerData)
    );
    console.log("Saved passenger data:", currentPassengerData);
    navigate(adminMode ? "/admin/group-leader" : "/group-leader");
  };

  const handleContinue = async () => {
    try {
      console.log("Saving passenger information...");
      
      // Filter out passengers with at least first name or last name
      const validPassengers = passengers.filter(
        (p) => p.firstName.trim() || p.lastName.trim()
      );

      console.log(
        `Saving ${validPassengers.length} passengers:`,
        validPassengers
      );

      // Get booking reference from multiple sources
      let bookingId = bookingReference || 
                     localStorage.getItem("currentPNR") || 
                     localStorage.getItem("bookingReference");

      console.log("Available booking identifiers:", {
        bookingReference,
        currentPNR: localStorage.getItem("currentPNR"),
        storedBookingReference: localStorage.getItem("bookingReference")
      });

      // Validate that we have a booking identifier
      if (!bookingId) {
        throw new Error("No booking reference or PNR found. Please go back and ensure your booking was created successfully.");
      }

      console.log(`Using booking ID: ${bookingId}`);

      const passengersResponse = await fetch(
        `/api/booking-passengers/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            passengers: validPassengers,
          }),
        }
      );

      if (!passengersResponse.ok) {
        const errorData = await passengersResponse.json().catch(() => ({ message: "Unknown error" }));
        console.error("Passenger update failed:", errorData);
        console.error("Response status:", passengersResponse.status);
        
        if (passengersResponse.status === 404) {
          throw new Error(`Booking not found with ID: ${bookingId}. The booking may have expired or been cancelled.`);
        }
        
        throw new Error(errorData.message || "Failed to update passenger information");
      }

      const responseData = await passengersResponse.json();
      console.log("Passenger information saved successfully:", responseData);

      message.success("Passenger information saved successfully");

      // Clear temporary passenger data
      localStorage.removeItem("tempPassengerData");

      // Navigate to booking details
      navigate(adminMode ? `/admin/booking-details/${bookingId}` : `/booking-details/${bookingId}`);
      
    } catch (error) {
      console.error("Error saving changes:", error);
      message.error(`Failed to save changes. ${error.message}`);
    }
  };

  const handleAddPassenger = () => {
    setPassengers([
      ...passengers,
      {
        title: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        nationality: "",
        passportNumber: "",
        passportExpiry: "",
        specialRequests: "",
      },
    ]);
  };

  const handlePassengerChange = (
    index: number,
    field: keyof PassengerInfo,
    value: string
  ) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const handleBulkEntry = () => {
    message.info("Bulk entry feature coming soon");
  };

  const handleCSVUpload = (info: any) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <>
      <div className={`${adminMode ? "flex-1" : "max-w-7xl"} mx-auto p-6`}>
        {/* Booking Steps */}
        <div className="mb-2">
          <div className="overflow-x-auto">
            <BookingSteps
              currentStep={5}
              size="small"
              className="mb-6 min-w-[800px]"
            />
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Title level={2} className="!mb-2 text-gray-900">
                Passenger Information
              </Title>
              <Text className="text-gray-600">
                Please provide details for all passengers. You need{" "}
                {totalPassengers} passengers for this group booking.
              </Text>
            </div>
            <Button
              type="default"
              size="large"
              onClick={() => {
                // Skip passenger info and go directly to review confirmation
                localStorage.setItem("passengerData", JSON.stringify([]));
                // Get PNR from booking data or use the booking reference as fallback
                const pnr = localStorage.getItem("currentPNR") || bookingReference;
                navigate(adminMode ? `/admin/booking-details/${pnr}` : `/booking-details/${pnr}`);
              }}
              className="px-6 border-gray-300 text-gray-700 hover:border-gray-400"
            >
              Add Passenger Later
            </Button>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="mb-8">
          <BookingSummary showModifySearch={false} />
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <div className="mb-4">
            <Text className="text-blue-600 font-medium">
              Progress: {completedPassengers} of {totalPassengers} passengers
              added
            </Text>
          </div>
          <Progress
            percent={Math.round((completedPassengers / totalPassengers) * 100)}
            strokeColor="#2563eb"
            className="mb-4"
          />

          {/* Bulk Entry Options */}
          <div className="flex gap-4">
            <Button
              icon={<PlusOutlined />}
              onClick={handleBulkEntry}
              className="flex items-center"
            >
              Bulk Entry
            </Button>
            <Upload
              accept=".csv,.xlsx,.xls"
              showUploadList={false}
              onChange={handleCSVUpload}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />} className="flex items-center">
                Upload CSV
              </Button>
            </Upload>
          </div>
        </Card>

        {/* Passenger Forms */}
        <div className="space-y-6">
          {passengers.map((passenger, index) => {
            const collapseElement = (
              <Collapse
                key={`collapse-passenger-${index}`}
                size="large"
                expandIconPosition="end"
                expandIcon={({ isActive }) =>
                  isActive ? <UpOutlined /> : <DownOutlined />
                }
                className="custom-collapse"
                defaultActiveKey={['passenger1']}
                destroyInactivePanel
                items={[
                  {
                    key: `passenger${index + 1}`,
                    label: (<Title level={4} className="!mb-0 text-gray-800">
                      Passenger {index + 1}
                    </Title>
                    ),
                    children: (
                      <Form layout="vertical" className="passenger-form">
                        <Row gutter={24}>
                          {/* Title */}
                          <Col xs={24} md={8}>
                            <Form.Item label="Title" required>
                              <Select
                                size="large"
                                placeholder="Select"
                                value={passenger.title}
                                onChange={(value) =>
                                  handlePassengerChange(index, "title", value)
                                }
                              >
                                <Option value="mr">Mr.</Option>
                                <Option value="mrs">Mrs.</Option>
                                <Option value="ms">Ms.</Option>
                                <Option value="dr">Dr.</Option>
                                <Option value="prof">Prof.</Option>
                              </Select>
                            </Form.Item>
                          </Col>

                          {/* First Name */}
                          <Col xs={24} md={8}>
                            <Form.Item label="First Name" required>
                              <Input
                                size="large"
                                placeholder="First name"
                                value={passenger.firstName}
                                onChange={(e) =>
                                  handlePassengerChange(
                                    index,
                                    "firstName",
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>

                          {/* Last Name */}
                          <Col xs={24} md={8}>
                            <Form.Item label="Last Name" required>
                              <Input
                                size="large"
                                placeholder="Last name"
                                value={passenger.lastName}
                                onChange={(e) =>
                                  handlePassengerChange(
                                    index,
                                    "lastName",
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={24}>
                          {/* Date of Birth */}
                          <Col xs={24} md={12}>
                            <Form.Item label="Date of Birth" required>
                              <DatePicker
                                size="large"
                                placeholder="DD MMM YYYY"
                                format="DD MMM YYYY"
                                className="w-full"
                                value={
                                  passenger.dateOfBirth
                                    ? dayjs(passenger.dateOfBirth)
                                    : null
                                }
                                onChange={(date) =>
                                  handlePassengerChange(
                                    index,
                                    "dateOfBirth",
                                    date ? date.toISOString() : ""
                                  )
                                }
                                disabledDate={(current) =>
                                  current && current.isAfter(dayjs(), "day")
                                }
                              />
                            </Form.Item>
                          </Col>

                          {/* Nationality */}
                          <Col xs={24} md={12}>
                            <Form.Item label="Nationality" required>
                              <Select
                                size="large"
                                placeholder="Select nationality"
                                showSearch
                                value={passenger.nationality}
                                onChange={(value) =>
                                  handlePassengerChange(index, "nationality", value)
                                }
                              >
                                <Option value="us">United States</Option>
                                <Option value="uk">United Kingdom</Option>
                                <Option value="ca">Canada</Option>
                                <Option value="au">Australia</Option>
                                <Option value="de">Germany</Option>
                                <Option value="fr">France</Option>
                                <Option value="jp">Japan</Option>
                                <Option value="in">India</Option>
                                <Option value="br">Brazil</Option>
                                <Option value="mx">Mexico</Option>
                                <Option value="it">Italy</Option>
                                <Option value="es">Spain</Option>
                                <Option value="other">Other</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={24}>
                          {/* Passport Number */}
                          <Col xs={24} md={12}>
                            <Form.Item label="Passport Number" required>
                              <Input
                                size="large"
                                placeholder="Passport number"
                                value={passenger.passportNumber}
                                onChange={(e) =>
                                  handlePassengerChange(
                                    index,
                                    "passportNumber",
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>

                          {/* Passport Expiry */}
                          <Col xs={24} md={12}>
                            <Form.Item label="Passport Expiry" required>
                              <DatePicker
                                size="large"
                                placeholder="DD MMM YYYY"
                                format="DD MMM YYYY"
                                className="w-full"
                                value={
                                  passenger.passportExpiry
                                    ? dayjs(passenger.passportExpiry)
                                    : null
                                }
                                onChange={(date) =>
                                  handlePassengerChange(
                                    index,
                                    "passportExpiry",
                                    date ? date.toISOString() : ""
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        {/* Special Requests */}
                        <Row gutter={24}>
                          <Col xs={24}>
                            <Form.Item label="Special Requests">
                              <TextArea
                                rows={4}
                                placeholder="Any special dietary requirements, accessibility needs, etc."
                                value={passenger.specialRequests}
                                onChange={(e) =>
                                  handlePassengerChange(
                                    index,
                                    "specialRequests",
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>

                    ),
                  },
                ]}
              />
            )
            if (index === 0) {
              return collapseElement;
            }

            return (
              <motion.div
                key={`motion-collapse-${index}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {collapseElement}
              </motion.div>
            );
          })}
          {/* Add Another Passenger Button */}
          <div className="text-center">
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddPassenger}
              className="px-8"
              size="large"
            >
              Add Another Passenger
            </Button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
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
            Submit
          </Button>
        </div>
      </div>

      <style jsx>{`
        .passenger-form :global(.ant-form-item-label > label) {
          font-weight: 600;
          color: #374151;
        }

        .passenger-form :global(.ant-form-item-label > label::after) {
          content: "";
        }

        .passenger-form
          :global(.ant-form-item-label > label[title*="required"]) {
          color: #374151;
        }

        .passenger-form
          :global(.ant-form-item-label > label[title*="required"]::before) {
          display: inline-block;
          margin-right: 4px;
          color: var(--infiniti-light-red);
          font-size: 14px;
          font-family: inherit;
          line-height: 1;
          content: "*";
        }

        .passenger-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .passenger-card:hover {
          border-color: #d1d5db;
        }
      `}</style>
    </>
  );
}