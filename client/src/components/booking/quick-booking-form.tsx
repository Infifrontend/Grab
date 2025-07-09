import { useState } from 'react';
import { Card, Form, Input, DatePicker, Select, Button, Radio, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const { Option } = Select;

interface SearchFormData {
  tripType: 'oneWay' | 'roundTrip' | 'multiCity';
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabin: string;
}

export default function QuickBookingForm() {
  const [form] = Form.useForm();
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip' | 'multiCity'>('oneWay');

  const searchMutation = useMutation({
    mutationFn: async (searchData: SearchFormData) => {
      const response = await apiRequest('POST', '/api/search', {
        ...searchData,
        departureDate: new Date(searchData.departureDate),
        returnDate: searchData.returnDate ? new Date(searchData.returnDate) : undefined,
      });
      return response.json();
    },
    onSuccess: () => {
      message.success('Search completed successfully!');
    },
    onError: () => {
      message.error('Search failed. Please try again.');
    },
  });

  const handleSubmit = (values: any) => {
    const searchData: SearchFormData = {
      tripType,
      origin: values.origin,
      destination: values.destination,
      departureDate: values.departureDate.format('YYYY-MM-DD'),
      returnDate: values.returnDate ? values.returnDate.format('YYYY-MM-DD') : undefined,
      passengers: parseInt(values.passengers),
      cabin: values.cabin,
    };
    
    searchMutation.mutate(searchData);
  };

  return (
    <Card className="h-fit">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Quick Booking</h2>
        <p className="text-sm text-gray-600">Get started with your group travel booking</p>
      </div>

      {/* Trip Type Selection */}
      <div className="mb-6">
        <Radio.Group 
          value={tripType} 
          onChange={(e) => setTripType(e.target.value)}
          className="flex gap-6"
        >
          <Radio value="oneWay" className="text-sm">One way</Radio>
          <Radio value="roundTrip" className="text-sm">Round trip</Radio>
          <Radio value="multiCity" className="text-sm">Multi city</Radio>
        </Radio.Group>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Form.Item
            label="Origin *"
            name="origin"
            rules={[{ required: true, message: 'Please enter origin' }]}
          >
            <Input placeholder="City / Airport" />
          </Form.Item>
          
          <Form.Item
            label="Destination *"
            name="destination"
            rules={[{ required: true, message: 'Please enter destination' }]}
          >
            <Input placeholder="City / Airport" />
          </Form.Item>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Form.Item
            label="Departure date *"
            name="departureDate"
            rules={[{ required: true, message: 'Please select departure date' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          
          {tripType !== 'oneWay' && (
            <Form.Item
              label="Return date"
              name="returnDate"
            >
              <DatePicker className="w-full" />
            </Form.Item>
          )}
        </div>

        {/* Passengers and Cabin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Form.Item
            label="Passengers"
            name="passengers"
            initialValue="15"
          >
            <Select placeholder="Select passengers">
              <Option value="15">Adults 15+ years</Option>
              <Option value="20">20 Adults</Option>
              <Option value="25">25 Adults</Option>
              <Option value="30">30 Adults</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="Cabin"
            name="cabin"
            initialValue="economy"
          >
            <Select placeholder="Select cabin class">
              <Option value="economy">Economy</Option>
              <Option value="business">Business</Option>
              <Option value="first">First Class</Option>
            </Select>
          </Form.Item>
        </div>

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
