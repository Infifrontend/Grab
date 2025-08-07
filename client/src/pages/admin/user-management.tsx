
import React, { useState, useEffect } from 'react';
import { Card, Table, Switch, message, Button, Modal, Form, Input, Space, Tag, Typography } from 'antd';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface User {
  id: number;
  username: string;
  name: string;
  isRetailAllowed: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // In a real app, you'd have an endpoint to get all users
      // For now, we'll simulate this
      const mockUsers: User[] = [
        { id: 1, username: 'default_user', name: 'Default User', isRetailAllowed: true },
        { id: 2, username: 'admin', name: 'Admin User', isRetailAllowed: false },
        { id: 3, username: 'retailuser1', name: 'Retail User 1', isRetailAllowed: true },
        { id: 4, username: 'retailuser2', name: 'Retail User 2', isRetailAllowed: false },
      ];
      setUsers(mockUsers);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRetailAccessChange = async (userId: number, isAllowed: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}/retail-access`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAllowed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update access');
      }

      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, isRetailAllowed: isAllowed } : user
        )
      );

      message.success(data.message);
    } catch (error) {
      message.error(error.message || 'Failed to update retail access');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Retail Access',
      key: 'retailAccess',
      render: (record: User) => (
        <Space>
          <Switch
            checked={record.isRetailAllowed}
            onChange={(checked) => handleRetailAccessChange(record.id, checked)}
            size="small"
          />
          <Tag color={record.isRetailAllowed ? 'green' : 'red'}>
            {record.isRetailAllowed ? 'Allowed' : 'Denied'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: User) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                title: 'Delete User',
                content: `Are you sure you want to delete user "${record.username}"?`,
                onOk: () => {
                  // Implement delete functionality
                  message.info('Delete functionality would be implemented here');
                },
              });
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // Implement user update/create logic here
      message.success('User updated successfully');
      setModalVisible(false);
      setEditingUser(null);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('Failed to update user');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>User Management</Title>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => {
            setEditingUser(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Add User
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          pagination={{
            total: users.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} users`,
          }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ isRetailAllowed: false }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="isRetailAllowed" valuePropName="checked">
            <Switch />
            <span className="ml-2">Allow Retail Access</span>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
