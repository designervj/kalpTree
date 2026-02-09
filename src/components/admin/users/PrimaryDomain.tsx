import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

interface PrimaryDomainsProps {
  formData: any;
  handleInputChange: (e: any) => void;
}

export function PrimaryDomains({
  formData,
  handleInputChange,
}: PrimaryDomainsProps) {
  const [domainType, setDomainType] = useState<"subdomain" | "own">(
    "subdomain",
  );
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState("");

  const baseDomain = "kalptree.xyz";
  const primaryDomains = formData?.businessdetails?.primary_domain || [];

  // Validate domain format
  const validateDomain = (domain: string): boolean => {
    // Basic domain regex pattern
    const domainPattern =
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainPattern.test(domain);
  };

  const handleDomainTypeChange = (type: "subdomain" | "own") => {
    setDomainType(type);
    setInputValue("");
    setValidationError("");
  };

  const handleAddDomain = () => {
    setValidationError("");

    if (!inputValue.trim()) {
      setValidationError("Please enter a domain");
      return;
    }

    let finalDomain = "";

    if (domainType === "subdomain") {
      // Remove .kalptree.xyz or any domain extension if user added it
      let cleanInput = inputValue.trim();

      // Remove .kalptree.xyz if present
      cleanInput = cleanInput.replace(`.${baseDomain}`, "");

      // Remove any other domain extension (anything after last dot)
      cleanInput = cleanInput.split(".")[0];

      // Validate subdomain format (alphanumeric and hyphens only)
      const subdomainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
      if (!subdomainPattern.test(cleanInput)) {
        setValidationError(
          "Subdomain can only contain letters, numbers, and hyphens",
        );
        return;
      }

      finalDomain = `${cleanInput}.${baseDomain}`;
    } else {
      // For own domain, validate full domain format
      const trimmedDomain = inputValue.trim();

      if (!validateDomain(trimmedDomain)) {
        setValidationError(
          "Please enter a valid domain (e.g., www.yourdomain.com)",
        );
        return;
      }

      finalDomain = trimmedDomain;
    }

    // Check if domain already exists
    if (primaryDomains.includes(finalDomain)) {
      setValidationError("This domain is already added");
      return;
    }

    // Add to array
    const updatedDomains = [...primaryDomains, finalDomain];

    handleInputChange({
      target: {
        name: "businessdetails.primary_domain",
        value: updatedDomains,
      },
    });

    setInputValue("");
  };

  const handleRemoveDomain = (domain: string) => {
    const updatedDomains = primaryDomains.filter((d: string) => d !== domain);

    handleInputChange({
      target: {
        name: "businessdetails.primary_domain",
        value: updatedDomains,
      },
    });
  };

  const getPlaceholder = () => {
    if (domainType === "subdomain") {
      return "yoursite";
    }
    return "www.yourdomain.com";
  };

  const getDisplaySuffix = () => {
    if (domainType === "subdomain") {
      return `.${baseDomain}`;
    }
    return "";
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Primary Domains <span className="text-red-500">*</span>
        </label>

        {/* Subdomain Option */}
        <div
          onClick={() => handleDomainTypeChange("subdomain")}
          className={`mb-3 cursor-pointer rounded-xl border-2 p-4 transition-all ${
            domainType === "subdomain"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              checked={domainType === "subdomain"}
              onChange={() => handleDomainTypeChange("subdomain")}
              className="mt-0.5 h-4 w-4 cursor-pointer accent-blue-600"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Subdomain</div>
              <div className="mt-1 text-sm text-gray-600">
                yoursite.{baseDomain}
              </div>
            </div>
          </div>
        </div>

        {/* Own Domain Option */}
        <div
          onClick={() => handleDomainTypeChange("own")}
          className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
            domainType === "own"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="radio"
              checked={domainType === "own"}
              onChange={() => handleDomainTypeChange("own")}
              className="mt-0.5 h-4 w-4 cursor-pointer accent-blue-600"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Own Domain</div>
              <div className="mt-1 text-sm text-gray-600">
                www.yourdomain.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Domain Input */}
      <div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setValidationError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddDomain();
              }
            }}
            placeholder={getPlaceholder()}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
              validationError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
            }`}
          />
          {domainType === "subdomain" && (
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {getDisplaySuffix()}
            </span>
          )}
          <button
            type="button"
            onClick={handleAddDomain}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            + Add
          </button>
        </div>

        {validationError && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Added Domains List */}
      {primaryDomains.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Added Domains:
          </label>
          {primaryDomains.map((domain: string) => (
            <div
              key={domain}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-blue-50 px-4 py-3"
            >
              <span className="text-sm font-medium text-gray-900">
                {domain}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveDomain(domain)}
                className="text-gray-500 hover:text-red-600 transition-colors"
                aria-label="Remove domain"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
