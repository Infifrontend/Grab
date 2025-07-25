
import { useState } from "react";
import { Card, Form, Input, Button, message, Typography, Divider, Space } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, LinkedinOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-white bg-opacity-10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400 bg-opacity-20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400 bg-opacity-10 rounded-full blur-xl animate-pulse delay-500"></div>
      
      {/* Left side content */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative z-10 pr-16">
        <div className="text-white max-w-lg">
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">✈️</span>
              </div>
              <Title level={2} className="!text-white !mb-0 !text-3xl font-bold">
                GroupRM
              </Title>
            </div>
          </div>
          
          <Title level={1} className="!text-white !mb-8 !text-5xl font-extrabold leading-tight">
            Enjoy 😊 the benefits of group bookings
          </Title>
          
          <Text className="text-white text-xl opacity-90 mb-12 block leading-relaxed">
            Transform your travel experience with our innovative group booking platform
          </Text>
          
          <div className="grid grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <Text className="text-white font-semibold text-sm">Quick Response</Text>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <Text className="text-white font-semibold text-sm">E2E Automation</Text>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <span className="text-white text-2xl">📊</span>
              </div>
              <Text className="text-white font-semibold text-sm">Analytics</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Right side login form */}
      <div className="w-full max-w-md relative z-10">
        <Card 
          className="shadow-2xl border-0 backdrop-blur-sm bg-white/95"
          style={{ 
            borderRadius: '20px',
            padding: '8px'
          }}
        >
          <div className="mb-6 text-center">
            <Title level={3} className="!mb-2 !text-gray-800 font-bold">
              Welcome Back
            </Title>
            <Text className="text-gray-500">Sign in to your account</Text>
          </div>

          <Form
            form={form}
            name="retail-login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
            className="space-y-1"
          >
            <Form.Item
              label={<Text className="text-gray-700 font-medium">Email Address</Text>}
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email address!' }
              ]}
              className="mb-4"
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter your email"
                className="h-12 rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                style={{ 
                  fontSize: '15px',
                  boxShadow: 'none'
                }}
              />
            </Form.Item>

            <Form.Item
              label={<Text className="text-gray-700 font-medium">Password</Text>}
              name="password"
              rules={[
                { required: true, message: 'Please enter your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
              className="mb-4"
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="h-12 rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                style={{ 
                  fontSize: '15px',
                  boxShadow: 'none'
                }}
              />
            </Form.Item>

            <div className="text-right mb-5">
              <Link 
                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                onClick={() => message.info('Password reset functionality coming soon!')}
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item className="!mb-5">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                loading={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mb-5">
            <Text className="text-gray-500 text-sm">
              Don't have an account? {' '}
              <Link 
                className="text-blue-500 hover:text-blue-600 font-medium"
                onClick={() => message.info('Registration coming soon!')}
              >
                Sign up
              </Link>
              {' '} or {' '}
              <Link 
                className="text-purple-500 hover:text-purple-600 font-medium"
                onClick={() => message.info('OTP login coming soon!')}
              >
                Login with OTP
              </Link>
            </Text>
          </div>

          <Divider className="!my-5">
            <Text className="text-gray-400 text-sm">or continue with</Text>
          </Divider>

          <Space className="w-full justify-center" size="large">
            <Button
              icon={<GoogleOutlined />}
              shape="circle"
              size="large"
              className="w-12 h-12 border-gray-200 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => handleSocialLogin('Google')}
            />
            <Button
              icon={<FacebookOutlined />}
              shape="circle"
              size="large"
              className="w-12 h-12 border-gray-200 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => handleSocialLogin('Facebook')}
            />
            <Button
              icon={<LinkedinOutlined />}
              shape="circle"
              size="large"
              className="w-12 h-12 border-gray-200 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => handleSocialLogin('LinkedIn')}
            />
          </Space>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <Text className="text-white text-xs opacity-75">
            © 2024 GroupRM. All rights reserved | Privacy Policy | Terms of Service
          </Text>
        </div>
      </div>

      <style jsx global>{`
        .ant-input:focus,
        .ant-input-password:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          border-color: #3b82f6 !important;
        }
        
        .ant-btn-primary:hover {
          transform: translateY(-2px) !important;
        }
        
        .ant-card {
          backdrop-filter: blur(20px);
        }
        
        .ant-form-item-label > label {
          font-weight: 500 !important;
        }
        
        .ant-input-affix-wrapper:hover,
        .ant-input-affix-wrapper:focus {
          border-color: #3b82f6 !important;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
