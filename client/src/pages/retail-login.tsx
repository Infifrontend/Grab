
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
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-orange-500 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Volaris-inspired background elements */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-white bg-opacity-10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-400 bg-opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-orange-400 bg-opacity-15 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      {/* Left side branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative z-10 pr-20">
        <div className="text-white max-w-lg">
          <div className="mb-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12">
                <span className="text-white font-bold text-3xl transform -rotate-12">V</span>
              </div>
              <div>
                <Title level={1} className="!text-white !mb-0 !text-4xl font-black tracking-wide">
                  VOLARIS
                </Title>
                <Text className="text-orange-200 text-lg font-semibold uppercase tracking-widest">
                  GROUP BOOKING
                </Text>
              </div>
            </div>
          </div>
          
          <Title level={2} className="!text-white !mb-6 !text-3xl font-bold leading-tight">
            ¡Vuela más, paga menos! ✈️
          </Title>
          
          <Text className="text-white text-lg opacity-90 mb-10 block leading-relaxed">
            Experience ultra-low cost flights with Volaris group booking platform. 
            Book together, save together!
          </Text>
          
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 mx-auto shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-white text-xl">⚡</span>
              </div>
              <Text className="text-white font-medium text-sm">Ultra Fast</Text>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mb-3 mx-auto shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-white text-xl">💰</span>
              </div>
              <Text className="text-white font-medium text-sm">Low Cost</Text>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl flex items-center justify-center mb-3 mx-auto shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-white text-xl">👥</span>
              </div>
              <Text className="text-white font-medium text-sm">Group Deals</Text>
            </div>
          </div>
        </div>
      </div>

      {/* Compact login form */}
      <div className="w-full max-w-sm relative z-10">
        <Card 
          className="shadow-2xl border-0 backdrop-blur-md bg-white/95 transform hover:scale-105 transition-transform duration-300"
          style={{ 
            borderRadius: '24px',
            padding: '4px'
          }}
        >
          <div className="mb-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <Title level={3} className="!mb-1 !text-gray-800 font-bold">
              Iniciar Sesión
            </Title>
            <Text className="text-gray-500 text-sm">Accede a tu cuenta Volaris</Text>
          </div>

          <Form
            form={form}
            name="volaris-login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
            className="space-y-1"
          >
            <Form.Item
              label={<Text className="text-gray-700 font-medium text-sm">Correo Electrónico</Text>}
              name="email"
              rules={[
                { required: true, message: '¡Por favor ingresa tu correo!' },
                { type: 'email', message: '¡Por favor ingresa un correo válido!' }
              ]}
              className="mb-3"
            >
              <Input
                prefix={<UserOutlined className="text-red-400" />}
                placeholder="tu@email.com"
                className="h-11 rounded-lg border-gray-200 hover:border-red-400 focus:border-red-500 transition-colors"
                style={{ 
                  fontSize: '14px',
                  boxShadow: 'none'
                }}
              />
            </Form.Item>

            <Form.Item
              label={<Text className="text-gray-700 font-medium text-sm">Contraseña</Text>}
              name="password"
              rules={[
                { required: true, message: '¡Por favor ingresa tu contraseña!' },
                { min: 6, message: '¡La contraseña debe tener al menos 6 caracteres!' }
              ]}
              className="mb-3"
            >
              <Input.Password
                prefix={<LockOutlined className="text-red-400" />}
                placeholder="••••••••"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="h-11 rounded-lg border-gray-200 hover:border-red-400 focus:border-red-500 transition-colors"
                style={{ 
                  fontSize: '14px',
                  boxShadow: 'none'
                }}
              />
            </Form.Item>

            <div className="text-right mb-4">
              <Link 
                className="text-red-500 hover:text-red-600 text-xs font-medium"
                onClick={() => message.info('Función de recuperación de contraseña próximamente!')}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Form.Item className="!mb-4">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-11 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-0 rounded-lg font-semibold text-sm shadow-lg transform hover:scale-105 transition-all duration-200"
                loading={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mb-4">
            <Text className="text-gray-500 text-xs">
              ¿No tienes cuenta? {' '}
              <Link 
                className="text-red-500 hover:text-red-600 font-medium"
                onClick={() => message.info('¡Registro próximamente!')}
              >
                Regístrate
              </Link>
              {' '} o {' '}
              <Link 
                className="text-orange-500 hover:text-orange-600 font-medium"
                onClick={() => message.info('¡Inicio con OTP próximamente!')}
              >
                Código SMS
              </Link>
            </Text>
          </div>

          <Divider className="!my-4">
            <Text className="text-gray-400 text-xs">o continúa con</Text>
          </Divider>

          <Space className="w-full justify-center" size="middle">
            <Button
              icon={<GoogleOutlined />}
              shape="circle"
              size="middle"
              className="w-10 h-10 border-gray-200 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
              onClick={() => handleSocialLogin('Google')}
            />
            <Button
              icon={<FacebookOutlined />}
              shape="circle"
              size="middle"
              className="w-10 h-10 border-gray-200 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
              onClick={() => handleSocialLogin('Facebook')}
            />
            <Button
              icon={<LinkedinOutlined />}
              shape="circle"
              size="middle"
              className="w-10 h-10 border-gray-200 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
              onClick={() => handleSocialLogin('LinkedIn')}
            />
          </Space>
        </Card>

        {/* Footer */}
        <div className="text-center mt-4">
          <Text className="text-white text-xs opacity-75">
            © 2024 Volaris. Todos los derechos reservados | Política de Privacidad
          </Text>
        </div>
      </div>

      <style jsx global>{`
        .ant-input:focus,
        .ant-input-password:focus {
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
          border-color: #ef4444 !important;
        }
        
        .ant-btn-primary:hover {
          transform: scale(1.05) !important;
        }
        
        .ant-card {
          backdrop-filter: blur(20px);
        }
        
        .ant-form-item-label > label {
          font-weight: 500 !important;
        }
        
        .ant-input-affix-wrapper:hover,
        .ant-input-affix-wrapper:focus {
          border-color: #ef4444 !important;
        }
        
        .ant-divider-horizontal.ant-divider-with-text::before,
        .ant-divider-horizontal.ant-divider-with-text::after {
          border-top-color: #e5e7eb !important;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
