import { useState, useEffect } from "react";
import { FormInstance } from "antd";
import dayjs from "dayjs";

interface ModalLogicProps {
  editingData?: any;
  isModalVisible: boolean;
  form: FormInstance;
}

export const useModalLogic = ({
  editingData,
  isModalVisible,
  form,
}: ModalLogicProps) => {
  const [formValues, setFormValues] = useState<any>({});
  const [policyModalStep, setPolicyModalStep] = useState(0);

  const handleFormData = () => {
    setFormValues((prev: any) => ({ ...prev, ...form.getFieldsValue() }));
  };

  useEffect(() => {
    setFormValues(
      editingData && Object.keys(editingData).length
        ? {
            ...editingData,
            startDate: dayjs(editingData?.startDate),
            endDate: dayjs(editingData?.endDate),
            validFrom: dayjs(editingData?.validFrom),
            validTo: dayjs(editingData?.validTo),
            blackoutStartDate: dayjs(editingData?.blackoutStartDate),
            blackoutEndDate: dayjs(editingData?.blackoutEndDate),
            blackoutDates: dayjs(editingData?.blackoutDates),
          }
        : {},
    );
  }, [editingData]);

  useEffect(() => {
    if (!isModalVisible) {
      setFormValues({});
      form.resetFields();
      setPolicyModalStep(0);
    }
  }, [isModalVisible, form]);

  useEffect(() => {
    form.setFieldsValue(formValues);
  }, [formValues, form]);

  return {
    formValues,
    setFormValues,
    policyModalStep,
    setPolicyModalStep,
    handleFormData,
  };
};
