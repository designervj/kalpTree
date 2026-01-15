"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalProps {
  open: boolean;
  business: any;
  onClose: () => void;
  type: string | null;
  businesswebsites: any;
}

export const BusinessModal = ({
  open,
  business,
  businesswebsites,
  onClose,
  type,
}: ModalProps) => {
  const [formData, setFormData] = React.useState<any>(null);
  React.useEffect(() => {
    if (!business || !open) return;

    // RESET when type changes
    setFormData(null);

    if (type === "business") {
      setFormData({
        name: business.name || "",
        email: business.email || "",
        plan: business.plan || "trial",
        status: business.status || "active",
        branding: {
          primary: business?.branding?.colors?.primary || "#3b82f6",
          secondary: business?.branding?.colors?.secondary || "#f4e04f",
        },
        features: {
          websiteEnabled: business?.features?.websiteEnabled ?? false,
          ecommerceEnabled: business?.features?.ecommerceEnabled ?? false,
          blogEnabled: business?.features?.blogEnabled ?? false,
          invoicesEnabled: business?.features?.invoicesEnabled ?? false,
        },
      });
    } else if (type == "createwebsite") {
      setFormData({
        name: "",
        primaryDomain: [],
        _id: "",
        status: "",
        systemSubdomain: "",
        serviceType: "",
      });
    } else {
      const website = businesswebsites?.find((d: any) => d._id === type);
      if (website) {
        setFormData({
          name: website.name || "",
          primaryDomain: website.primaryDomain || [],
          _id: website._id || "",
          status: website.status || "",
          systemSubdomain: website.systemSubdomain || "",
          serviceType: website.serviceType || "",
        });
      }
    }

    () => setFormData({});
  }, [business, open, businesswebsites, type]);

  if (!formData) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const toggleFeature = (key: string) => {
    setFormData((prev: any) => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: !prev.features[key],
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      let url = "";
      let res;
      if (type == "business") {
        url = `/api/admin/business/${business._id}`;
        const req = await fetch(url, {
          method: "PUT",
          body: JSON.stringify(formData),
        });

        res = await req.json();
      } else {
        console.log("Iam Running");
        url = `/api/domain/${type}`;
        const req = await fetch(url, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        res = await req.json();
      }

      if (res.success) {
        setFormData(null);
        onClose();
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Edit Business</DialogTitle>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button> */}
        </DialogHeader>

        {/* FORM */}
        {type == "business" ? (
          <BusinessForm
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            toggleFeature={toggleFeature}
          />
        ) : (
          <WebsiteForm
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
          />
        )}
        {/* FOOTER */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const BusinessForm = ({
  formData,
  handleChange,
  setFormData,
  toggleFeature,
}: any) => {
  return (
    <div className="space-y-5">
      {/* Name */}
      <div>
        <label className="text-sm font-medium">Business Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2"
        />
      </div>

      {/* Plan & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Plan</label>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-4 py-2"
          >
            <option value="trial">Trial</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="agency">Agency</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-4 py-2"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Branding */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Primary Color</label>
          <input
            type="color"
            value={formData.branding.primary}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                branding: {
                  ...prev.branding,
                  primary: e.target.value,
                },
              }))
            }
            className="mt-1 h-10 w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Secondary Color</label>
          <input
            type="color"
            value={formData.branding.secondary}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                branding: {
                  ...prev.branding,
                  secondary: e.target.value,
                },
              }))
            }
            className="mt-1 h-10 w-full"
          />
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="text-sm font-medium mb-2 block">Features</label>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(formData.features).map((key) => (
            <Button
              key={key}
              type="button"
              variant={formData.features[key] ? "default" : "outline"}
              onClick={() => toggleFeature(key)}
              className="rounded-xl"
            >
              {key.replace("Enabled", "")}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const WebsiteForm = ({ formData, handleChange, setFormData }: any) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Website Name */}
      <div className="col-span-2">
        <label className="text-sm font-medium">Website Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2"
        />
      </div>

      {/* Service Type */}
      <div>
        <label className="text-sm font-medium">Service Type</label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2"
        >
          <option value="ECOMMERCE">E-Commerce</option>
          <option value="WEBSITE">Website</option>
          <option value="BLOG">Blog</option>
          <option value="WEBSITE_CATALOGUE_ECOMMERCE_MARKETING">
            Website + Catalogue + Ecommercd + Marketing
          </option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="text-sm font-medium">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 w-full rounded-xl border px-4 py-2"
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* System Subdomain */}
      <div className="col-span-2">
        <label className="text-sm font-medium">System Subdomain</label>
        <input
          name="systemSubdomain"
          value={formData.systemSubdomain}
          onChange={handleChange}
          placeholder="example"
          className="mt-1 w-full rounded-xl border px-4 py-2"
        />
      </div>

      {/* Primary Domains */}
      {/* Primary Domains */}
      <div className="col-span-2">
        <label className="text-sm font-medium mb-2 block">
          Primary Domains
        </label>

        <div className="grid grid-cols-2 gap-3">
          {formData.primaryDomain.map((domain: string, index: number) => (
            <div key={index} className="flex gap-1">
              <input
                value={domain}
                onChange={(e) => {
                  const updated = [...formData.primaryDomain];
                  updated[index] = e.target.value;
                  setFormData((prev: any) => ({
                    ...prev,
                    primaryDomain: updated,
                  }));
                }}
                className="flex-1 rounded-xl border px-4 py-2"
              />
              <button
                type="button"
                onClick={() => {
                  setFormData((prev: any) => ({
                    ...prev,
                    primaryDomain: prev.primaryDomain.filter(
                      (_: string, i: number) => i !== index
                    ),
                  }));
                }}
                className="text-red-500 hover:bg-red-50"
              >
                ✕
              </button>
              {/* Remove Button */}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-3 rounded-xl"
          onClick={() =>
            setFormData((prev: any) => ({
              ...prev,
              primaryDomain: [...prev.primaryDomain, ""],
            }))
          }
        >
          + Add Domain
        </Button>
      </div>
    </div>
  );
};
