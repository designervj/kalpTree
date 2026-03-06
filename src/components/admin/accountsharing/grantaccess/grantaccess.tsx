"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Lock, ChevronDown, X } from "lucide-react";

type PermissionRole = "admin" | "collaborator";

interface ManagedWebsite {
  _id: string;
  name: string;
}

interface ManagedBusiness {
  _id: string;
  name: string;
}

interface ManagedService {
  managedBusiness: string;
  managedWebsites: string[];
}

interface GrantAccessFormData {
  email: string;
  role: PermissionRole;
  managedServices: ManagedService[];
  createdById: string;
  tenantId: string;
}

// Mock API calls - Replace with actual API endpoints
const fetchManagedBusinesses = async (
  user: any
): Promise<ManagedBusiness[]> => {
  const res = await fetch(`/api/tenants/${user.id}`);
  const tenants = await res.json();
  return tenants.item;
};

const fetchWebsitesForBusiness = async (
  businessId: string
): Promise<ManagedWebsite[]> => {
  const res = await fetch(`/api/websites/${businessId}`);
  const websites = await res.json();
  return websites.item;
};

export const GrantAccessComponent = ({ user }: any) => {
  const [formData, setFormData] = useState<GrantAccessFormData>({
    email: "",
    role: "admin",
    managedServices: [],
    createdById: user.id,
    tenantId: user.tenantId,
  });

  const [availableBusinesses, setAvailableBusinesses] = useState<
    ManagedBusiness[]
  >([]);
  const [selectedBusiness, setSelectedBusiness] = useState<string>("");
  const [availableWebsites, setAvailableWebsites] = useState<ManagedWebsite[]>(
    []
  );
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [loadingWebsites, setLoadingWebsites] = useState(false);
  const [showBusinessDropdown, setShowBusinessDropdown] = useState(false);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    setLoadingBusinesses(true);
    try {
      const businesses = await fetchManagedBusinesses(user);
      setAvailableBusinesses(businesses);
    } catch (error) {
      console.error("Error loading businesses:", error);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  const handleBusinessSelect = async (businessId: string) => {
    setSelectedBusiness(businessId);
    setSelectedWebsites([]);
    setShowBusinessDropdown(false);

    setLoadingWebsites(true);
    try {
      const websites = await fetchWebsitesForBusiness(businessId);
      setAvailableWebsites(websites);
    } catch (error) {
      console.error("Error loading websites:", error);
      setAvailableWebsites([]);
    } finally {
      setLoadingWebsites(false);
    }
  };

  const handleWebsiteToggle = (websiteId: string) => {
    setSelectedWebsites((prev) => {
      if (prev.includes(websiteId)) {
        return prev.filter((id) => id !== websiteId);
      } else {
        return [...prev, websiteId];
      }
    });
  };

  const handleAddManagedService = () => {
    if (!selectedBusiness || selectedWebsites.length === 0) {
      alert("Please select a business and at least one website");
      return;
    }

    // Check if business already exists in managed services
    const existingIndex = formData.managedServices.findIndex(
      (service) => service.managedBusiness === selectedBusiness
    );

    if (existingIndex !== -1) {
      // Update existing service
      const updated = [...formData.managedServices];
      updated[existingIndex] = {
        managedBusiness: selectedBusiness,
        managedWebsites: selectedWebsites,
      };
      setFormData((prev) => ({ ...prev, managedServices: updated }));
    } else {
      // Add new service
      setFormData((prev) => ({
        ...prev,
        managedServices: [
          ...prev.managedServices,
          {
            managedBusiness: selectedBusiness,
            managedWebsites: selectedWebsites,
          },
        ],
      }));
    }

    // Reset selections
    setSelectedBusiness("");
    setSelectedWebsites([]);
    setAvailableWebsites([]);
  };

  const handleRemoveManagedService = (businessId: string) => {
    setFormData((prev) => ({
      ...prev,
      managedServices: prev.managedServices.filter(
        (service) => service.managedBusiness !== businessId
      ),
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  };

  const handleRoleChange = (role: PermissionRole) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleGrantAccess = async () => {
    if (!formData.email) {
      alert("Please enter an email address");
      return;
    }
    console.log("Granting access:", formData);
    const res = await fetch(`/api/users/createwithemail`, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    console.log(res);
  };

  const getBusinessName = (businessId: string) => {
    return (
      availableBusinesses.find((b) => b._id === businessId)?.name || businessId
    );
  };

  const getWebsiteName = (websiteId: string) => {
    return (
      availableWebsites.find((w) => w._id === websiteId)?.name || websiteId
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Grant Access
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Invite another user to access your account. You can always remove them
          later.
        </p>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Who do you give access to?
            </label>
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleEmailChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Permission Roles */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Permission roles
            </label>

            {/* Admin Role */}
            <button
              onClick={() => handleRoleChange("admin")}
              className={`w-full p-4 rounded-lg border-2 mb-3 text-left transition-all ${formData.role === "admin"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${formData.role === "admin"
                      ? "border-purple-500"
                      : "border-gray-300"
                    }`}
                >
                  {formData.role === "admin" && (
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Admin</div>
                  <div className="text-sm text-gray-600">
                    Manage services and make purchases using added payment
                    method.
                  </div>
                </div>
              </div>
            </button>

            {/* Collaborator Role */}
            <button
              onClick={() => handleRoleChange("collaborator")}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${formData.role === "collaborator"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${formData.role === "collaborator"
                      ? "border-purple-500"
                      : "border-gray-300"
                    }`}
                >
                  {formData.role === "collaborator" && (
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Collaborator
                  </div>
                  <div className="text-sm text-gray-600">
                    Manage services.{" "}
                    <span className="font-semibold">Can't</span> make purchases.
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Managed Services */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Managed services
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Select services that will be allowed to manage.
            </p>

            {/* Business Dropdown */}
            <div className="relative mb-3">
              <button
                onClick={() => setShowBusinessDropdown(!showBusinessDropdown)}
                disabled={loadingBusinesses}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-left flex items-center justify-between bg-white hover:bg-gray-50"
              >
                <span
                  className={
                    selectedBusiness ? "text-gray-900" : "text-gray-500"
                  }
                >
                  {loadingBusinesses
                    ? "Loading businesses..."
                    : selectedBusiness
                      ? getBusinessName(selectedBusiness)
                      : "Select a business"}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>

              {showBusinessDropdown && !loadingBusinesses && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {availableBusinesses.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No businesses available
                    </div>
                  ) : (
                    availableBusinesses.map((business) => (
                      <button
                        key={business._id}
                        onClick={() => handleBusinessSelect(business._id)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 text-sm border-b border-gray-100 last:border-b-0"
                      >
                        {business.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Websites Selection */}
            {selectedBusiness && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select websites for {getBusinessName(selectedBusiness)}
                </label>
                {loadingWebsites ? (
                  <div className="text-sm text-gray-500 py-3">
                    Loading websites...
                  </div>
                ) : availableWebsites.length === 0 ? (
                  <div className="text-sm text-red-500 py-3">
                    No websites available for this business
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                    {availableWebsites.map((website) => (
                      <label
                        key={website._id}
                        className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded px-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedWebsites.includes(website._id)}
                          onChange={() => handleWebsiteToggle(website._id)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-900">
                          {website.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {selectedWebsites.length > 0 && (
                  <button
                    onClick={handleAddManagedService}
                    className="mt-3 w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Add to Managed Services
                  </button>
                )}
              </div>
            )}

            {/* Added Managed Services List */}
            {formData.managedServices.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Added Services ({formData.managedServices.length})
                </div>
                {formData.managedServices.map((service) => (
                  <div
                    key={service.managedBusiness}
                    className="bg-purple-50 border border-purple-200 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm mb-1">
                          {getBusinessName(service.managedBusiness)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {service.managedWebsites.length} website(s) selected
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveManagedService(service.managedBusiness)
                        }
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.managedServices.length === 0 && !selectedBusiness && (
              <>
                <p className="text-sm text-red-500 mb-4">
                  You don't have any services that are eligible to manage
                </p>

                <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg">
                  <Lock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Single website access is available for websites on the
                    Agency plan.{" "}
                    <a
                      href="#"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Get a plan
                    </a>{" "}
                    for more powerful features.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Grant Access Button */}
          <button
            onClick={handleGrantAccess}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Grant access
          </button>
        </div>
      </div>
    </div>
  );
};
