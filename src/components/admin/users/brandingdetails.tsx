import { Palette, Upload } from "lucide-react";

export const Brandingdetails = ({
  logoPreview,
  handleInputChange,
  formData,
}: any) => {
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-100 p-6 rounded-xl border border-indigo-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-indigo-600" />
          Logo Upload
        </h3>
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <label className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-indigo-400 transition-all bg-white text-center">
                {logoPreview ? (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-h-32 rounded-lg"
                    />
                    <p className="text-sm text-gray-600">
                      Click to change logo
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Click to upload logo
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, SVG up to 5MB
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-6 rounded-xl border border-pink-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-pink-600" />
          Color Palette
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="branding.primary_color"
                value={formData?.branding?.primary_color}
                onChange={handleInputChange}
                className="w-16 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
              />
              <input
                type="text"
                value={formData ?.branding?.primary_color}
                onChange={(e) =>
                  handleInputChange({
                    target: {
                      name: "branding.primary_color",
                      value: e.target.value,
                    },
                  })
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="branding.secondary_color"
                value={formData?.branding?.secondary_color}
                onChange={handleInputChange}
                className="w-16 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
              />
              <input
                type="text"
                value={formData?.branding?.secondary_color}
                onChange={(e) =>
                  handleInputChange({
                    target: {
                      name: "branding.secondary_color",
                      value: e.target.value,
                    },
                  })
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tertiary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="branding.tertiary_color"
                value={formData?.branding?.tertiary_color}
                onChange={handleInputChange}
                className="w-16 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
              />
              <input
                type="text"
                value={formData?.branding?.tertiary_color}
                onChange={(e) =>
                  handleInputChange({
                    target: {
                      name: "branding.tertiary_color",
                      value: e.target.value,
                    },
                  })
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Color Preview
          </p>
          <div className="flex gap-4">
            <div
              className="flex-1 h-20 rounded-lg shadow-md transition-all hover:scale-105"
              style={{ backgroundColor: formData?.branding?.primary_color }}
            />
            <div
              className="flex-1 h-20 rounded-lg shadow-md transition-all hover:scale-105"
              style={{ backgroundColor: formData?.branding?.secondary_color }}
            />
            <div
              className="flex-1 h-20 rounded-lg shadow-md transition-all hover:scale-105"
              style={{ backgroundColor: formData?.branding?.tertiary_color }}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-4">Typography</h3>
        <div className="space-y-3">
          {[
            "Inter",
            "Roboto",
            "Poppins",
            "Montserrat",
            "Open Sans",
            "Lato",
          ].map((font) => (
            <label
              key={font}
              className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData?.branding?.typography === font
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="branding.typography"
                value={font}
                checked={formData.branding?.typography === font}
                onChange={handleInputChange}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="ml-3 flex-1">
                <div
                  className="font-semibold text-gray-900 text-lg"
                  style={{ fontFamily: font }}
                >
                  {font}
                </div>
                <div
                  className="text-sm text-gray-600 mt-1"
                  style={{ fontFamily: font }}
                >
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
