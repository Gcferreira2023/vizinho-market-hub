
import { useState } from "react";

export const useListingOperations = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return {
    isLoading,
    isSaving,
    isDeleting,
    setIsLoading,
    setIsSaving,
    setIsDeleting
  };
};
