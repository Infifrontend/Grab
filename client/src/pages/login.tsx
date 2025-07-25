import { useState } from "react";
import { Card, Form, Input, Button, message, Typography, Checkbox } from "antd";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, MailOutlined } from "@ant-design/icons";
import { useLocation } from "wouter";

const { Title, Text } = Typography;

export default function Login() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);

    try {
      // Check credentials
      if (values.username === 'john smith' && values.password === 'Infi@123') {
        // Store user session
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('username', values.username);

        message.success('Login successful! Welcome aboard!');
        setTimeout(() => {
          setLocation('/');
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
    <div className="min-h-screen flex">
      {/* Left Side - Purple Gradient with Benefits */}
      <div className="flex-1 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #80206a 0%, #9c2a7a 25%, #b83389 50%, #d63d98 75%, #f047a7 100%)'
      }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-0.5 bg-white transform rotate-12 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-0.5 bg-white transform -rotate-12 animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-32 w-56 h-0.5 bg-white transform rotate-6 animate-pulse delay-2000"></div>
          <div className="absolute top-32 right-40 text-white text-2xl animate-bounce">✈️</div>
          <div className="absolute bottom-48 left-20 text-white text-xl animate-bounce delay-1000">🛩️</div>
        </div>

        <div className="text-white z-10 max-w-md px-8">
          {/* Logo */}
          <div className="flex items-center mb-12">
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
              <span className="text-white text-xl font-bold">✈️</span>
            </div>
            <span className="text-2xl font-bold">Infiniti Airways</span>
          </div>

          {/* Benefits List */}
          <div className="space-y-6">
            <Title level={2} className="!text-white !mb-8">
              Exclusive deals for registered users
            </Title>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-white mt-2 mr-4 flex-shrink-0"></div>
                <Text className="text-white text-lg">Easily view, cancel, or reschedule your flights</Text>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-white mt-2 mr-4 flex-shrink-0"></div>
                <Text className="text-white text-lg">Track your booking history effortlessly</Text>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-white mt-2 mr-4 flex-shrink-0"></div>
                <Text className="text-white text-lg">Save passenger details for faster checkout</Text>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-white mt-2 mr-4 flex-shrink-0"></div>
                <Text className="text-white text-lg">Enjoy low cancellation fees with retail plans</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Title level={1} className="!text-gray-800 !mb-2">
              Login
            </Title>
            <Text className="text-gray-500">
              Easy to manage airline disruption
            </Text>
          </div>

          {/* Login Form */}
          <Form
            name="user-login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
            className="space-y-4"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please enter your email ID!' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter your email ID"
                className="h-12 rounded-lg border-gray-300"
                style={{ fontSize: '16px' }}
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
                placeholder="Enter your password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="h-12 rounded-lg border-gray-300"
                style={{ fontSize: '16px' }}
              />
            </Form.Item>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" className="!mb-0">
                <Checkbox className="text-gray-600">Remember me</Checkbox>
              </Form.Item>
              <Button type="link" className="p-0 hover:text-purple-800" style={{ color: '#80206a' }}>
                Forgot password?
              </Button>
            </div>

            {/* Login Button */}
            <Form.Item className="!mb-4">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 border-0 rounded-lg font-semibold text-base"
                style={{
                  background: 'linear-gradient(135deg, #80206a 0%, #9c2a7a 50%, #b83389 100%)',
                  boxShadow: 'none'
                }}
                loading={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form.Item>
          </Form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 rounded-lg border" style={{ 
            backgroundColor: '#f8f4f7', 
            borderColor: '#80206a33' 
          }}>
            <Text className="block font-medium mb-1" style={{ color: '#80206a' }}>
              🎯 Demo Credentials
            </Text>
            <Text className="text-xs" style={{ color: '#80206a' }}>
              Username: <strong>john smith</strong> • Password: <strong>Infi@123</strong>
            </Text>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ant-input:focus,
        .ant-input-password:focus {
          box-shadow: 0 0 0 2px rgba(128, 32, 106, 0.2);
          border-color: #80206a !important;
        }

        .ant-btn-primary:hover {
          opacity: 0.9;
        }

        .ant-checkbox-wrapper:hover .ant-checkbox-inner,
        .ant-checkbox:hover .ant-checkbox-inner,
        .ant-checkbox-input:focus + .ant-checkbox-inner {
          border-color: #80206a;
        }

        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #80206a;
          border-color: #80206a;
        }
      `}</style>
    </div>
  );
}