
import { useState } from 'react';
import { Card, Row, Col, Typography, Space, Tabs, Input, Button, InputNumber, Upload, message } from 'antd';
import { DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from "@/components/layout/header";
import type { Booking } from '@shared/schema';

const { Title, Text } = Typography;

export default function ManageBookingDetail() {
  const [, params] = useRoute("/manage-booking/:id");
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("services");
  const [groupSize, setGroupSize] = useState(32);
  const [passengers, setPassengers] = useState([
    { firstName: 'John', lastName: 'Smith' },
    { firstName: 'Jane', lastName: 'Doe' },
    { firstName: 'Mike', lastName: 'Johnson' },
  ]);

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  // Find the booking by ID or use mock data
  const booking = bookings?.find((b) => b.id.toString() === params?.id) || {
    id: 1,
    bookingId: "GR-2024-1001",
    userId: 1,
    groupType: "Corporate",
    route: "New York to London",
    date: "2024-06-15",
    returnDate: "2024-06-22",
    passengers: 32,
    status: "confirmed",
  };

  const handleAddPassenger = () => {
    setPassengers([...passengers, { firstName: '', lastName: '' }]);
  };

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleCancelChanges = () => {
    message.info('Changes cancelled');
    setLocation('/manage-booking');
  };

  const tabItems = [
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <Title level={2} className="!mb-0 text-gray-900">Manage Booking</Title>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="mb-6"
        />

        {/* Tab Content */}
        {activeTab === "services" && (
          <Row gutter={[24, 24]}>
            {/* Booking Information */}
            <Col xs={24} lg={12}>
              <Card>
                <div className="mb-6">
                  <Title level={4} className="!mb-2 text-gray-900">Booking Information</Title>
                  <Text className="text-gray-600">Update basic booking details</Text>
                </div>

                <Space direction="vertical" size="large" className="w-full">
                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Booking ID</Text>
                    <Input
                      value={booking.bookingId}
                      disabled
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Group Name</Text>
                    <Input
                      placeholder="ABC Corporation Annual Meeting"
                      defaultValue="ABC Corporation Annual Meeting"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Group Type</Text>
                    <Input
                      defaultValue="Corporate"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Contact Email</Text>
                    <Input
                      type="email"
                      placeholder="john.smith@example.com"
                      defaultValue="john.smith@example.com"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Contact Phone</Text>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      defaultValue="+1 (555) 123-4567"
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
                  <Title level={4} className="!mb-2 text-gray-900">Group Size Management</Title>
                  <Text className="text-gray-600">Adjust the number of passengers in your group</Text>
                </div>

                <Space direction="vertical" size="large" className="w-full">
                  {/* Current Group Size */}
                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Current Group Size</Text>
                    <Text className="text-gray-600 text-sm block mb-2">Confirmed passengers</Text>
                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <Text className="text-green-700 font-semibold text-lg">{groupSize} passengers</Text>
                    </div>
                  </div>

                  {/* Adjust Group Size */}
                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Adjust Group Size</Text>
                    <Text className="text-gray-600 text-sm block mb-3">Add or remove passengers</Text>
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                        className="w-10 h-10 flex items-center justify-center"
                      >
                        -
                      </Button>
                      <InputNumber
                        value={groupSize}
                        onChange={(value) => setGroupSize(value || 1)}
                        min={1}
                        className="text-center"
                        style={{ width: '80px' }}
                      />
                      <Button 
                        onClick={() => setGroupSize(groupSize + 1)}
                        className="w-10 h-10 flex items-center justify-center"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Passenger Information Management */}
                  <div>
                    <Text className="block mb-2 text-gray-700 font-medium">Passenger Information Management</Text>
                    <Text className="text-gray-600 text-sm block mb-3">Upload passenger details via CSV file or enter manually</Text>
                    
                    <div className="mb-4">
                      <Button 
                        icon={<DownloadOutlined />}
                        className="mb-3"
                      >
                        Download CSV Template
                      </Button>
                      <Text className="text-gray-500 text-sm block mb-2">Download template with required passenger information format</Text>
                      
                      <div className="flex items-center gap-3">
                        <Upload
                          accept=".csv,.xlsx,.xls"
                          showUploadList={false}
                          beforeUpload={() => false}
                        >
                          <Button icon={<UploadOutlined />}>Choose file</Button>
                        </Upload>
                        <Text className="text-gray-500 text-sm">No file chosen</Text>
                        <Button type="primary" size="small">Browse</Button>
                      </div>
                      <Text className="text-gray-500 text-xs block mt-1">Supported formats: CSV, Excel (.xlsx, .xls)</Text>
                    </div>

                    {/* Manual Entry */}
                    <div>
                      <Text className="block mb-3 text-gray-700 font-medium">Manual Entry</Text>
                      <Text className="text-gray-600 text-sm block mb-3">Add or update passenger names manually</Text>
                      
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {passengers.map((passenger, index) => (
                          <div key={index} className="flex gap-3">
                            <Input
                              placeholder={`Passenger ${index + 1} - First Name`}
                              value={passenger.firstName}
                              onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder={`Passenger ${index + 1} - Last Name`}
                              value={passenger.lastName}
                              onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                              className="flex-1"
                            />
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
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        )}

        {activeTab === "changes" && (
          <Card>
            <Title level={4} className="!mb-4">Change Requests</Title>
            <Text className="text-gray-500 block mb-6">
              Request changes to your booking such as dates, destinations, or services
            </Text>
            <div className="text-center py-8">
              <Text className="text-gray-500">Change request functionality coming soon</Text>
            </div>
          </Card>
        )}

        {activeTab === "payment" && (
          <Card>
            <Title level={4} className="!mb-4">Payment Management</Title>
            <Text className="text-gray-500 block mb-6">
              View payment status and make additional payments
            </Text>
            <div className="text-center py-8">
              <Text className="text-gray-500">Payment management functionality coming soon</Text>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <Button size="large" onClick={handleCancelChanges}>
            Cancel Changes
          </Button>
          <Button 
            type="primary" 
            size="large"
            className="infiniti-btn-primary"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
