
import { useState } from "react";
import { EditListingFormData } from "@/types/listing";

export const useListingForm = (initialData: EditListingFormData) => {
  const [formData, setFormData] = useState<EditListingFormData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSelectChange,
    handleCheckboxChange
  };
};
