
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
      {/* Left Side - Blue Gradient with Benefits */}
      <div className="flex-1 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center relative overflow-hidden">
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
            <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3" style={{ background: 'var(--infiniti-primary)' }}>
              <span className="text-white text-xl font-bold">✈️</span>
            </div>
            <span className="text-2xl font-bold">Infiniti Airways</span>
          </div>

          {/* Benefits List */}
          <div className="space-y-6">
            <Title level={2} className="!text-white !mb-8">
              Login/registered users get more offers
            </Title>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-white mt-2 mr-4 flex-shrink-0"></div>
                <Text className="text-white text-lg">View/cancel/reschedule booking</Text>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-white mt-2 mr-4 flex-shrink-0"></div>
                <Text className="text-white text-lg">Manage cancellation booking/view booking history</Text>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-white mt-2 mr-4 flex-shrink-0"></div>
                <Text className="text-white text-lg">Faster booking with saved travelers</Text>
              </div>
              
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-white mt-2 mr-4 flex-shrink-0"></div>
                <Text className="text-white text-lg">Low cancellation fee for SME business customers</Text>
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
            <div className="flex items-center justify-end mb-4 space-x-4">
              <Button type="text" size="small" className="text-gray-500">
                🌞 Light
              </Button>
              <Button type="text" size="small" className="text-gray-500">
                🌙 Dark
              </Button>
              <Button type="text" size="small" className="text-gray-500">
                🇬🇧 English
              </Button>
            </div>
            
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
              <Button type="link" className="p-0 text-blue-600 hover:text-blue-800">
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
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  boxShadow: 'none'
                }}
                loading={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form.Item>

            {/* Login with OTP */}
            <Form.Item className="!mb-6">
              <Button
                className="w-full h-12 border border-orange-400 text-orange-600 rounded-lg font-medium bg-white hover:bg-orange-50"
              >
                Login with OTP
              </Button>
            </Form.Item>

            {/* Social Login */}
            <div className="text-center">
              <Text className="text-gray-500 mb-4 block">or login with</Text>
              <div className="flex justify-center space-x-4">
                <Button
                  shape="circle"
                  size="large"
                  className="border-gray-300 hover:border-gray-400"
                  style={{ backgroundColor: '#db4437', borderColor: '#db4437' }}
                >
                  <span className="text-white font-bold">G</span>
                </Button>
                <Button
                  shape="circle"
                  size="large"
                  className="border-gray-300 hover:border-gray-400"
                  style={{ backgroundColor: '#3b5998', borderColor: '#3b5998' }}
                >
                  <span className="text-white font-bold">f</span>
                </Button>
                <Button
                  shape="circle"
                  size="large"
                  className="border-gray-300 hover:border-gray-400"
                  style={{ backgroundColor: '#0077b5', borderColor: '#0077b5' }}
                >
                  <span className="text-white font-bold">in</span>
                </Button>
              </div>
            </div>
          </Form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Text className="text-blue-800 text-sm block font-medium mb-1">
              🎯 Demo Credentials
            </Text>
            <Text className="text-blue-600 text-xs">
              Username: <strong>john smith</strong> • Password: <strong>Infi@123</strong>
            </Text>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ant-input:focus,
        .ant-input-password:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          border-color: #3b82f6 !important;
        }
        
        .ant-btn-primary:hover {
          opacity: 0.9;
        }
        
        .ant-checkbox-wrapper:hover .ant-checkbox-inner,
        .ant-checkbox:hover .ant-checkbox-inner,
        .ant-checkbox-input:focus + .ant-checkbox-inner {
          border-color: #ff6b35;
        }
        
        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #ff6b35;
          border-color: #ff6b35;
        }
      `}</style>
    </div>
  );
}
