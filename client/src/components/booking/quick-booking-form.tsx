import { useState } from "react";
import {
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Radio,
  message,
  InputNumber,
  Row,
  Col,
} from "antd";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const { Option } = Select;

interface SearchFormData {
  tripType: "oneWay" | "roundTrip" | "multiCity";
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  adults: number;
  kids: number;
  infants: number;
  cabin: string;
}

export default function QuickBookingForm() {
  const [form] = Form.useForm();
  const [tripType, setTripType] = useState<
    "oneWay" | "roundTrip" | "multiCity"
  >("oneWay");
  const [, setLocation] = useLocation();

  const searchMutation = useMutation({
    mutationFn: async (searchData: SearchFormData) => {
      // Convert Date objects to ISO strings for API
      const apiData = {
        ...searchData,
        departureDate: searchData.departureDate.toISOString(),
        returnDate: searchData.returnDate?.toISOString(),
      };
      const response = await apiRequest("POST", "/api/search", apiData);
      return response.json();
    },
    onSuccess: () => {
      message.success("Search completed successfully!");
      setLocation("/flight-search-results");
    },
    onError: (error) => {
      console.error("Search error:", error);
      message.error("Search failed. Please try again.");
    },
  });

  const handleSubmit = (values: any) => {
    // Save trip type and other search data to localStorage for the Flight Search Bundle page
    localStorage.setItem('selectedTripType', tripType);
    localStorage.setItem('searchOrigin', values.origin || '');
    localStorage.setItem('searchDestination', values.destination || '');
    localStorage.setItem('searchDepartureDate', values.departureDate?.format('YYYY-MM-DD') || '');
    localStorage.setItem('searchReturnDate', values.returnDate?.format('YYYY-MM-DD') || '');
    localStorage.setItem('searchAdults', values.adults?.toString() || '0');
    localStorage.setItem('searchKids', values.kids?.toString() || '0');
    localStorage.setItem('searchInfants', values.infants?.toString() || '0');
    localStorage.setItem('searchCabin', values.cabin || 'Economy');

    setLocation("/flight-search-bundle");

    // const searchData: SearchFormData = {
    //   tripType,
    //   origin: values.origin,
    //   destination: values.destination,
    //   departureDate: values.departureDate.toDate(),
    //   returnDate: values.returnDate ? values.returnDate.toDate() : undefined,
    //   adults: values.adults,
    //   kids: values.kids,
    //   infants: values.infants,
    //   cabin: values.cabin,
    // };

    // searchMutation.mutate(searchData);
  };

  return (
    <Card className="h-fit">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Quick Booking
        </h2>
        <p className="text-sm text-gray-600">
          Get started with your group travel booking
        </p>
      </div>

      {/* Trip Type Selection */}
      <div className="mb-6">
        <Radio.Group
          value={tripType}
          onChange={(e) => setTripType(e.target.value)}
          className="flex gap-6"
        >
          <Radio value="oneWay" className="text-sm">
            One way
          </Radio>
          <Radio value="roundTrip" className="text-sm">
            Round trip
          </Radio>
          <Radio value="multiCity" className="text-sm">
            Multi city
          </Radio>
        </Radio.Group>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        {/* Origin and Destination */}
        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <Form.Item
              label="Origin *"
              name="origin"
              rules={[{ required: true, message: "Please enter origin" }]}
            >
              <Input 
                placeholder="City / Airport" 
                prefix={<EnvironmentOutlined className="text-gray-400" />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Destination *"
              name="destination"
              rules={[{ required: true, message: "Please enter destination" }]}
            >
              <Input 
                placeholder="City / Airport" 
                prefix={<EnvironmentOutlined className="text-gray-400" />}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Dates */}
        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <Form.Item
                label="Departure date *"
                name="departureDate"
                rules={[
                  { required: true, message: "Please select departure date" },
                ]}
              >
                <DatePicker 
                  className="w-full" 
                  placeholder="dd / mm / yyyy"
                  format="DD / MM / YYYY"
                  suffixIcon={<CalendarOutlined className="text-gray-400" />}
                  disabledDate={(current) => current && current.isBefore(new Date(), 'day')}
                />
              </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Return date" name="returnDate">
              <DatePicker 
                className="w-full" 
                placeholder="dd / mm / yyyy"
                format="DD / MM / YYYY"
                disabled={tripType === "oneWay"}
                suffixIcon={<CalendarOutlined className="text-gray-400" />}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Passengers */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passengers *
          </label>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Adults (12+ years)
                </label>
                <Form.Item name="adults" initialValue={0} className="mb-0">
                  <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="0"
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Kids (2-11 years)
                </label>
                <Form.Item name="kids" initialValue={0} className="mb-0">
                  <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="0"
                  />
                </Form.Item>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Infants (0-2 years)
                </label>
                <Form.Item name="infants" initialValue={0} className="mb-0">
                  <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="0"
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </div>

        {/* Cabin */}
        <Form.Item label="Cabin *" name="cabin" initialValue="economy" className="mb-6">
          <Select placeholder="Select cabin class">
            <Option value="economy">Economy</Option>
            <Option value="business">Business</Option>
            <Option value="first">First Class</Option>
          </Select>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={searchMutation.isPending}
          className="w-full infiniti-btn-primary"
        >
          Get Fares
        </Button>
      </Form>
    </Card>
  );
}