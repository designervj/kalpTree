


import { useState } from "react";
import { Languages, Check, Globe2 } from "lucide-react";

const LANGUAGES = [
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
];

export function LanguageSelector({ formData, handleInputChange }: any) {
  const selectedLanguages: { name: string; default: boolean }[] =
    formData?.businessdetails?.lang ||
    formData.lang || [{ name: "en", default: true }];

  const isSelected = (langCode: string) =>
    selectedLanguages.some((lang) => lang.name === langCode);

  const isDefault = (langCode: string) =>
    selectedLanguages.find((lang) => lang.name === langCode)?.default === true;

  const handleLanguageSelect = (langCode: string) => {
    const alreadySelected = isSelected(langCode);

    // Prevent deselecting the last remaining language
    if (alreadySelected && selectedLanguages.length === 1) return;

    // Prevent deselecting the default language directly
    if (alreadySelected && isDefault(langCode)) return;

    const newSelection = alreadySelected
      ? selectedLanguages.filter((lang) => lang.name !== langCode)
      : [...selectedLanguages, { name: langCode, default: false }];

    handleInputChange({
      target: { name: "businessdetails.lang", value: newSelection },
    });
  };

  const handleSetDefault = (langCode: string) => {
    const newSelection = selectedLanguages.map((lang) => ({
      ...lang,
      default: lang.name === langCode,
    }));

    handleInputChange({
      target: { name: "businessdetails.lang", value: newSelection },
    });
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Languages className="w-5 h-5 text-primary-600" />
        <label className="text-sm font-semibold text-gray-700">
          Language Selection
        </label>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <Globe2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            <strong>Multilingual Mode:</strong> Select multiple languages for
            your business. Your website will support all selected languages with
            a language switcher.
          </p>
        </div>
      </div>

      {/* Language grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
        {LANGUAGES.map((lang) => {
          const selected = isSelected(lang.code);
          const defaultLang = isDefault(lang.code);

          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageSelect(lang.code)}
              className={`
                relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                ${
                  selected
                    ? defaultLang
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-primary-500 bg-primary-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }
              `}
            >
              <span className="text-2xl" role="img" aria-label={lang.name}>
                {lang.flag}
              </span>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {lang.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {lang.nativeName}
                </div>
              </div>

              {selected && (
                <>
                  {/* Check badge */}
                  <div
                    className={`absolute -top-2 -right-2 rounded-full p-1 ${
                      defaultLang ? "bg-blue-600" : "bg-primary-600"
                    } text-white`}
                  >
                    <Check className="w-3 h-3" />
                  </div>

                  {/* Default label */}
                  {defaultLang && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      DEFAULT
                    </div>
                  )}

                  {/* Set as default button for non-default languages */}
                  {!defaultLang && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(lang.code);
                      }}
                      className="absolute bottom-1 right-1 text-black bg-primary-600 hover:bg-primary-700  text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap transition-colors"
                    >
                      SET DEFAULT
                    </button>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected summary */}
      {selectedLanguages.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">
            Selected Languages ({selectedLanguages.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.map((langObj) => {
              const lang = LANGUAGES.find((l) => l.code === langObj.name);
              return lang ? (
                <span
                  key={langObj.name}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-sm font-medium ${
                    langObj.default
                      ? "bg-blue-100 border-blue-300 text-blue-800"
                      : "bg-white border-primary-200 text-gray-700"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  {langObj.default && (
                    <span className="ml-1 text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">
                      DEFAULT
                    </span>
                  )}
                </span>
              ) : null;
            })}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            💡 Click "SET DEFAULT" on any selected language to make it the
            primary language
          </p>
        </div>
      )}
    </div>
  );
}