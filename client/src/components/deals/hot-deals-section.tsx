import { Card, Rate, Tag, Row, Col, Skeleton, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Plane, Users, CheckCircle } from 'lucide-react';
import type { Deal } from '@shared/schema';

export default function HotDealsSection() {
  const { data: deals, isLoading } = useQuery<Deal[]>({
    queryKey: ['/api/deals'],
  });

  if (isLoading) {
    return (
      <Card style={{ height: 'fit-content' }}>
        <Skeleton active />
      </Card>
    );
  }

  return (
    <Card style={{ height: 'fit-content', padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div className="section-header">
        <div className="limited-time-badge">Limited Time</div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Hot Deals & Offers</h2>
        <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>Exclusive group travel deals for popular routes</p>
      </div>

      {/* Deal Content */}
      <div style={{ padding: '24px' }}>
        {deals?.map((deal) => (
          <div key={deal.id}>
            {/* Flash Sale Banner */}
            {deal.isFlashSale && (
              <Row style={{ marginBottom: '12px' }}>
                <Col span={24}>
                  <div className="flash-sale-banner">
                    {deal.title}
                  </div>
                </Col>
              </Row>
            )}

            {/* Discount Badge */}
            <Row style={{ marginBottom: '16px' }}>
              <Col span={24}>
                <div className="discount-badge">
                  🔥 {deal.discountPercentage}% OFF
                </div>
              </Col>
            </Row>

            {/* Route Display */}
            <Row style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <div className="route-display">
                  <Plane style={{ width: '20px', height: '20px', color: '#133769' }} />
                  <span>{deal.origin}</span>
                  <span style={{ color: '#133769' }}>→</span>
                  <span>{deal.destination}</span>
                </div>
              </Col>
            </Row>

            {/* Pricing and Rating */}
            <Row justify="space-between" align="top" style={{ marginBottom: '20px' }}>
              <Col>
                <div className="original-price">${deal.originalPrice}</div>
                <div className="discounted-price">${deal.discountedPrice}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>per person</div>
              </Col>
              
              <Col>
                <div style={{ textAlign: 'right' }}>
                  <Space align="center" style={{ marginBottom: '4px' }}>
                    <Rate disabled defaultValue={parseFloat(deal.rating)} style={{ fontSize: '14px' }} />
                    <span style={{ fontWeight: '600', color: '#333' }}>{deal.rating}</span>
                  </Space>
                  <div style={{ fontSize: '12px', color: '#666' }}>Customer Rating</div>
                </div>
              </Col>
            </Row>

            {/* Deal Details */}
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <div className="group-size-item">
                  <Space align="center" style={{ marginBottom: '4px' }}>
                    <Users style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '12px', color: '#666' }}>Group Size</span>
                  </Space>
                  <div style={{ fontWeight: '600', color: '#333' }}>
                    {deal.groupSizeMin}-{deal.groupSizeMax} pax
                  </div>
                </div>
              </Col>
              
              <Col xs={24} md={12}>
                <div className="availability-item">
                  <Space align="center" style={{ marginBottom: '4px' }}>
                    <CheckCircle style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '12px', color: '#666' }}>Available</span>
                  </Space>
                  <div style={{ fontWeight: '600', color: '#333' }}>{deal.availableSeats} seats</div>
                </div>
              </Col>
            </Row>
          </div>
        ))}
      </div>
    </Card>
  );
}
