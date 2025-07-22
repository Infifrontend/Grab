
import { useState } from "react";
import { Card, Form, Input, Button, message, Typography, Divider } from "antd";
import { UserOutlined, LockOutlined, RocketOutlined } from "@ant-design/icons";
import { useLocation } from "wouter";

const { Title, Text } = Typography;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    
    try {
      // Check credentials
      if (values.username === 'grab' && values.password === 'Infi@123') {
        // Store admin session
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', values.username);
        
        message.success('Login successful! Redirecting to admin dashboard...');
        setTimeout(() => {
          setLocation('/admin/dashboard');
        }, 1000);
      } else {
        message.error('Invalid username or password. Please try again.');
      }
    } catch (error) {
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-white rounded-full"></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 border border-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-white rounded-full"></div>
      </div>

      <Card 
        className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm"
        style={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px'
        }}
      >
        <div className="text-center mb-8">
          {/* Airline Logo Area */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <RocketOutlined className="text-white text-3xl" />
          </div>
          
          {/* Airline Branding */}
          <Title 
            level={2} 
            className="!mb-2 text-gray-900 font-bold tracking-wide cursor-pointer hover:text-blue-600 transition-colors duration-200"
            onClick={() => setLocation('/')}
          >
            INFINITI AIRWAYS
          </Title>
          <Text className="text-blue-600 text-base font-semibold uppercase tracking-widest">
            Admin Portal
          </Text>
          <Divider className="!my-4">
            <Text className="text-gray-500 text-xs uppercase">Authorized Personnel Only</Text>
          </Divider>
        </div>

        <Form
          name="admin-login"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Please enter your username!' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Administrator Username"
              className="h-12 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
              style={{
                fontSize: '16px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your password!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Administrator Password"
              className="h-12 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
              style={{
                fontSize: '16px'
              }}
            />
          </Form.Item>

          <Form.Item className="!mb-4">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
              loading={loading}
            >
              {loading ? 'Authenticating...' : 'Access Control Panel'}
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="text-center space-y-2">
          <Text className="text-gray-400 text-xs block">
            Secure Administrative Access
          </Text>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <span>🔒 SSL Protected</span>
            <span>•</span>
            <span>✈️ Flight Operations</span>
          </div>
        </div>
      </Card>

      {/* Bottom Branding */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
        <Text className="text-white text-sm opacity-75">
          © 2025 Infiniti Airways - Administrative System
        </Text>
      </div>

      <style jsx global>{`
        .ant-card {
          backdrop-filter: blur(10px);
        }
        
        .ant-input:focus,
        .ant-input-password:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        .ant-btn-primary:hover {
          transform: translateY(-1px);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        .ant-card {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
