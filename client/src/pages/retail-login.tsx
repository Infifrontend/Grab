
import { useState } from "react";
import { Card, Form, Input, Button, message, Typography, Divider, Space } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, LinkedinOutlined } from "@ant-design/icons";
import { useLocation } from "wouter";

const { Title, Text, Link } = Typography;

export default function RetailLogin() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Store user session
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', values.email);
        localStorage.setItem('userId', result.userId);
        
        message.success('Login successful! Welcome back.');
        setTimeout(() => {
          setLocation('/dashboard');
        }, 1000);
      } else {
        message.error(result.message || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    message.info(`${provider} login coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Left side content */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative z-10">
        <div className="text-white max-w-lg">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-orange-500 font-bold text-xl">✈️</span>
              </div>
              <Title level={2} className="!text-white !mb-0">
                GroupRM
              </Title>
            </div>
          </div>
          
          <Title level={1} className="!text-white !mb-6 !text-4xl">
            Enjoy 😊 the benefits of group bookings with our product
          </Title>
          
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <Text className="text-white font-medium">Quick Response</Text>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <Text className="text-white font-medium">(E2E) automation</Text>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <span className="text-white text-2xl">📊</span>
              </div>
              <Text className="text-white font-medium">Dashboard</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Right side login form */}
      <div className="w-full max-w-md relative z-10">
        <Card 
          className="shadow-2xl border-0"
          style={{ 
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div className="mb-8">
            <Title level={3} className="!mb-2 !text-gray-900">
              Group login
            </Title>
          </div>

          <Form
            form={form}
            name="retail-login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
          >
            <Form.Item
              label={<Text className="text-gray-600">Email ID</Text>}
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email address!' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="username_travelagency@gmail.com"
                className="h-12 rounded-lg border-gray-300 hover:border-orange-400 focus:border-orange-500"
                style={{ fontSize: '16px' }}
              />
            </Form.Item>

            <Form.Item
              label={<Text className="text-gray-600">Password</Text>}
              name="password"
              rules={[
                { required: true, message: 'Please enter your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="••••••••"
                className="h-12 rounded-lg border-gray-300 hover:border-orange-400 focus:border-orange-500"
                style={{ fontSize: '16px' }}
              />
            </Form.Item>

            <div className="text-right mb-6">
              <Link 
                className="text-blue-500 hover:text-blue-600 text-sm"
                onClick={() => message.info('Password reset functionality coming soon!')}
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item className="!mb-6">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 border-0 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                loading={loading}
                style={{ backgroundColor: '#ff7849' }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mb-6">
            <Text className="text-gray-500 text-sm">
              Not yet registered? {' '}
              <Link 
                className="text-blue-500 hover:text-blue-600"
                onClick={() => message.info('Registration coming soon!')}
              >
                Signup
              </Link>
              {' '} or {' '}
              <Link 
                className="text-blue-500 hover:text-blue-600"
                onClick={() => message.info('OTP login coming soon!')}
              >
                Login with otp
              </Link>
            </Text>
          </div>

          <Divider className="!my-6">
            <Text className="text-gray-500 text-sm">or login with</Text>
          </Divider>

          <Space className="w-full justify-center" size="large">
            <Button
              icon={<GoogleOutlined />}
              shape="circle"
              size="large"
              className="w-12 h-12 border-gray-300 hover:border-red-400 hover:text-red-500 transition-colors duration-200"
              onClick={() => handleSocialLogin('Google')}
            />
            <Button
              icon={<FacebookOutlined />}
              shape="circle"
              size="large"
              className="w-12 h-12 border-gray-300 hover:border-blue-400 hover:text-blue-500 transition-colors duration-200"
              onClick={() => handleSocialLogin('Facebook')}
            />
            <Button
              icon={<LinkedinOutlined />}
              shape="circle"
              size="large"
              className="w-12 h-12 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-colors duration-200"
              onClick={() => handleSocialLogin('LinkedIn')}
            />
          </Space>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <Text className="text-white text-sm opacity-75">
            © 2024, GroupRM all rights reserved | Privacy policy | Feedback | Copyright and trademark
          </Text>
        </div>
      </div>

      <style jsx global>{`
        .ant-input:focus,
        .ant-input-password:focus {
          box-shadow: 0 0 0 2px rgba(255, 120, 73, 0.2);
        }
        
        .ant-btn-primary:hover {
          transform: translateY(-1px);
        }
        
        .ant-card {
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}
