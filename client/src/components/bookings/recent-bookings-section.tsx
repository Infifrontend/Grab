import { Table, Tag, Card, Row, Col } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import type { Booking } from '@shared/schema';
import type { ColumnsType } from 'antd/es/table';

export default function RecentBookingsSection() {
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  const columns: ColumnsType<Booking> = [
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      render: (text) => (
        <span style={{ fontWeight: '600', color: '#133769' }}>{text}</span>
      ),
    },
    {
      title: 'Route',
      dataIndex: 'route',
      key: 'route',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => format(new Date(date), 'MMM dd, yyyy'),
    },
    {
      title: 'Passengers',
      dataIndex: 'passengers',
      key: 'passengers',
      render: (passengers) => `${passengers} passengers`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`${getStatusClassName(status)}`} style={{ textTransform: 'capitalize' }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <a 
          href="#" 
          style={{ color: '#133769', fontWeight: '500', textDecoration: 'none' }}
          onClick={(e) => {
            e.preventDefault();
            console.log('Manage booking:', record.id);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          Manage booking
        </a>
      ),
    },
  ];

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div className="section-header">
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Recent Bookings</h2>
        <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>View your latest group travel bookings</p>
      </div>

      <Row>
        <Col span={24}>
          <div style={{ padding: '24px' }}>
            <Table
              columns={columns}
              dataSource={bookings}
              loading={isLoading}
              rowKey="id"
              pagination={false}
              size="middle"
              style={{ width: '100%' }}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
}
