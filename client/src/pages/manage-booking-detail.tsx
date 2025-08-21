import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tabs,
  Input,
  Button,
  InputNumber,
  Upload,
  message,
  DatePicker,
  Select,
  Badge,
  Divider,
  Spin,
  Alert,
  Modal,
  Form,
} from "antd";
import {
  DownloadOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "antd/es/form/Form";
const { Title, Text } = Typography;
const { Option } = Select;

export default function ManageBookingDetail() {
  // const [, params] = useRoute("/manage-booking/:id");
  const params = useParams();
  const navigate = useNavigate();

  // Check if this is an admin booking
  const adminMode = JSON.parse(
    localStorage.getItem("adminLoggedIn") || "false",
  );
  const [activeTab, setActiveTab] = useState("basic-info");
  const [paymentAmount, setPaymentAmount] = useState("4500.00");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [modal2Open, setModal2Open] = useState(false);
  const [groupSizeAction, setGroupSizeAction] = useState("");
  const [groupSizeForm] = useForm();
  const [newGroupSize, setNewGroupSize] = useState();
  // Get booking ID from URL params
  // const bookingId = params?.id;
  const bookingId = params.id;

  // State for update functionality
  const [updating, setUpdating] = useState(false);
  const [passengers, setPassengers] = useState([]);

  // Fetch booking details from API
  const {
    data: bookingDetails,
    isLoading,
    error,
    refetch,
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

  // Initialize passengers state with fetched data
  // const [passengers, setPassengers] = useState([
  //   { firstName: "", lastName: "" },
  // ]); // This state is now managed above

  // State for group leader information
  const [groupLeaderInfo, setGroupLeaderInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Update passengers when booking data is loaded
  React.useEffect(() => {
    if (bookingDetails?.passengers && bookingDetails.passengers.length > 0) {
      setPassengers(
        bookingDetails.passengers.map((p) => ({
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          title: p.title || "",
          nationality: p.nationality || "",
        })),
      );
    } else if (bookingDetails?.booking?.passengerCount) {
      // Create empty passenger slots based on passenger count
      const emptyPassengers = Array.from(
        { length: bookingDetails.booking.passengerCount },
        () => ({
          firstName: "",
          lastName: "",
          title: "",
          nationality: "",
        }),
      );
      setPassengers(emptyPassengers);
    }
    console.log(bookingDetails, "bookingDetails");
  }, [bookingDetails]);

  // Update group leader info when booking data is loaded
  React.useEffect(() => {
    if (bookingDetails?.comprehensiveData?.groupLeaderInfo) {
      const groupLeaderData = bookingDetails.comprehensiveData.groupLeaderInfo;
      setGroupLeaderInfo({
        name: groupLeaderData.name || groupLeaderData.firstName || "",
        email: groupLeaderData.email || "",
        phone: groupLeaderData.phone || groupLeaderData.phoneNumber || "",
      });
    } else if (bookingDetails?.booking) {
      // Set default empty values if no comprehensive data exists
      setGroupLeaderInfo({
        name: "",
        email: "",
        phone: "",
      });
    }
  }, [bookingDetails]);

  // Get group size from booking data
  const groupSize = bookingDetails?.booking?.passengerCount || 0;

  // Calculate confirmed passengers (those with both first and last names filled)
  const confirmedPassengersCount = passengers.filter(
    (p) => p.firstName && p.firstName.trim() && p.lastName && p.lastName.trim(),
  ).length;

  // Set current group size to match confirmed passengers count
  const [currentGroupSize, setCurrentGroupSize] = useState(
    confirmedPassengersCount,
  );

  const groupSizeFunction = (action: string) => {
    groupSizeForm.resetFields();
    setGroupSizeAction(action);
    setModal2Open(true);
  };

  const submitGroupSize = () => {
    setModal2Open(false);
    const finalGroupSizeRequest = groupSizeForm.getFieldsValue();
    finalGroupSizeRequest.sizeType = groupSizeAction;
    console.log(finalGroupSizeRequest, "finalGroupSizeRequest");
  };

  React.useEffect(() => {
    // Update current group size to match confirmed passengers count
    setCurrentGroupSize(confirmedPassengersCount);
  }, [confirmedPassengersCount]);

  // Handler for updating passenger details
  const handleUpdatePassenger = async () => {
    if (!bookingId) {
      message.error("No PNR provided");
      return;
    }

    setUpdating(true);
    try {
      console.log(`Updating passenger details for PNR: ${bookingId}`);

      // Filter out passengers with valid data (at least first or last name)
      const validPassengers = passengers.filter(
        (p) =>
          (p.firstName && p.firstName.trim()) ||
          (p.lastName && p.lastName.trim()),
      );

      console.log(
        `Saving ${validPassengers.length} passengers:`,
        validPassengers,
      );

      if (validPassengers.length === 0) {
        message.warning("Please enter at least one passenger's name");
        return;
      }

      // Save passenger information to database
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
        },
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

      // Refresh the booking details to reflect the changes
      console.log("Refetching booking details...");
      await refetch();
      console.log("Booking details refetched successfully");

    } catch (error) {
      console.error("Error updating passenger details:", error);
      message.error(`Failed to update passenger details: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !bookingDetails) {
    console.error("Booking error details:", error);

    // Parse error response if available
    let errorMessage = `The booking you're looking for could not be found. Booking ID: ${bookingId}. Please check the booking reference and try again.`;
    let debugInfo = null;

    if (error?.message) {
      try {
        const errorData = JSON.parse(error.message);
        if (errorData.availablePNRs || errorData.availableReferences) {
          debugInfo = errorData;
          errorMessage = `Booking "${bookingId}" not found. Available bookings: ${[...errorData.availablePNRs, ...errorData.availableReferences].join(", ")}`;
        }
      } catch (e) {
        // Error message is not JSON, use as is
        errorMessage = error.message || errorMessage;
      }
    }

    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Alert
          message="Booking Not Found"
          description={errorMessage}
          type="error"
          showIcon
        />
        {debugInfo && (
          <Card className="mt-4">
            <Title level={5}>Debug Information</Title>
            <Text>
              Available PNRs: {debugInfo.availablePNRs?.join(", ") || "None"}
            </Text>
            <br />
            <Text>
              Available References:{" "}
              {debugInfo.availableReferences?.join(", ") || "None"}
            </Text>
          </Card>
        )}
        <div className="mt-4">
          <Button
            onClick={() =>
              navigate(adminMode ? "/admin/manage-booking" : "/manage-booking")
            }
            type="primary"
          >
            Back to Manage Booking
          </Button>
        </div>
      </div>
    );
  }

  const {
    booking,
    // passengers: fetchedPassengers, // This is now managed by setPassengers
    flightData,
    comprehensiveData,
  } = bookingDetails;

  // Parse comprehensive data for detailed information
  const groupLeaderData = comprehensiveData?.groupLeaderInfo;
  const selectedServices = comprehensiveData?.selectedServices || [];

  const handleAddPassenger = () => {
    setPassengers([...passengers, { firstName: "", lastName: "", title: "", nationality: "" }]);
  };

  const handlePassengerChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleCancelChanges = () => {
    message.info("Changes cancelled");
    navigate(adminMode ? "/admin/manage-booking" : "/manage-booking");
  };

  const handleSaveChanges = async () => {
    try {
      console.log("Starting to save changes for booking:", bookingId);

      if (!bookingId) {
        console.error("No booking ID available");
        message.error("No booking ID found. Please try again.");
        return;
      }

      // Save group leader information
      console.log("Saving group leader information...");
      console.log("Group leader data:", groupLeaderInfo);

      const groupLeaderResponse = await fetch(
        `/api/booking-details/${bookingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            groupLeaderName: groupLeaderInfo.name || "",
            groupLeaderEmail: groupLeaderInfo.email || "",
            groupLeaderPhone: groupLeaderInfo.phone || "",
          }),
        },
      );

      let groupLeaderResult;
      try {
        groupLeaderResult = await groupLeaderResponse.json();
      } catch (parseError) {
        const textResult = await groupLeaderResponse.text();
        console.error("Failed to parse group leader response:", textResult);
        throw new Error(
          "Invalid response from server when updating group leader",
        );
      }

      if (!groupLeaderResponse.ok) {
        console.error("Group leader update failed:", groupLeaderResult);
        throw new Error(
          groupLeaderResult.message ||
            "Failed to update group leader information",
        );
      }

      console.log("Group leader information saved successfully");

      // Save passenger information
      console.log("Saving passenger information...");
      const validPassengers = passengers.filter(
        (p) =>
          (p.firstName && p.firstName.trim()) ||
          (p.lastName && p.lastName.trim()),
      );

      console.log(
        `Saving ${validPassengers.length} passengers:`,
        validPassengers,
      );

      if (validPassengers.length > 0) {
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
          },
        );

        let passengersResult;
        try {
          passengersResult = await passengersResponse.json();
        } catch (parseError) {
          const textResult = await passengersResponse.text();
          console.error("Failed to parse passengers response:", textResult);
          throw new Error(
            "Invalid response from server when updating passengers",
          );
        }

        if (!passengersResponse.ok) {
          console.error("Passenger update failed:", passengersResult);
          throw new Error(
            passengersResult.message ||
              "Failed to update passenger information",
          );
        }

        console.log("Passenger information saved successfully");
      } else {
        console.log("No valid passengers to save");
      }

      message.success("Changes saved successfully");

      // Refresh the booking details to reflect the changes
      console.log("Refetching booking details...");
      await refetch();
      console.log("Booking details refetched successfully");
    } catch (error) {
      console.error("Error saving changes:", error);

      let errorMessage = "Failed to save changes. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("Booking not found")) {
          errorMessage =
            "Booking not found. Please check the booking reference.";
        } else if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      message.error(errorMessage);
    }
  };

  const handleMakePayment = () => {
    message.success("Payment processed successfully");
  };

  const handleSetupPaymentPlan = () => {
    message.info("Payment plan setup initiated");
  };

  const handleDownloadCSVTemplate = () => {
    // Create CSV header with the required fields
    let csvContent =
      "First Name,Last Name,Date of Birth,Passport Number,Nationality,Gender,Special Requirements\n";

    // Add current passenger data if available
    if (passengers && passengers.length > 0) {
      passengers.forEach((passenger, index) => {
        const firstName = passenger.firstName || `Passenger${index + 1}`;
        const lastName = passenger.lastName || "";
        const dateOfBirth = passenger.dateOfBirth || "";
        const passportNumber = passenger.passportNumber || "";
        const nationality = passenger.nationality || "";
        const gender = passenger.gender || "";
        const specialRequirements =
          passenger.specialRequirements || passenger.specialRequests || "";

        csvContent += `${firstName},${lastName},${dateOfBirth},${passportNumber},${nationality},${gender},"${specialRequirements}"\n`;
      });
    } else {
      // Add template rows with sample data for all required fields
      csvContent += `John,Smith,1985-06-15,A12345678,US,Male,Vegetarian meal
Jane,Doe,1990-03-22,B87654321,US,Female,Wheelchair assistance
Mike,Johnson,1978-11-08,C11223344,US,Male,None
Sarah,Williams,1992-07-30,D55667788,US,Female,Kosher meal
David,Brown,1983-12-05,E99887766,US,Male,Extra legroom`;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `passenger_list_${bookingId || "template"}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success("Passenger list downloaded successfully");
  };

  const tabItems = [
    {
      key: "basic-info",
      label: "Basic Info",
    },
    {
      key: "services",
      label: "Services",
    },
    {
      key: "changes",
      label: "Changes",
    },
    {
      key: "payment",
      label: "Payment",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <Title level={2} className="!mb-0 text-gray-900">
          Manage Booking
        </Title>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="mb-6"
      />

      {/* Basic Info Tab */}
      {activeTab === "basic-info" && (
        <Row gutter={[24, 24]}>
          {/* Booking Information */}
          <Col xs={24} lg={12}>
            <Card>
              <div classNant-modal-headerame="mb-6">
                <Title level={4} className="!mb-2 text-gray-900">
                  Booking Information
                </Title>
                <Text className="text-gray-600">
                  Update basic booking details
                </Text>
              </div>

              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Booking ID
                  </Text>
                  <Input
                    value={
                      booking.bookingReference || booking.bookingId || bookingId
                    }
                    disabled
                    className="w-full"
                  />
                </div>

                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Group Leader Name
                  </Text>
                  <Input
                    placeholder="Enter group leader name"
                    value={groupLeaderInfo.name}
                    onChange={(e) =>
                      setGroupLeaderInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Group Leader Contact Email
                  </Text>
                  <Input
                    type="email"
                    placeholder="Enter group leader contact email"
                    value={groupLeaderInfo.email}
                    onChange={(e) =>
                      setGroupLeaderInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Group Leader Contact Phone
                  </Text>
                  <Input
                    placeholder="Enter group leader contact phone"
                    value={groupLeaderInfo.phone}
                    onChange={(e) =>
                      setGroupLeaderInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </Space>
            </Card>
          </Col>

          {/* Group Size Management */}
          <Col xs={24} lg={12}>
            <Card>
              <div className="mb-6">
                <Title level={4} className="!mb-2 text-gray-900">
                  Group Size Management
                </Title>
                <Text className="text-gray-600">
                  Adjust the number of passengers in your group
                </Text>
              </div>

              <Space direction="vertical" size="large" className="w-full">
                {/* Current Group Size */}
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Current Group Size
                  </Text>
                  <Text className="text-gray-600 text-sm block mb-2">
                    Confirmed passengers with names filled
                  </Text>
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <Text className="text-green-700 font-semibold text-lg">
                      {confirmedPassengersCount} confirmed Passengers
                    </Text>
                  </div>
                </div>

                {/* Adjust Group Size */}
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Adjust Group Size
                  </Text>
                  {/* <Text className="text-gray-600 text-sm block mb-3">
                    Add or remove passengers
                  </Text> */}
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => groupSizeFunction("upsize")}
                      className="border border-green-200 h-10 w-full text-green-600 flex items-center justify-center hover:!bg-green-50 hover:!text-green-600 hover:!border-green-200"
                    >
                      <RiseOutlined />
                      Upsize
                    </Button>
                    {/* <InputNumber
                      value={currentGroupSize}
                      onChange={(value) => setCurrentGroupSize(value || 0)}
                      min={0}
                      className="text-center"
                      style={{ width: "80px" }}
                    /> */}
                    <Button
                      onClick={() => groupSizeFunction("downsize")}
                      className="50 border border-red-200 w-full text-red-600 h-10 flex items-center justify-center hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200"
                    >
                      <FallOutlined />
                      Downsize
                    </Button>
                  </div>
                </div>

                {/* Passenger Information Management */}
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Passenger Information Management
                  </Text>
                  <Text className="text-gray-600 text-sm block mb-3">
                    Upload passenger details via CSV file or enter manually
                  </Text>

                  <div className="mb-4">
                    <Button
                      icon={<DownloadOutlined />}
                      className="mb-3"
                      onClick={handleDownloadCSVTemplate}
                    >
                      Download CSV Template
                    </Button>
                    <Text className="text-gray-500 text-sm block mb-2">
                      Download template with required passenger information
                      format
                    </Text>

                    <div className="flex items-center gap-3">
                      <Upload
                        accept=".csv,.xlsx,.xls"
                        showUploadList={false}
                        beforeUpload={() => false}
                      >
                        <Button>Choose file</Button>
                      </Upload>
                      <Text className="text-gray-500 text-sm">
                        No file chosen
                      </Text>
                      <Button type="primary" size="small">
                        Browse
                      </Button>
                    </div>
                    <Text className="text-gray-500 text-xs block mt-1">
                      Supported formats: CSV, Excel (.xlsx, .xls)
                    </Text>
                  </div>

                  {/* Manual Entry */}
                  <div>
                    <Text className="block mb-3 text-gray-700 font-medium">
                      Manual Entry
                    </Text>
                    <Text className="text-gray-600 text-sm block mb-3">
                      Add or update passenger names manually
                    </Text>

                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {passengers.map((passenger, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex gap-3">
                            <Input
                              placeholder={`Passenger ${index + 1} - First Name`}
                              value={passenger.firstName}
                              onChange={(e) =>
                                handlePassengerChange(
                                  index,
                                  "firstName",
                                  e.target.value,
                                )
                              }
                              className="flex-1"
                            />
                            <Input
                              placeholder={`Passenger ${index + 1} - Last Name`}
                              value={passenger.lastName}
                              onChange={(e) =>
                                handlePassengerChange(
                                  index,
                                  "lastName",
                                  e.target.value,
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                          <div className="flex gap-3">
                            <Select
                              placeholder="Title"
                              value={passenger.title}
                              onChange={(value) =>
                                handlePassengerChange(index, "title", value)
                              }
                              className="w-24"
                            >
                              <Option value="Mr">Mr.</Option>
                              <Option value="Mrs">Mrs.</Option>
                              <Option value="Ms">Ms.</Option>
                              <Option value="Dr">Dr.</Option>
                            </Select>
                            <Input
                              placeholder="Nationality"
                              value={passenger.nationality}
                              onChange={(e) =>
                                handlePassengerChange(
                                  index,
                                  "nationality",
                                  e.target.value,
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={handleAddPassenger}
                      className="w-full mt-3"
                    >
                      Add More Passengers
                    </Button>

                    {/* Update Passenger Button */}
                    <Button
                      type="primary"
                      loading={updating}
                      onClick={handleUpdatePassenger}
                      className="w-full mt-3"
                    >
                      Update Passenger Details
                    </Button>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {/* Services Tab */}
      {activeTab === "services" && (
        <div className="space-y-6">
          {/* Special Bundles */}
          <Card>
            <div className="mb-6">
              <Title level={4} className="!mb-2 text-gray-900">
                Special Bundles
              </Title>
              <Text className="text-gray-600">
                Add flexible booking and payment options
              </Text>
            </div>

            <div className="space-y-4">
              {/* FlexPay Plus */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Title level={5} className="!mb-1">
                      FlexPay Plus
                    </Title>
                    <Text className="text-gray-600 block mb-2">
                      Pay your way with flexible payment options
                    </Text>
                    <Text className="text-xl font-bold text-gray-900 block mb-2">
                      ₹29
                    </Text>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Pay 50% now, 50% later</li>
                      <li>• No interest charges</li>
                      <li>• Automatic payment reminders</li>
                    </ul>
                  </div>
                  <Button type="primary">Add Bundle</Button>
                </div>
              </div>

              {/* Schedule Shield */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Title level={5} className="!mb-1">
                      Schedule Shield
                    </Title>
                    <Text className="text-gray-600 block mb-2">
                      Change your travel dates with confidence
                    </Text>
                    <Text className="text-xl font-bold text-gray-900 block mb-2">
                      ₹45
                    </Text>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• One free date change per booking</li>
                      <li>• Waived change fees</li>
                    </ul>
                  </div>
                  <Button type="primary">Add Bundle</Button>
                </div>
              </div>

              {/* Worry-Free Cancellation */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Title level={5} className="!mb-1">
                      Worry-Free Cancellation
                    </Title>
                    <Text className="text-gray-600 block mb-2">
                      Get refund protection for unexpected changes
                    </Text>
                    <Text className="text-xl font-bold text-gray-900 block mb-2">
                      ₹65
                    </Text>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 100% refund if cancelled 48+ hours before</li>
                      <li>• No questions asked policy</li>
                    </ul>
                  </div>
                  <Button type="primary">Add Bundle</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Current Services & Bundles */}
          <Card>
            <div className="mb-6">
              <Title level={4} className="!mb-2 text-gray-900">
                Current Services & Bundles
              </Title>
              <Text className="text-gray-600">
                Manage your existing ancillary services
              </Text>
            </div>

            <div className="space-y-4">
              {/* Comfort Plus Bundle */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Title level={5} className="!mb-1">
                      Comfort Plus Bundle
                    </Title>
                    <Text className="text-gray-600 block mb-2">
                      Enhanced comfort for your journey
                    </Text>
                    <Text className="text-xl font-bold text-gray-900 block mb-2">
                      ₹89
                    </Text>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Priority boarding</li>
                      <li>• Extra legroom seat</li>
                      <li>• Premium meal</li>
                      <li>• Expedited checked bag</li>
                    </ul>
                  </div>
                  <Button danger icon={<DeleteOutlined />}>
                    Remove
                  </Button>
                </div>
              </div>

              {/* Extra Checked Bag */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Title level={5} className="!mb-1">
                      Extra Checked Bag
                    </Title>
                    <Text className="text-gray-600 block mb-2">
                      Additional 23kg checked baggage
                    </Text>
                    <Text className="text-xl font-bold text-gray-900 block mb-2">
                      ₹45
                    </Text>
                    <Text className="text-sm text-gray-600">Quantity: 2</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button icon={<MinusOutlined />} size="small"></Button>
                    <span className="mx-2">2</span>
                    <Button icon={<PlusOutlined />} size="small"></Button>
                    <Button danger icon={<DeleteOutlined />} className="ml-2">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Add More Services */}
          <Card>
            <div className="mb-6">
              <Title level={4} className="!mb-2 text-gray-900">
                Add More Services
              </Title>
              <Text className="text-gray-600">
                Enhance your journey with additional services
              </Text>
            </div>

            <div className="space-y-4">
              {/* Business Essentials */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Title level={5} className="!mb-1">
                      Business Essentials
                    </Title>
                    <Text className="text-gray-600 block mb-2">
                      Everything you need for business travel
                    </Text>
                    <Text className="text-xl font-bold text-gray-900 block mb-2">
                      ₹149
                    </Text>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Lounge access</li>
                      <li>• Fast track security</li>
                      <li>• Premium seat selection</li>
                      <li>• Wi-Fi access</li>
                    </ul>
                  </div>
                  <Button type="primary">Add Service</Button>
                </div>
              </div>

              {/* Premium Meal */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Title level={5} className="!mb-1">
                      Premium Meal
                    </Title>
                    <Text className="text-gray-600 block mb-2">
                      Upgrade to premium dining experience
                    </Text>
                    <Text className="text-xl font-bold text-gray-900 block mb-2">
                      ₹35
                    </Text>
                  </div>
                  <Button type="primary">Add Service</Button>
                </div>
              </div>

              {/* Airport Lounge Access */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Title level={5} className="!mb-1">
                      Airport Lounge Access
                    </Title>
                    <Text className="text-gray-600 block mb-2">
                      Access to premium airport lounges
                    </Text>
                    <Text className="text-xl font-bold text-gray-900 block mb-2">
                      ₹55
                    </Text>
                  </div>
                  <Button type="primary">Add Service</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Changes Tab */}
      {activeTab === "changes" && (
        <Card>
          <div className="mb-6">
            <Title level={4} className="!mb-2 text-gray-900">
              Flight Modifications
            </Title>
            <Text className="text-gray-600">
              Request changes to your flight details
            </Text>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <Text className="text-blue-700">
              <strong>Note:</strong> Date changes are subject to availability
              and may incur additional fees. We'll check availability and
              provide you with options.
            </Text>
          </div>

          <Row gutter={[24, 24]} className="mt-8">
            <Col xs={24} md={6} xl={8}>
              <div>
                <Text className="block mb-2 text-gray-700 font-medium">
                  Departure Date
                </Text>
                <DatePicker
                  defaultValue={dayjs("15/06/2024", "DD/MM/YYYY")}
                  format="DD/MM/YYYY"
                  className="w-full"
                  placeholder="15/06/2024"
                />
              </div>
            </Col>
            <Col xs={24} md={6} xl={8}>
              <div>
                <Text className="block mb-2 text-gray-700 font-medium">
                  Return Date
                </Text>
                <DatePicker
                  defaultValue={dayjs("22/06/2024", "DD/MM/YYYY")}
                  format="DD/MM/YYYY"
                  className="w-full"
                  placeholder="22/06/2024"
                />
              </div>
            </Col>
            <Col xs={24} md={6} xl={8} className="flex gap-3 mt-6">
              <Button size="large" onClick={handleCancelChanges}>
                Cancel Changes
              </Button>
              <Button
                type="primary"
                size="large"
                className="infiniti-btn-primary"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </Col>
          </Row>
        </Card>
      )}

      {/* Payment Tab */}
      {activeTab === "payment" && (
        <div className="space-y-6">
          {/* Payment Status */}
          <Card>
            <div className="mb-6">
              <Title level={4} className="!mb-2 text-gray-900">
                Payment Status
              </Title>
              <Text className="text-gray-600">
                Current payment status and transaction history
              </Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col xs={24} md={8}>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <Text className="text-blue-600 font-medium block mb-1">
                    Total Booking Amount
                  </Text>
                  <Text className="text-2xl font-bold text-blue-600">
                    ₹{parseFloat(booking.totalAmount || "0").toLocaleString()}
                  </Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Text className="text-green-600 font-medium block mb-1">
                    Amount Paid
                  </Text>
                  <Text className="text-2xl font-bold text-green-600">
                    ₹
                    {(
                      parseFloat(booking.totalAmount || "0") *
                      (booking.paymentStatus === "completed" ? 1 : 0.5)
                    ).toLocaleString()}
                  </Text>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <Text className="text-orange-600 font-medium block mb-1">
                    Remaining Balance
                  </Text>
                  <Text className="text-2xl font-bold text-orange-600">
                    ₹
                    {(
                      parseFloat(booking.totalAmount || "0") *
                      (booking.paymentStatus === "completed" ? 0 : 0.5)
                    ).toLocaleString()}
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Payment History */}
          <Card>
            <div className="mb-6">
              <Title level={4} className="!mb-2 text-gray-900">
                Payment History
              </Title>
              <Text className="text-gray-600">
                All payments made for this booking
              </Text>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <Text className="font-semibold text-gray-900 block">
                        ₹2,500.00
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        May 15, 2024
                      </Text>
                    </div>
                    <div>
                      <Text className="text-gray-900">Credit Card</Text>
                      <Text className="text-gray-600 text-sm">
                        ID: PAY-1234
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status="success" text="Completed" />
                  <Button type="link">View Details</Button>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <Text className="font-semibold text-gray-900 block">
                        ₹1,500.00
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        May 20, 2024
                      </Text>
                    </div>
                    <div>
                      <Text className="text-gray-900">Bank Transfer</Text>
                      <Text className="text-gray-600 text-sm">
                        ID: PAY-1235
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status="success" text="Completed" />
                  <Button type="link">View Details</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Make Payment */}
          <Card>
            <div className="mb-6">
              <Title level={4} className="!mb-2 text-gray-900">
                Make Payment
              </Title>
              <Text className="text-gray-600">
                Pay your remaining balance or make a partial payment
              </Text>
            </div>

            <Row gutter={[24, 16]} className="align-center">
              <Col xs={24} md={6}>
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Payment Amount
                  </Text>
                  <Input
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    prefix="₹"
                    className="w-full"
                  />
                </div>
              </Col>
              <Col xs={24} md={6}>
                <div>
                  <Text className="block mb-2 text-gray-700 font-medium">
                    Payment Method
                  </Text>
                  <Select
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    className="w-full"
                  >
                    <Option value="Credit Card">Credit Card</Option>
                    <Option value="Bank Transfer">Bank Transfer</Option>
                    <Option value="PayPal">PayPal</Option>
                  </Select>
                </div>
              </Col>

              <Col xs={24} md={6} className="mt-6">
                <Button
                  size="large"
                  className="w-full"
                  onClick={handleSetupPaymentPlan}
                >
                  Set Up Payment Plan
                </Button>
              </Col>
              <Col xs={24} md={6} className="mt-6">
                <Button
                  type="primary"
                  size="large"
                  className="w-full infiniti-btn-primary"
                  onClick={handleMakePayment}
                >
                  Make Payment
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      )}

      {/* Action Buttons - Only show for non-payment tabs
      {activeTab !== "payment" && (
        <div className="flex justify-end gap-3 mt-8">
          <Button size="large" onClick={handleCancelChanges}>
            Cancel Changes
          </Button>
          <Button
            type="primary"
            size="large"
            className="infiniti-btn-primary"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </div>
      )} */}

      <Modal
        title={
          <Row className="mb-5">
            <Col className="w-full text-lg">
              {`${groupSizeAction.charAt(0).toUpperCase() + groupSizeAction.slice(1)} Group`}
            </Col>
            <Col className="w-full text-gray-400">
              Add more passengers to your group booking
            </Col>
          </Row>
        }
        centered
        open={modal2Open}
        onOk={() => submitGroupSize()}
        onCancel={() => setModal2Open(false)}
        footer={[
          <Button key="cancel" onClick={() => setModal2Open(false)}>
            Cancel
          </Button>,
          <Button
            disabled={bookingDetails?.booking?.passengerCount == newGroupSize}
            key="confirm"
            type="primary"
            onClick={submitGroupSize}
          >
            Confirm{" "}
            {groupSizeAction.charAt(0).toUpperCase() + groupSizeAction.slice(1)}
          </Button>,
        ]}
      >
        <Form form={groupSizeForm}>
          <Row className="gap-5">
            <Col xl={11}>
              <Text className="block mb-2 text-gray-700 font-semibold">
                Current size
              </Text>
              <Form.Item name="current_size">
                <InputNumber
                  disabled
                  defaultValue={bookingDetails?.booking?.passengerCount}
                  className="w-full"
                  maxLength={2}
                ></InputNumber>
              </Form.Item>
            </Col>

            <Col xl={11}>
              <Text className="block mb-2 text-gray-700 font-semibold">
                New size ({" "}
                {`${groupSizeAction.charAt(0).toUpperCase() + groupSizeAction.slice(1)}` ===
                "Downsize"
                  ? "Min 1"
                  : "Max 50"}
                )
              </Text>

              <Form.Item name="new_size">
                <InputNumber
                  onChange={(value) => setNewGroupSize(value)}
                  min={
                    groupSizeAction.charAt(0).toUpperCase() +
                      groupSizeAction.slice(1) ===
                    "Downsize"
                      ? 1
                      : bookingDetails?.booking?.passengerCount
                  }
                  max={
                    groupSizeAction.charAt(0).toUpperCase() +
                      groupSizeAction.slice(1) ===
                    "Downsize"
                      ? bookingDetails?.booking?.passengerCount
                      : 50
                  }
                  defaultValue={bookingDetails?.booking?.passengerCount}
                  className="w-full"
                  maxLength={2}
                ></InputNumber>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {bookingDetails?.booking?.passengerCount == newGroupSize ? (
          <Alert
            message="Please select a different group size"
            type="error"
            showIcon
          />
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
}