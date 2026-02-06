"use client";

import { JSONImportModal } from "@/components/admin/product/ImportData";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "sonner";

const EntityModalForImport = ({ type }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const obj: any = {
    "product-type": "Product Type",
    "industry-type": "Industry Type",
    attribute: "Attributes",
    businesstype: "Business Type",
  };

  const handleImport = async (data: any) => {
    console.log(type, data);
    try {
      const res = await fetch(`/api/admin/bulk?type=${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Product has been Created");
        return true;
      } else {
        toast.error("Error in Product Creation");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Import {obj[type]}</Button>

      <JSONImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={handleImport}
        type={type}
      />
    </>
  );
};

export default EntityModalForImport;
