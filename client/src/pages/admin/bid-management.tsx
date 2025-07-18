import React from 'react';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined
} from "@ant-design/icons";

const MyComponent = () => {
  return (
    <div>
      <PlusOutlined />
      <SearchOutlined />
      <FilterOutlined />
      <DownloadOutlined />
      <EyeOutlined />
      <EditOutlined />
      <DeleteOutlined />
      <CalendarOutlined />
      <DollarOutlined />
      <UserOutlined />
      <RiseOutlined />
      <FallOutlined />
      {/* Replacing TrendingUpOutlined with RiseOutlined */}
      <RiseOutlined icon={<RiseOutlined />} />
    </div>
  );
};

export default MyComponent;