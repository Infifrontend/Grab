import { useState } from "react";
import { Card, Form, Input, Button, message, Typography, Checkbox } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import loginBg from "../images/loginBanner.jpg";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    setLoading(true);

    try {
      const response = await fetch("/api/check-retail-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.success) {
        throw new Error(data.message || "Access denied");
      }

      // Store user data
      localStorage.setItem("userRole", "retail");
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userId", data.user.id.toString());
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email || values.username);

      message.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      message.error(
        error.message ||
          "Login failed. Please check your credentials and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Purple Gradient with Benefits */}
      <div
        className="flex-1 bg-gradient-to-br flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-0.5 bg-white transform rotate-12 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-0.5 bg-white transform -rotate-12 animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-32 w-56 h-0.5 bg-white transform rotate-6 animate-pulse delay-2000"></div>
          {/* <div className="absolute top-32 right-40 text-white text-2xl animate-bounce">✈️</div> */}
          <div className="absolute bottom-48 left-20 text-white text-xl animate-bounce delay-1000">
            🛩️
          </div>
        </div>
        <div className="absolute inset-0 opacity-1">
          <div
            style={{
              background:
                "linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('../images/login-bg-3.jpg') no-repeat center center / cover",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
              padding: "140px 40px",
              height: "100vh",
              boxSizing: "border-box",
              fontSize: "18px",
              lineHeight: "2",
              gap: "10px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: "38px",
                fontWeight: "bold",
              }}
            >
              Group Retail Airline Booking
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              Easier with modern tools and planning
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
                { required: true, message: "Please enter your email ID!" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Enter your email ID"
                className="h-12 rounded-lg border-gray-300"
                style={{ fontSize: "16px" }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className="h-12 rounded-lg border-gray-300"
                style={{ fontSize: "16px" }}
              />
            </Form.Item>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <Form.Item
                name="remember"
                valuePropName="checked"
                className="!mb-0"
              >
                <Checkbox className="text-gray-600">Remember me</Checkbox>
              </Form.Item>
              <Button type="link" className="p-0 hover:text-purple-800">
                Forgot password?
              </Button>
            </div>

            {/* Login Button */}
            <Form.Item className="!mb-4">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 border-0 rounded-lg font-semibold text-base"
                loading={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
          </Form>

          {/* Demo Credentials */}
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
