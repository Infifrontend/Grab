import { useState } from 'react';
import { Card, Form, Input, DatePicker, Select, Button, Radio, message, Row, Col } from 'antd';
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
    <Card style={{ height: 'fit-content' }}>
      <Row style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
            Quick Booking
          </h2>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Get started with your group travel booking
          </p>
        </Col>
      </Row>

      {/* Trip Type Selection */}
      <Row style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Radio.Group 
            value={tripType} 
            onChange={(e) => setTripType(e.target.value)}
          >
            <Row gutter={24}>
              <Col>
                <Radio value="oneWay" style={{ fontSize: '14px' }}>One way</Radio>
              </Col>
              <Col>
                <Radio value="roundTrip" style={{ fontSize: '14px' }}>Round trip</Radio>
              </Col>
              <Col>
                <Radio value="multiCity" style={{ fontSize: '14px' }}>Multi city</Radio>
              </Col>
            </Row>
          </Radio.Group>
        </Col>
      </Row>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        {/* Origin and Destination */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Origin *"
              name="origin"
              rules={[{ required: true, message: 'Please enter origin' }]}
            >
              <Input placeholder="City / Airport" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Destination *"
              name="destination"
              rules={[{ required: true, message: 'Please enter destination' }]}
            >
              <Input placeholder="City / Airport" />
            </Form.Item>
          </Col>
        </Row>

        {/* Dates */}
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Departure date *"
              name="departureDate"
              rules={[{ required: true, message: 'Please select departure date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          {tripType !== 'oneWay' && (
            <Col xs={24} md={12}>
              <Form.Item
                label="Return date"
                name="returnDate"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          )}
        </Row>

        {/* Passengers and Cabin */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} md={12}>
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
          </Col>
          <Col xs={24} md={12}>
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
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              loading={searchMutation.isPending}
              style={{ width: '100%' }}
            >
              Get Fares
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
