import React, { useState } from "react";
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const JSONImportModal = ({ isOpen, onClose, onImport, type }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".json")) {
      setErrors(["Please select a valid JSON file"]);
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    setErrors([]);
    setPreviewData([]);

    try {
      const text = await selectedFile.text();
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        setErrors(["JSON file must contain an array of objects"]);
      } else {
        setPreviewData(parsed);
      }
    } catch {
      setErrors(["Invalid JSON file"]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    setErrors([]);

    try {
      const success = await onImport(previewData);
      if (success) {
        setSuccessCount(previewData.length);
        setFile(null);
        setPreviewData([]);
      } else {
        setErrors(["Import failed"]);
      }
    } catch {
      setErrors(["Failed to import data"]);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setErrors([]);
    setSuccessCount(0);
    setIsUploading(false);
    setIsImporting(false);
    onClose();
  };

  const handleDownloadJSON = () => {
    const link = document.createElement("a");
    console.log(type)
    if (type == "attribute") {
      link.href = "/sampleatttibute.json";
      link.download = "attribute.json";
    } else if (type == "industry-type") {
      link.href = "/sampleproducttypecategory.json";
      link.download = "producttypecategory.json";
    } else if (type == "product-type") {
      link.href = "/sampleproducttype.json";
      link.download = "producttype.json";
    } else if (type == "businesstype") {
      link.href = "/buisnesstype.json";
      link.download = "buisnesstype.json";
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Import JSON</h2>
              <p className="text-sm text-gray-500">
                Upload and import your product data
              </p>
            </div>
          </div>
          <button onClick={handleClose} disabled={isImporting}>
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!file && (
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="json-upload"
              />
              <label htmlFor="json-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="font-medium mb-2">Choose a JSON file</p>
                <p className="text-sm text-gray-500 mb-4">
                  Only .json files are supported
                </p>
                <Button
                  onClick={() =>
                    document.getElementById("json-upload")!.click()
                  }
                >
                  Select File
                </Button>
              </label>
            </div>
          )}

          {isUploading && (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
              <p>Processing JSON...</p>
            </div>
          )}

          {file && !isUploading && previewData.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">
                Preview (First 5 records)
              </h3>
              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(previewData[0]).map((key) => (
                        <th key={key} className="px-4 py-2 text-left">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="border-t">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-4 py-2">
                            {typeof val === "object"
                              ? JSON.stringify(val)
                              : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="bg-red-50 border rounded-lg p-4 mt-4 flex gap-2">
              <AlertCircle className="text-red-600" />
              <ul className="text-red-700 text-sm">
                {errors.map((e, i) => (
                  <li key={i}>• {e}</li>
                ))}
              </ul>
            </div>
          )}

          {successCount > 0 && (
            <div className="bg-green-50 border rounded-lg p-4 mt-4 flex gap-2">
              <CheckCircle className="text-green-600" />
              <p className="text-green-700">
                Successfully imported {successCount} records
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex justify-between">
          <Button variant="outline" onClick={handleDownloadJSON}>
            Download Sample JSON
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!previewData.length || isImporting}
            >
              {isImporting ? "Importing..." : "Import to Database"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
