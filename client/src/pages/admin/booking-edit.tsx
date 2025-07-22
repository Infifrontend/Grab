
import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Input,
  Select,
  DatePicker,
  Form,
  InputNumber,
  Switch,
  Divider,
  Modal,
  message,
  Spin,
  Alert,
  Tabs,
  Badge,
  Descriptions,
} from "antd";
import {
  SaveOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function AdminBookingEdit() {
  const [, params] = useRoute("/admin/booking-edit/:id");
  const [, setLocation] = useLocation();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("booking-details");
  const [loading, setLoading] = useState(false);

  // Get booking ID from URL params
  const bookingId = params?.id;

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isAdminLoggedIn) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setLocation("/admin/login");
  };

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

  // Initialize form with booking data
  useEffect(() => {
    if (bookingDetails) {
      const { booking, passengers, comprehensiveData } = bookingDetails;
      
      form.setFieldsValue({
        bookingReference: booking.bookingReference || booking.bookingId,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        passengerCount: booking.passengerCount,
        totalAmount: parseFloat(booking.totalAmount || "0"),
        groupLeaderName: comprehensiveData?.groupLeaderInfo?.name || "",
        groupLeaderEmail: comprehensiveData?.groupLeaderInfo?.email || "",
        groupLeaderPhone: comprehensiveData?.groupLeaderInfo?.phone || "",
        origin: comprehensiveData?.tripDetails?.origin || "",
        destination: comprehensiveData?.tripDetails?.destination || "",
        departureDate: comprehensiveData?.tripDetails?.departureDate 
          ? dayjs(comprehensiveData.tripDetails.departureDate) 
          : null,
        returnDate: comprehensiveData?.tripDetails?.returnDate 
          ? dayjs(comprehensiveData.tripDetails.returnDate) 
          : null,
        tripType: comprehensiveData?.tripDetails?.tripType || "roundTrip",
        specialRequests: booking.specialRequests || "",
        passengers: passengers || [],
      });
    }
  }, [bookingDetails, form]);

  const handleSave = async (values) => {
    setLoading(true);
    try {
      // Update booking details
      const updateResponse = await fetch(`/api/admin/booking-update/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingStatus: values.bookingStatus,
          paymentStatus: values.paymentStatus,
          passengerCount: values.passengerCount,
          totalAmount: values.totalAmount.toString(),
          specialRequests: values.specialRequests,
          groupLeaderInfo: {
            name: values.groupLeaderName,
            email: values.groupLeaderEmail,
            phone: values.groupLeaderPhone,
          },
          tripDetails: {
            origin: values.origin,
            destination: values.destination,
            departureDate: values.departureDate?.toISOString(),
            returnDate: values.returnDate?.toISOString(),
            tripType: values.tripType,
          },
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update booking");
      }

      // Update passengers if provided
      if (values.passengers && values.passengers.length > 0) {
        const passengersResponse = await fetch(`/api/booking-passengers/${bookingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passengers: values.passengers }),
        });

        if (!passengersResponse.ok) {
          throw new Error("Failed to update passengers");
        }
      }

      message.success("Booking updated successfully");
      refetch();
    } catch (error) {
      console.error("Error updating booking:", error);
      message.error("Failed to update booking");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Booking",
      content: "Are you sure you want to delete this booking? This action cannot be undone.",
      icon: <ExclamationCircleOutlined />,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        message.success("Booking deleted successfully");
        setLocation("/admin/bookings");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
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

  const tabItems = [
    {
      key: "booking-details",
      label: "Booking Details",
      icon: <UserOutlined />,
    },
    {
      key: "passengers",
      label: "Passengers",
      icon: <UserOutlined />,
    },
    {
      key: "payment",
      label: "Payment",
      icon: <DollarOutlined />,
    },
    {
      key: "flight-details",
      label: "Flight Details",
      icon: <CalendarOutlined />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GR</span>
                </div>
                <div>
                  <Text className="text-gray-600 text-sm font-medium">
                    GROUP RETAIL
                  </Text>
                  <br />
                  <Text className="text-gray-500 text-xs">ADMIN PORTAL</Text>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge count={5} size="small">
                <BellOutlined className="text-gray-500 text-lg" />
              </Badge>
              <div className="text-right">
                <Text className="font-medium text-gray-900 block">Admin</Text>
                <Text className="text-gray-500 text-sm">System Admin</Text>
              </div>
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setLocation("/admin/bookings")}
              className="flex items-center"
            >
              Back to Bookings
            </Button>
            <div>
              <Title level={2} className="!mb-0">
                Edit Booking
              </Title>
              <Text className="text-gray-600">
                Booking ID: {booking.bookingReference || booking.bookingId}
              </Text>
            </div>
          </div>
          <Space>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              Delete Booking
            </Button>
          </Space>
        </div>

        {/* Booking Status Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <UserOutlined className="text-blue-600 text-lg" />
                </div>
                <Text className="text-gray-600 text-sm">Passengers</Text>
                <Text className="text-2xl font-bold text-gray-900">
                  {booking.passengerCount || 0}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <DollarOutlined className="text-green-600 text-lg" />
                </div>
                <Text className="text-gray-600 text-sm">Total Amount</Text>
                <Text className="text-2xl font-bold text-gray-900">
                  ₹{parseFloat(booking.totalAmount || "0").toLocaleString()}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <CheckCircleOutlined className="text-orange-600 text-lg" />
                </div>
                <Text className="text-gray-600 text-sm">Status</Text>
                <Tag color={booking.bookingStatus === "confirmed" ? "green" : "orange"}>
                  {booking.bookingStatus?.toUpperCase()}
                </Tag>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Form Tabs */}
        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="mb-6"
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            className="space-y-6"
          >
            {/* Booking Details Tab */}
            {activeTab === "booking-details" && (
              <div>
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Booking Reference"
                      name="bookingReference"
                      rules={[{ required: true, message: "Please enter booking reference" }]}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Booking Status"
                      name="bookingStatus"
                      rules={[{ required: true, message: "Please select booking status" }]}
                    >
                      <Select>
                        <Option value="pending">Pending</Option>
                        <Option value="confirmed">Confirmed</Option>
                        <Option value="cancelled">Cancelled</Option>
                        <Option value="processing">Processing</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Payment Status"
                      name="paymentStatus"
                      rules={[{ required: true, message: "Please select payment status" }]}
                    >
                      <Select>
                        <Option value="pending">Pending</Option>
                        <Option value="completed">Completed</Option>
                        <Option value="failed">Failed</Option>
                        <Option value="refunded">Refunded</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Passenger Count"
                      name="passengerCount"
                      rules={[{ required: true, message: "Please enter passenger count" }]}
                    >
                      <InputNumber min={1} className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Total Amount (₹)"
                      name="totalAmount"
                      rules={[{ required: true, message: "Please enter total amount" }]}
                    >
                      <InputNumber min={0} step={0.01} className="w-full" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider>Group Leader Information</Divider>

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Group Leader Name"
                      name="groupLeaderName"
                    >
                      <Input placeholder="Enter group leader name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Group Leader Email"
                      name="groupLeaderEmail"
                    >
                      <Input placeholder="Enter group leader email" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Group Leader Phone"
                      name="groupLeaderPhone"
                    >
                      <Input placeholder="Enter group leader phone" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider>Trip Information</Divider>

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Origin"
                      name="origin"
                    >
                      <Input placeholder="Enter origin city" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Destination"
                      name="destination"
                    >
                      <Input placeholder="Enter destination city" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Trip Type"
                      name="tripType"
                    >
                      <Select>
                        <Option value="oneWay">One Way</Option>
                        <Option value="roundTrip">Round Trip</Option>
                        <Option value="multiCity">Multi City</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Departure Date"
                      name="departureDate"
                    >
                      <DatePicker className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Return Date"
                      name="returnDate"
                    >
                      <DatePicker className="w-full" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Special Requests / Notes"
                  name="specialRequests"
                >
                  <TextArea rows={4} placeholder="Enter any special requests or notes" />
                </Form.Item>
              </div>
            )}

            {/* Passengers Tab */}
            {activeTab === "passengers" && (
              <div>
                <div className="mb-4">
                  <Title level={4}>Passenger Management</Title>
                  <Text className="text-gray-600">
                    Manage passenger details for this booking
                  </Text>
                </div>

                <Form.List name="passengers">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Card key={key} className="mb-4">
                          <div className="flex justify-between items-start mb-4">
                            <Title level={5}>Passenger {name + 1}</Title>
                            <Button
                              type="text"
                              danger
                              icon={<MinusCircleOutlined />}
                              onClick={() => remove(name)}
                            >
                              Remove
                            </Button>
                          </div>
                          <Row gutter={[16, 16]}>
                            <Col xs={24} md={6}>
                              <Form.Item
                                {...restField}
                                name={[name, "title"]}
                                label="Title"
                              >
                                <Select>
                                  <Option value="Mr">Mr</Option>
                                  <Option value="Mrs">Mrs</Option>
                                  <Option value="Ms">Ms</Option>
                                  <Option value="Dr">Dr</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={9}>
                              <Form.Item
                                {...restField}
                                name={[name, "firstName"]}
                                label="First Name"
                                rules={[{ required: true, message: "Please enter first name" }]}
                              >
                                <Input placeholder="First Name" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={9}>
                              <Form.Item
                                {...restField}
                                name={[name, "lastName"]}
                                label="Last Name"
                                rules={[{ required: true, message: "Please enter last name" }]}
                              >
                                <Input placeholder="Last Name" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                              <Form.Item
                                {...restField}
                                name={[name, "dateOfBirth"]}
                                label="Date of Birth"
                              >
                                <DatePicker className="w-full" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                              <Form.Item
                                {...restField}
                                name={[name, "nationality"]}
                                label="Nationality"
                              >
                                <Input placeholder="Nationality" />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                              <Form.Item
                                {...restField}
                                name={[name, "passportNumber"]}
                                label="Passport Number"
                              >
                                <Input placeholder="Passport Number" />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Card>
                      ))}
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Passenger
                      </Button>
                    </>
                  )}
                </Form.List>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === "payment" && (
              <div>
                <Title level={4}>Payment Information</Title>
                <Text className="text-gray-600 block mb-6">
                  Manage payment details and transaction history
                </Text>

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Card title="Payment Summary">
                      <Descriptions column={1}>
                        <Descriptions.Item label="Total Amount">
                          ₹{parseFloat(booking.totalAmount || "0").toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Payment Status">
                          <Tag color={booking.paymentStatus === "completed" ? "green" : "orange"}>
                            {booking.paymentStatus?.toUpperCase()}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Amount Paid">
                          ₹{(parseFloat(booking.totalAmount || "0") * (booking.paymentStatus === "completed" ? 1 : 0.5)).toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Balance Due">
                          ₹{(parseFloat(booking.totalAmount || "0") * (booking.paymentStatus === "completed" ? 0 : 0.5)).toLocaleString()}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="Payment Actions">
                      <Space direction="vertical" className="w-full">
                        <Button type="primary" block>
                          Process Payment
                        </Button>
                        <Button block>
                          Issue Refund
                        </Button>
                        <Button block>
                          Send Payment Reminder
                        </Button>
                        <Button block>
                          Download Invoice
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}

            {/* Flight Details Tab */}
            {activeTab === "flight-details" && (
              <div>
                <Title level={4}>Flight Information</Title>
                <Text className="text-gray-600 block mb-6">
                  Current flight details for this booking
                </Text>

                {flightData ? (
                  <Card>
                    <Descriptions bordered column={2}>
                      <Descriptions.Item label="Flight Number">
                        {flightData.flightNumber}
                      </Descriptions.Item>
                      <Descriptions.Item label="Airline">
                        {flightData.airline}
                      </Descriptions.Item>
                      <Descriptions.Item label="Aircraft">
                        {flightData.aircraft}
                      </Descriptions.Item>
                      <Descriptions.Item label="Route">
                        {flightData.origin} → {flightData.destination}
                      </Descriptions.Item>
                      <Descriptions.Item label="Departure">
                        {new Date(flightData.departureTime).toLocaleString()}
                      </Descriptions.Item>
                      <Descriptions.Item label="Arrival">
                        {new Date(flightData.arrivalTime).toLocaleString()}
                      </Descriptions.Item>
                      <Descriptions.Item label="Duration">
                        {flightData.duration}
                      </Descriptions.Item>
                      <Descriptions.Item label="Available Seats">
                        {flightData.availableSeats}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                ) : (
                  <Alert
                    message="No Flight Data"
                    description="No specific flight details available for this booking."
                    type="info"
                    showIcon
                  />
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                size="large"
                onClick={() => setLocation("/admin/bookings")}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
