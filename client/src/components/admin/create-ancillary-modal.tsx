
import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Row,
  Col,
  Button,
  Typography,
} from "antd";

const { Title, Text } = Typography;

interface CreateAncillaryModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingAncillary?: any;
}

export default function CreateAncillaryModal({
  visible,
  onCancel,
  onSubmit,
  editingAncillary,
}: CreateAncillaryModalProps) {
  const [form] = Form.useForm();
  const [ancillaryModalStep, setAncillaryModalStep] = useState(0);

  const handleCancel = () => {
    setAncillaryModalStep(0);
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values: any) => {
    console.log("Ancillary values:", values);
    onSubmit(values);
    setAncillaryModalStep(0);
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div className="border-b border-gray-200 pb-4 mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Add New Ancillary
          </Title>
          <Text className="text-gray-600 text-base">
            Configure comprehensive ancillary details including product
            definitions, pricing rules, availability logic, bundle options,
            and categories
          </Text>
        </div>
      }
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      className="custom-modal"
      bodyStyle={{ padding: "24px 32px 32px" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div style={{ minHeight: "400px" }}>
          {/* Step 1: Basic Information */}
          {ancillaryModalStep === 0 && (
            <div>
              <Title level={4} className="!mb-4 text-blue-600">
                Basic Information
              </Title>
              <Text className="text-gray-600 block mb-6">
                Configure comprehensive ancillary details including
                product definitions, pricing rules, availability logic,
                bundle options, and categories.
              </Text>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Ancillary Name"
                    name="ancillaryName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter ancillary name",
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g., Premium Meal Service"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Category"
                    name="category"
                    rules={[
                      {
                        required: true,
                        message: "Please select category",
                      },
                    ]}
                  >
                    <Select placeholder="Select category" size="large">
                      <Select.Option value="seat">Seat</Select.Option>
                      <Select.Option value="food-beverage">
                        Food & Beverage
                      </Select.Option>
                      <Select.Option value="service">Service</Select.Option>
                      <Select.Option value="baggage">Baggage</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Ancillary Type"
                    name="ancillaryType"
                    rules={[
                      { required: true, message: "Please select type" },
                    ]}
                  >
                    <Select placeholder="Select type" size="large">
                      <Select.Option value="mandatory">Mandatory</Select.Option>
                      <Select.Option value="optional">Optional</Select.Option>
                      <Select.Option value="bundle">Bundle</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Status"
                    name="status"
                    initialValue="active"
                  >
                    <Select placeholder="Select status" size="large">
                      <Select.Option value="active">Active</Select.Option>
                      <Select.Option value="inactive">Inactive</Select.Option>
                      <Select.Option value="draft">Draft</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Description" name="description">
                <Input.TextArea
                  rows={4}
                  placeholder="Describe the ancillary service..."
                />
              </Form.Item>
            </div>
          )}

          {/* Step 2: Terms and Conditions */}
          {ancillaryModalStep === 1 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-xs">📋</span>
                </div>
                <Title level={4} className="!mb-0 text-blue-600">
                  Terms and Conditions
                </Title>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Form.Item
                    name="refundable"
                    valuePropName="checked"
                    className="!mb-0"
                  >
                    <div className="flex items-center">
                      <Switch className="mr-2" />
                      <Text>Refundable</Text>
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="changeable"
                    valuePropName="checked"
                    className="!mb-0"
                  >
                    <div className="flex items-center">
                      <Switch className="mr-2" />
                      <Text>Changeable</Text>
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="transferable"
                    valuePropName="checked"
                    className="!mb-0"
                  >
                    <div className="flex items-center">
                      <Switch className="mr-2" />
                      <Text>Transferable</Text>
                    </div>
                  </Form.Item>
                </div>
              </div>

              <div className="mb-6">
                <Text className="font-medium block mb-3">
                  Cancellation Policy
                </Text>
                <Form.Item name="cancellationPolicy">
                  <Input.TextArea
                    rows={4}
                    placeholder="Describe cancellation terms and conditions..."
                    className="bg-gray-50"
                  />
                </Form.Item>
              </div>

              <div>
                <Text className="font-medium block mb-3">
                  Special Conditions
                </Text>
                <Form.Item name="specialConditions">
                  <Input.TextArea
                    rows={4}
                    placeholder="Any special terms, restrictions, or conditions..."
                    className="bg-gray-50"
                  />
                </Form.Item>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <Button onClick={handleCancel} size="large">
            Cancel
          </Button>

          <div className="flex space-x-3">
            <Button
              onClick={() =>
                setAncillaryModalStep(Math.max(0, ancillaryModalStep - 1))
              }
              disabled={ancillaryModalStep === 0}
              size="large"
            >
              Previous
            </Button>
            {ancillaryModalStep < 1 ? (
              <Button
                type="primary"
                onClick={(e) => {
                  e.preventDefault();
                  setAncillaryModalStep(Math.min(1, ancillaryModalStep + 1));
                }}
                className="bg-blue-600 hover:bg-blue-700"
                size="large"
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-600 hover:bg-blue-700"
                size="large"
              >
                Create Ancillary
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
}
