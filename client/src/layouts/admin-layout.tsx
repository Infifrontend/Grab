import React from "react";
import { Layout } from "antd";
import AdminHeader from "@/layouts/components/admin-header";
import AdminSidebar from "@/layouts/components/admin-sidebar";
// import CFG from "@/config/config.json";
// import AccessibilityHeader from '@/components/AccessibilityHeader/AccessibilityHeader';
const { Content } = Layout;

interface AdminLayout {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayout> = ({ children }) => (
  <Layout className="min-h-screen bg-gray-50">
    {/* {CFG.accessibility_pos === "horizontal" && <AccessibilityHeader position={CFG.accessibility_pos as "horizontal" | "vertical"} />} */}
    <Layout className="flex">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main Content */}
      <Content className="" style={{ marginInlineStart: "14rem" }}>
        {/* Admin Header */}
        <AdminHeader />
        {children}
      </Content>
    </Layout>
  </Layout>
);

export default AdminLayout;
