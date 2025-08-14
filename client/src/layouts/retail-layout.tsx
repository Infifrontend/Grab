import React from "react";
import { Layout } from "antd";
import Header from "@/layouts/components/retail-header";
import Footer from "@/layouts/components/retail-footer";

// import CFG from "@/config/config.json";
// import AccessibilityHeader from '@/components/AccessibilityHeader/AccessibilityHeader';
const { Content, Sider } = Layout;

interface RetailLayout {
  children: React.ReactNode;
}

const RetailLayout: React.FC<RetailLayout> = ({ children }) => (
  <Layout className="cls-RetailLayout min-h-screen bg-gray-50">
    {/* {CFG.accessibility_pos === "horizontal" && <AccessibilityHeader position={CFG.accessibility_pos as "horizontal" | "vertical"} />} */}
    <Header />
    <Content>{children}</Content>
    <Footer />
  </Layout>
);

export default RetailLayout;
