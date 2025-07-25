
import { useState } from "react";
import { Card, Form, Input, Button, message, Typography, Divider } from "antd";
import { UserOutlined, LockOutlined, RocketOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        {/* Flight path lines */}
        <div className="absolute top-20 left-10 w-64 h-0.5 bg-white transform rotate-12 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-0.5 bg-white transform -rotate-12 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-32 w-56 h-0.5 bg-white transform rotate-6 animate-pulse delay-2000"></div>
        
        {/* Floating aircraft icons */}
        <div className="absolute top-32 right-40 text-white text-2xl animate-bounce">✈️</div>
        <div className="absolute bottom-48 left-20 text-white text-xl animate-bounce delay-1000">🛩️</div>
        
        {/* Cloud shapes */}
        <div className="absolute top-16 left-1/3 w-20 h-12 bg-white rounded-full opacity-30"></div>
        <div className="absolute top-20 left-1/3 w-16 h-10 bg-white rounded-full opacity-20"></div>
        <div className="absolute bottom-24 right-1/4 w-24 h-14 bg-white rounded-full opacity-25"></div>
        <div className="absolute bottom-28 right-1/4 w-20 h-12 bg-white rounded-full opacity-15"></div>
      </div>

      <Card 
        className="w-full max-w-lg shadow-2xl border-0 backdrop-blur-lg"
        style={{ 
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="text-center mb-10">
          {/* Enhanced Airline Logo */}
          <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-xl" style={{ background: `linear-gradient(135deg, var(--infiniti-primary) 0%, ${getComputedStyle(document.documentElement).getPropertyValue('--infiniti-secondary')} 100%)` }}>
            <RocketOutlined className="text-white text-4xl" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-xs">✨</span>
            </div>
          </div>
          
          {/* Enhanced Branding */}
          <Title 
            level={1} 
            className="!mb-3 text-gray-900 font-black tracking-wide cursor-pointer transition-all duration-300 transform hover:scale-105"
            onClick={() => setLocation('/')}
            style={{ fontSize: '2.2rem', color: 'var(--infiniti-primary)' }}
          >
            INFINITI AIRWAYS
          </Title>
          <Text className="text-lg font-bold uppercase tracking-widest" style={{ color: 'var(--infiniti-primary)' }}>
            Passenger Portal
          </Text>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-8 h-0.5" style={{ background: `linear-gradient(to right, var(--infiniti-primary), var(--infiniti-secondary))` }}></div>
            <span className="text-gray-400 text-sm">✈️ Ready for Takeoff ✈️</span>
            <div className="w-8 h-0.5" style={{ background: `linear-gradient(to right, var(--infiniti-secondary), var(--infiniti-primary))` }}></div>
          </div>
        </div>

        <Form
          name="user-login"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
          className="space-y-2"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Please enter your username!' }
            ]}
            className="mb-6"
          >
            <Input
              prefix={<UserOutlined style={{ color: 'var(--infiniti-primary)' }} />}
              placeholder="Enter your username"
              className="h-14 rounded-xl border-2 border-gray-200 transition-all duration-300"
              style={{
                fontSize: '16px',
                backgroundColor: '#f8faff'
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your password!' }
            ]}
            className="mb-8"
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'var(--infiniti-primary)' }} />}
              placeholder="Enter your password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              className="h-14 rounded-xl border-2 border-gray-200 transition-all duration-300"
              style={{
                fontSize: '16px',
                backgroundColor: '#f8faff'
              }}
            />
          </Form.Item>

          <Form.Item className="!mb-6">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-14 border-0 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, var(--infiniti-primary) 0%, var(--infiniti-secondary) 100%)`,
                color: 'white'
              }}
              loading={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">🛫</span>
                  Boarding...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">✈️</span>
                  Board Flight
                  <span className="ml-2">✈️</span>
                </span>
              )}
            </Button>
          </Form.Item>
        </Form>

        {/* Enhanced Footer */}
        <div className="text-center space-y-4 pt-4">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="text-green-500 mr-1">🔒</span>
              SSL Secured
            </span>
            <span>•</span>
            <span className="flex items-center">
              <span className="mr-1" style={{ color: 'var(--infiniti-primary)' }}>🌍</span>
              Global Access
            </span>
            <span>•</span>
            <span className="flex items-center">
              <span className="mr-1" style={{ color: 'var(--infiniti-secondary)' }}>⭐</span>
              Premium Service
            </span>
          </div>
          
          <Divider className="!my-4">
            <Text className="text-gray-400 text-xs uppercase tracking-wide">
              Trusted by Millions of Travelers
            </Text>
          </Divider>
          
          <div className="rounded-lg p-3" style={{ background: 'linear-gradient(to right, rgba(42, 10, 34, 0.05), rgba(161, 40, 133, 0.05))' }}>
            <Text className="text-gray-600 text-sm block font-medium">
              🎯 Demo Credentials
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              Username: <strong>john smith</strong> • Password: <strong>Infi@123</strong>
            </Text>
          </div>
        </div>
      </Card>

      {/* Enhanced Bottom Branding */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg px-6 py-3">
          <Text className="text-white text-sm font-medium">
            © 2025 Infiniti Airways - Premium Flight Booking Experience
          </Text>
          <div className="flex items-center justify-center space-x-3 mt-2 text-white text-xs opacity-75">
            <span>🏆 Award Winning</span>
            <span>•</span>
            <span>🚀 Modern Technology</span>
            <span>•</span>
            <span>💎 Luxury Travel</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ant-card {
          backdrop-filter: blur(20px);
        }
        
        .ant-input:focus,
        .ant-input-password:focus {
          box-shadow: 0 0 0 3px rgba(42, 10, 34, 0.1);
          border-color: var(--infiniti-primary) !important;
        }
        
        .ant-btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 20px 40px rgba(42, 10, 34, 0.4);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        
        .ant-card {
          animation: float 8s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        
        .ant-btn-primary {
          background: linear-gradient(45deg, var(--infiniti-primary), var(--infiniti-secondary), var(--infiniti-primary));
          background-size: 400% 400%;
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
