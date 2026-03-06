"use client";

import React, { useState } from "react";
import { Upload, Edit2, Trash2, Plus, X, Save } from "lucide-react";

export default function LogoManager() {
  type LogoSettings = {
    width: number;
    height: number;
    opacity: number;
    rotation: number;
    borderRadius: number;
    text: string;
    textPosition: string;
    textSize: number;
    textColor: string;
    backgroundColor: string;
    padding: number;
    shadow: number;
  };

  type Logo = {
    id: number;
    name: string;
    file: string;
    size: string;
    uploadDate: string;
    preview: string;
    settings?: LogoSettings;
  };

  const [logos, setLogos] = useState<Logo[]>([
    {
      id: 1,
      name: "Primary Logo",
      file: "logo-primary.png",
      size: "150x50",
      uploadDate: "2025-01-15",
      preview:
        'data:image/svg+xml,%3Csvg width="150" height="50" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="150" height="50" fill="%234F46E5"/%3E%3Ctext x="75" y="30" font-family="Arial" font-size="16" fill="white" text-anchor="middle"%3ELOGO%3C/text%3E%3C/svg%3E',
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | ArrayBuffer | null>(null);
  const [logoName, setLogoName] = useState("");

  // Customization options
  const [logoWidth, setLogoWidth] = useState(150);
  const [logoHeight, setLogoHeight] = useState(50);
  const [logoOpacity, setLogoOpacity] = useState(100);
  const [logoRotation, setLogoRotation] = useState(0);
  const [borderRadius, setBorderRadius] = useState(0);
  const [addText, setAddText] = useState(false);
  const [logoText, setLogoText] = useState("");
  const [textPosition, setTextPosition] = useState("bottom");
  const [textSize, setTextSize] = useState(16);
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [padding, setPadding] = useState(0);
  const [shadow, setShadow] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setUploadPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCustomization = () => {
    setLogoWidth(150);
    setLogoHeight(50);
    setLogoOpacity(100);
    setLogoRotation(0);
    setBorderRadius(0);
    setAddText(false);
    setLogoText("");
    setTextPosition("bottom");
    setTextSize(16);
    setTextColor("#000000");
    setBackgroundColor("transparent");
    setPadding(0);
    setShadow(0);
  };

  const handleUpload = () => {
    if (uploadPreview && logoName && typeof uploadPreview === "string") {
      const newLogo: Logo = {
        id: logos.length + 1,
        name: logoName,
        file: logoName.toLowerCase().replace(/\s+/g, "-") + ".png",
        size: `${logoWidth}x${logoHeight}`,
        uploadDate: new Date().toISOString().split("T")[0],
        preview: uploadPreview,
        settings: {
          width: logoWidth,
          height: logoHeight,
          opacity: logoOpacity,
          rotation: logoRotation,
          borderRadius,
          text: addText ? logoText : "",
          textPosition,
          textSize,
          textColor,
          backgroundColor,
          padding,
          shadow,
        },
      };
      setLogos([...logos, newLogo]);
      setShowUploadModal(false);
      setUploadPreview(null);
      setLogoName("");
      resetCustomization();
    }
  };

  const handleCustomize = (logo: Logo) => {
    setSelectedLogo(logo);
    if (logo.settings) {
      setLogoWidth(logo.settings.width);
      setLogoHeight(logo.settings.height);
      setLogoOpacity(logo.settings.opacity);
      setLogoRotation(logo.settings.rotation);
      setBorderRadius(logo.settings.borderRadius);
      setAddText(!!logo.settings.text);
      setLogoText(logo.settings.text || "");
      setTextPosition(logo.settings.textPosition);
      setTextSize(logo.settings.textSize);
      setTextColor(logo.settings.textColor);
      setBackgroundColor(logo.settings.backgroundColor);
      setPadding(logo.settings.padding);
      setShadow(logo.settings.shadow);
    } else {
      setLogoWidth(parseInt(logo.size.split("x")[0]));
      setLogoHeight(parseInt(logo.size.split("x")[1]));
      resetCustomization();
    }
    setShowCustomizeModal(true);
  };

  const handleSaveCustomization = () => {
    if (selectedLogo) {
      const updatedLogos = logos.map((logo) =>
        logo.id === (selectedLogo as Logo).id
          ? {
            ...logo,
            size: `${logoWidth}x${logoHeight}`,
            settings: {
              width: logoWidth,
              height: logoHeight,
              opacity: logoOpacity,
              rotation: logoRotation,
              borderRadius,
              text: addText ? logoText : "",
              textPosition,
              textSize,
              textColor,
              backgroundColor,
              padding,
              shadow,
            },
          }
          : logo
      );
      setLogos(updatedLogos);
      setShowCustomizeModal(false);
      setSelectedLogo(null);
      resetCustomization();
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this logo?")) {
      setLogos(logos.filter((logo) => logo.id !== id));
    }
  };

  const renderLogoPreview = (logo: Logo, settings?: LogoSettings) => {
    const logoSettings: LogoSettings = settings || logo.settings || {
      width: 150,
      height: 50,
      opacity: 100,
      rotation: 0,
      borderRadius: 0,
      text: "",
      textPosition: "bottom",
      textSize: 16,
      textColor: "#000000",
      backgroundColor: "transparent",
      padding: 0,
      shadow: 0,
    };
    const containerStyle = {
      backgroundColor: logoSettings.backgroundColor || "transparent",
      padding: `${logoSettings.padding || 0}px`,
      borderRadius: `${logoSettings.borderRadius || 0}px`,
      boxShadow: logoSettings.shadow
        ? `0 ${logoSettings.shadow}px ${logoSettings.shadow * 2
        }px rgba(0,0,0,0.1)`
        : "none",
      display: "inline-flex",
      flexDirection:
        logoSettings.textPosition === "bottom" ||
          logoSettings.textPosition === "top"
          ? "column" as const
          : "row" as const,
      alignItems: "center",
      gap: "8px",
    };

    const imgStyle = {
      width: `${logoSettings.width || 150}px`,
      height: `${logoSettings.height || 50}px`,
      opacity: (logoSettings.opacity || 100) / 100,
      transform: `rotate(${logoSettings.rotation || 0}deg)`,
      objectFit: "contain" as const,
    };

    const textStyle = {
      fontSize: `${logoSettings.textSize || 16}px`,
      color: logoSettings.textColor || "#000000",
      fontWeight: "600",
      margin: 0,
    };

    const textElement = logoSettings.text && (
      <p style={textStyle}>{logoSettings.text}</p>
    );

    return (
      <div style={containerStyle}>
        {logoSettings.textPosition === "top" && textElement}
        {logoSettings.textPosition === "left" && textElement}
        <img src={logo.preview} alt={logo.name} style={imgStyle} />
        {logoSettings.textPosition === "right" && textElement}
        {logoSettings.textPosition === "bottom" && textElement}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-3 pt-1">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Logo Management
              </h1>
              <p className="text-gray-600 mt-1">
                Upload and customize your brand logos
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Upload Logo
            </button>
          </div>
        </div>

        {/* Logos Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dimensions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logos.map((logo) => (
                <tr
                  key={logo.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      {renderLogoPreview(logo)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {logo.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {logo.file}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {logo.size}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {logo.uploadDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCustomize(logo)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Customize"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(logo.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {logos.length === 0 && (
            <div className="text-center py-12">
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No logos uploaded yet</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Upload your first logo
              </button>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Upload New Logo
                </h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left side - Upload */}
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Name
                      </label>
                      <input
                        type="text"
                        value={logoName}
                        onChange={(e) => setLogoName(e.target.value)}
                        placeholder="e.g., Primary Logo"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload File
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer">
                          {uploadPreview ? (
                            <div>
                              <div className="flex items-center justify-center mb-4">
                                {typeof uploadPreview === "string" &&
                                  renderLogoPreview(
                                    { preview: uploadPreview, name: logoName, id: 0, file: "", size: "", uploadDate: "" },
                                    {
                                      width: logoWidth,
                                      height: logoHeight,
                                      opacity: logoOpacity,
                                      rotation: logoRotation,
                                      borderRadius,
                                      text: addText ? logoText : "",
                                      textPosition,
                                      textSize,
                                      textColor,
                                      backgroundColor,
                                      padding,
                                      shadow,
                                    }
                                  )}
                              </div>
                              <p className="text-sm text-gray-600">
                                Click to change file
                              </p>
                            </div>
                          ) : (
                            <div>
                              <Upload
                                size={48}
                                className="mx-auto text-gray-400 mb-4"
                              />
                              <p className="text-gray-600 mb-2">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-sm text-gray-500">
                                PNG, JPG, SVG up to 10MB
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Customization */}
                  <div className="border-l border-gray-200 pl-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                      Customize Logo
                    </h3>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Width: {logoWidth}px
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="400"
                          value={logoWidth}
                          onChange={(e) =>
                            setLogoWidth(parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Height: {logoHeight}px
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="400"
                          value={logoHeight}
                          onChange={(e) =>
                            setLogoHeight(parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Border Radius: {borderRadius}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={borderRadius}
                          onChange={(e) =>
                            setBorderRadius(parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Padding: {padding}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={padding}
                          onChange={(e) => setPadding(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Shadow: {shadow}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={shadow}
                          onChange={(e) => setShadow(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Background Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={
                              backgroundColor === "transparent"
                                ? "#ffffff"
                                : backgroundColor
                            }
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            placeholder="transparent"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Opacity: {logoOpacity}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={logoOpacity}
                          onChange={(e) =>
                            setLogoOpacity(parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Rotation: {logoRotation}°
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={logoRotation}
                          onChange={(e) =>
                            setLogoRotation(parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <input
                            type="checkbox"
                            id="add-text-upload"
                            checked={addText}
                            onChange={(e) => setAddText(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <label
                            htmlFor="add-text-upload"
                            className="text-sm font-medium text-gray-700"
                          >
                            Add Text to Logo
                          </label>
                        </div>

                        {addText && (
                          <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                            <div>
                              <label className="block text-sm text-gray-600 mb-2">
                                Text
                              </label>
                              <input
                                type="text"
                                value={logoText}
                                onChange={(e) => setLogoText(e.target.value)}
                                placeholder="Enter logo text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-sm text-gray-600 mb-2">
                                Text Position
                              </label>
                              <select
                                value={textPosition}
                                onChange={(e) =>
                                  setTextPosition(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm text-gray-600 mb-2">
                                Text Size: {textSize}px
                              </label>
                              <input
                                type="range"
                                min="10"
                                max="48"
                                value={textSize}
                                onChange={(e) =>
                                  setTextSize(parseInt(e.target.value))
                                }
                                className="w-full"
                              />
                            </div>

                            <div>
                              <label className="block text-sm text-gray-600 mb-2">
                                Text Color
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={textColor}
                                  onChange={(e) => setTextColor(e.target.value)}
                                  className="w-12 h-10 rounded border border-gray-300"
                                />
                                <input
                                  type="text"
                                  value={textColor}
                                  onChange={(e) => setTextColor(e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadPreview(null);
                      setLogoName("");
                      resetCustomization();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!uploadPreview || !logoName}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Upload Logo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customize Modal */}
        {showCustomizeModal && selectedLogo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Customize Logo
                </h2>
                <button
                  onClick={() => {
                    setShowCustomizeModal(false);
                    setSelectedLogo(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                      Preview
                    </h3>
                    <div className="border border-gray-200 rounded-lg p-8 bg-gray-50 flex items-center justify-center min-h-[400px]">
                      {renderLogoPreview(selectedLogo, {
                        width: logoWidth,
                        height: logoHeight,
                        opacity: logoOpacity,
                        rotation: logoRotation,
                        borderRadius,
                        text: addText ? logoText : "",
                        textPosition,
                        textSize,
                        textColor,
                        backgroundColor,
                        padding,
                        shadow,
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                      Settings
                    </h3>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Width: {logoWidth}px
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="500"
                          value={logoWidth}
                          onChange={(e) =>
                            setLogoWidth(parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Height: {logoHeight}px
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="500"
                          value={logoHeight}
                          onChange={(e) =>
                            setLogoHeight(parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Border Radius: {borderRadius}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={borderRadius}
                          onChange={(e) =>
                            setBorderRadius(parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Padding: {padding}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={padding}
                          onChange={(e) => setPadding(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Shadow: {shadow}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={shadow}
                          onChange={(e) => setShadow(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Background Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={
                              backgroundColor === "transparent"
                                ? "#ffffff"
                                : backgroundColor
                            }
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            placeholder="transparent"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Opacity: {logoOpacity}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={logoOpacity}
                          onChange={(e) =>
                            setLogoOpacity(parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Rotation: {logoRotation}°
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={logoRotation}
                          onChange={(e) =>
                            setLogoRotation(parseInt(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <input
                            type="checkbox"
                            id="add-text-customize"
                            checked={addText}
                            onChange={(e) => setAddText(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <label
                            htmlFor="add-text-customize"
                            className="text-sm font-medium text-gray-700"
                          >
                            Add Text to Logo
                          </label>
                        </div>

                        {addText && (
                          <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                            <div>
                              <label className="block text-sm text-gray-600 mb-2">
                                Text
                              </label>
                              <input
                                type="text"
                                value={logoText}
                                onChange={(e) => setLogoText(e.target.value)}
                                placeholder="Enter logo text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-sm text-gray-600 mb-2">
                                Text Position
                              </label>
                              <select
                                value={textPosition}
                                onChange={(e) =>
                                  setTextPosition(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm text-gray-600 mb-2">
                                Text Size: {textSize}px
                              </label>
                              <input
                                type="range"
                                min="10"
                                max="48"
                                value={textSize}
                                onChange={(e) =>
                                  setTextSize(parseInt(e.target.value))
                                }
                                className="w-full"
                              />
                            </div>

                            <div>
                              <label className="block text-sm text-gray-600 mb-2">
                                Text Color
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={textColor}
                                  onChange={(e) => setTextColor(e.target.value)}
                                  className="w-12 h-10 rounded border border-gray-300"
                                />
                                <input
                                  type="text"
                                  value={textColor}
                                  onChange={(e) => setTextColor(e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCustomizeModal(false);
                    setSelectedLogo(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustomization}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
