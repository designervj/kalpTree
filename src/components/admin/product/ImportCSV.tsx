import React, { useState } from "react";
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { CSVProcessing } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";

export const CSVImportModal = ({ isOpen, onClose, onImport }: any) => {
  const [file, setFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [successCount, setSuccessCount] = useState(0);

  const handleFileChange = async (e: any) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    if (!selectedFile) return;

    if (
      !selectedFile.name.endsWith(".csv") &&
      !selectedFile.name.endsWith(".json")
    ) {
      setErrors(["Please select a valid CSV or JSON file"]);
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    setErrors([]);
    setPreviewData([]);

    // Simulate file processing
    try {
      if (selectedFile.name.endsWith(".json")) {
        const text = await selectedFile.text();
        setPreviewData(JSON.parse(text));
        setIsUploading(false);
      } else {
        const Papa = await import("papaparse");

        Papa.parse(selectedFile, {
          header: true,
          skipEmptyLines: true,
          complete: (result: any) => {
            const cleanedData = result.data.map((row: Record<string, any>) => {
              return Object.fromEntries(
                Object.entries(row).filter(
                  ([_, value]) =>
                    value !== "" && value !== null && value !== undefined,
                ),
              );
            });

            let finalProduct = CSVProcessing(cleanedData);
            console.log(finalProduct);
            setPreviewData(finalProduct);
            setIsUploading(false);
          },
          error: (error) => {
            setErrors([`Failed to parse CSV: ${error.message}`]);
            setIsUploading(false);
          },
        });
      }
    } catch (err) {
      setErrors(["Failed to process file"]);
      setIsUploading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    setErrors([]);
    setSuccessCount(0);

    try {
      const t = await onImport(previewData);
      if (t) {
        setFile(null);
        setPreviewData([]);
        setErrors([]);
      } else {
        setErrors(["Error"]);
      }
    } catch (err) {
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

  const handleDownloadCSV = (type: string) => {
    if (type == "json") {
      const fileUrl = "/sample.json";
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "sample.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const fileUrl = "/samplecsv.csv";
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "samplecsv.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
              <h2 className="text-xl font-semibold text-gray-900">
                Import CSV
              </h2>
              <p className="text-sm text-gray-500">
                Upload and import your product data
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isImporting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* File Upload Area */}
          {!file && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".csv, .json"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
                disabled={isUploading}
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Choose a CSV file to upload
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or drag and drop it here
                </p>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => document.getElementById("csv-upload")!.click()}
                >
                  Select File
                </button>
              </label>
            </div>
          )}

          {/* Uploading State */}
          {isUploading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Processing CSV file...</p>
            </div>
          )}

          {/* File Info & Preview */}
          {file && !isUploading && (
            <div className="space-y-6">
              {/* File Info */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {file && file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                {!isImporting && (
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreviewData([]);
                      setErrors([]);
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {previewData.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Preview (First 5 rows)
                  </h3>
                  <div className="border rounded-lg overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          {Object.keys(previewData[0]).map((key) => (
                            <th
                              key={key}
                              className="px-4 py-3 text-left font-medium text-gray-900 capitalize"
                            >
                              {key.replace(/_/g, " ")}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {previewData.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            {Object.entries(row).map(([key, value], i) => (
                              <td
                                key={i}
                                className="px-4 py-3 text-gray-600 max-w-xs"
                              >
                                {typeof value === "object" && value !== null
                                  ? Array.isArray(value)
                                    ? `[${value.length} items]`
                                    : `{${Object.keys(value).length} fields}`
                                  : String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Complex fields (options, variants) are shown as summaries.
                    Full data will be imported.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-900 mb-1">Import Errors</p>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Success */}
          {successCount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Import Successful!</p>
                <p className="text-sm text-green-700">
                  Successfully imported {successCount} records
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {previewData.length > 0 && !successCount && (
              <span>Ready to import {previewData.length}+ records</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isImporting}
              onClick={() => handleDownloadCSV("csv")}
            >
              Download Sample CSV
            </button>
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isImporting}
              onClick={() => handleDownloadCSV("json")}
            >
              Download Sample JSON
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isImporting}
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!file || isImporting || isUploading || successCount > 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Import to Database"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
