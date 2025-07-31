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
import { useModalLogic } from "./use-modal-logic";
const { Title, Text } = Typography;

interface AncillaryModalProps {
  isModalVisible: boolean;
  editingData?: any;
  setIsModalVisible: (value: boolean) => void;
  setEditingOffer: (value: any) => void;
  setAncillaryTableData: (value: any) => void;
}

// const steps = [
//   { title: "Basic Information" },
//   { title: "Terms and Conditions" },
// ];

export default function AncillaryModal({
  isModalVisible,
  editingData,
  setIsModalVisible,
  setEditingOffer,
  setAncillaryTableData,
}: AncillaryModalProps) {
  const [form] = Form.useForm();
  const {
    formValues,
    setFormValues,
    policyModalStep,
    setPolicyModalStep,
    handleFormData,
  } = useModalLogic({ editingData, isModalVisible, form });

  return (
    <Modal
      style={{ top: 50 }}
      title={
        <div className="border-b border-gray-200 pb-4 mb-6">
          <Title level={3} className="!mb-2 text-gray-900">
            Add New Ancillary
          </Title>
        </div>
      }
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        setEditingOffer(null);
        setPolicyModalStep(0);
        form.resetFields();
      }}
      footer={null}
      width={800}
      className="custom-modal"
      bodyStyle={{ padding: "0 32px 32px" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          setAncillaryTableData({ ...formValues, ...form.getFieldsValue() });
          const check = await form.validateFields([
            "ancillaryName",
            "category",
            "ancillaryType",
          ]);
          if (check) {
            setIsModalVisible(false);
          }
        }}
      >
        {/* Steps Navigation */}
        {/* <div className="relative mb-8">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
          <div
            className="absolute top-5 left-0 h-0.5 bg-blue-500 z-10"
            style={{
              width: `${(policyModalStep / (steps.length - 1)) * 100}%`,
            }}
          ></div>
          <div className="relative flex justify-between z-20">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-3
                    ${
                      index < policyModalStep
                        ? "bg-green-500 border-green-500 text-white"
                        : index === policyModalStep
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white border-gray-300 text-gray-500"
                    }
                  `}
                >
                  {index < policyModalStep ? (
                    <span className="text-sm">✓</span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center max-w-[120px]">
                  <Text
                    className={`text-xs font-medium ${
                      index <= policyModalStep
                        ? "text-gray-800"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        <div style={{ minHeight: "400px" }}>
          {/* Step 1: Basic Information */}
          {policyModalStep === 0 && (
            <div>
              <Title level={4} className="!mb-4 text-blue-600">
                Basic Information
              </Title>
              <Text className="text-gray-600 block mb-6">
                Configure comprehensive ancillary details including product
                definitions, pricing rules, availability logic, bundle options,
                and categories.
              </Text>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={
                        <span className="font-medium">
                          Ancillary Name <span className="text-red-500">*</span>
                        </span>
                      }
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
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={
                        <span className="font-medium">
                          Category <span className="text-red-500">*</span>
                        </span>
                      }
                      name="category"
                      rules={[
                        { required: true, message: "Please select category" },
                      ]}
                    >
                      <Select
                        placeholder="Select category"
                        size="large"
                        className="rounded-lg"
                      >
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
                      label={
                        <span className="font-medium">
                          Ancillary Type <span className="text-red-500">*</span>
                        </span>
                      }
                      name="ancillaryType"
                      rules={[
                        { required: true, message: "Please select type" },
                      ]}
                    >
                      <Select
                        placeholder="Select type"
                        size="large"
                        className="rounded-lg"
                      >
                        <Select.Option value="mandatory">
                          Mandatory
                        </Select.Option>
                        <Select.Option value="optional">Optional</Select.Option>
                        <Select.Option value="bundle">Bundle</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={<span className="font-medium">Status</span>}
                      name="status"
                      initialValue="active"
                    >
                      <Select
                        placeholder="Select status"
                        size="large"
                        className="rounded-lg"
                      >
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="inactive">Inactive</Select.Option>
                        <Select.Option value="draft">Draft</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  label={<span className="font-medium">Description</span>}
                  name="description"
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Describe the ancillary service..."
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>
            </div>
          )}

          {/* Step 2: Terms and Conditions */}
          {policyModalStep === 1 && (
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
                    rules={[{ required: true, message: "Please select type" }]}
                  >
                    <div className="flex items-center">
                      <Switch
                        className="mr-2"
                        onChange={(value) =>
                          setFormValues((prev: any) => ({
                            ...prev,
                            refundable: value,
                          }))
                        }
                      />
                      <Text>Refundable</Text>
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="changeable"
                    valuePropName="checked"
                    className="!mb-0"
                  >
                    <div className="flex items-center">
                      <Switch
                        className="mr-2"
                        onChange={(value) =>
                          setFormValues((prev: any) => ({
                            ...prev,
                            changeable: value,
                          }))
                        }
                      />
                      <Text>Changeable</Text>
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="transferable"
                    valuePropName="checked"
                    className="!mb-0"
                  >
                    <div className="flex items-center">
                      <Switch
                        className="mr-2"
                        onChange={(value) =>
                          setFormValues((prev: any) => ({
                            ...prev,
                            transferable: value,
                          }))
                        }
                      />
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

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button
            onClick={() => {
              setIsModalVisible(false);
              setEditingOffer(null);
              setPolicyModalStep(0);
              form.resetFields();
            }}
            size="large"
          >
            Cancel
          </Button>
          <div className="flex space-x-3">
            <Button
              onClick={() =>
                setPolicyModalStep(Math.max(0, policyModalStep - 1))
              }
              disabled={policyModalStep === 0}
              size="large"
            >
              Previous
            </Button>
            {policyModalStep < 1 ? (
              <Button
                type="primary"
                onClick={() => {
                  setPolicyModalStep(Math.min(1, policyModalStep + 1));
                  handleFormData();
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
                className="bg-green-600 hover:bg-green-700"
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
