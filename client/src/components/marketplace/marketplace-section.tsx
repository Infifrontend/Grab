import { useState } from 'react';
import { Card, Form, Input, DatePicker, Select, Button, Row, Col, Skeleton, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import type { Package } from '@shared/schema';

const { Option } = Select;

export default function MarketplaceSection() {
  const [searchDestination, setSearchDestination] = useState<string>('');
  
  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ['/api/packages', searchDestination],
    queryFn: async () => {
      const response = await fetch(`/api/packages${searchDestination ? `?destination=${encodeURIComponent(searchDestination)}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch packages');
      return response.json();
    },
  });

  const handleSearch = () => {
    // Search functionality is handled by the query parameter change
  };

  const handleBookPackage = (packageId: number) => {
    console.log('Booking package:', packageId);
    // Implement booking logic
  };

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div className="section-header">
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Your Marketplace</h2>
        <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Discover exclusive travel packages and deals</p>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Search Section */}
        <Row gutter={16} align="bottom" style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Form.Item label="Destination" style={{ marginBottom: 0 }}>
              <Input 
                placeholder="Search destination" 
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item label="Travel Date" style={{ marginBottom: 0 }}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item label="Passengers" style={{ marginBottom: 0 }}>
              <Select placeholder="How many?" defaultValue="">
                <Option value="">How many?</Option>
                <Option value="2-5">2-5 people</Option>
                <Option value="6-15">6-15 people</Option>
                <Option value="16-30">16-30 people</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={5}>
            <Form.Item label="Package Type" style={{ marginBottom: 0 }}>
              <Select placeholder="All packages" defaultValue="">
                <Option value="">All packages</Option>
                <Option value="business">Business</Option>
                <Option value="leisure">Leisure</Option>
                <Option value="adventure">Adventure</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={3}>
            <Button 
              type="primary" 
              onClick={handleSearch}
              style={{ width: '100%' }}
            >
              Search Packages
            </Button>
          </Col>
        </Row>

        {/* Packages Grid */}
        {isLoading ? (
          <Row gutter={24}>
            {[...Array(4)].map((_, i) => (
              <Col xs={24} sm={12} md={8} lg={6} key={i}>
                <Card>
                  <Skeleton active />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Row gutter={24}>
            {packages?.map((pkg) => (
              <Col xs={24} sm={12} md={8} lg={6} key={pkg.id}>
                <Card 
                  style={{ 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.3s',
                    height: '100%'
                  }}
                  bodyStyle={{ padding: 0 }}
                >
                  {/* Package Header */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                      {pkg.location}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '12px' }}>
                      {pkg.title}
                    </div>
                    <div className="package-price">${pkg.price}</div>
                    {pkg.originalPrice && (
                      <div style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through' }}>
                        ${pkg.originalPrice}
                      </div>
                    )}
                  </div>

                  {/* Package Features */}
                  <div style={{ padding: '16px', backgroundColor: '#f8f9fa' }}>
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      {pkg.features?.map((feature, index) => (
                        <Space key={index} align="start" size={8}>
                          <CheckCircle 
                            style={{ 
                              width: '12px', 
                              height: '12px', 
                              marginTop: '2px',
                              color: '#52c41a',
                              flexShrink: 0
                            }} 
                          />
                          <span style={{ fontSize: '12px', color: '#666' }}>{feature}</span>
                        </Space>
                      ))}
                    </Space>
                  </div>

                  {/* Package Footer */}
                  <div style={{ padding: '16px' }}>
                    <Button 
                      type="primary" 
                      style={{ width: '100%' }}
                      onClick={() => handleBookPackage(pkg.id)}
                    >
                      Book now
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </Card>
  );
}
