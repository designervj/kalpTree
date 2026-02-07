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

export function LanguageSelector({ formData, handleInputChange }) {
  const selectedLanguages = formData?.businessdetails?.lang || [
    { name: "en", default: true },
  ];

  const [isMultilingual, setIsMultilingual] = useState(
    selectedLanguages.length > 1
  );

  const getDefaultLanguage = () => {
    const defaultLang = selectedLanguages.find((lang) => lang.default === true);
    return defaultLang ? defaultLang.name : selectedLanguages[0]?.name || "en";
  };

  const handleMultilingualToggle = (enabled) => {
    setIsMultilingual(enabled);

    // If switching to single language, keep only the default or first language
    if (!enabled && selectedLanguages.length > 1) {
      const defaultLang = getDefaultLanguage();
      const event = {
        target: {
          name: "businessdetails.lang",
          value: [{ name: defaultLang, default: true }],
        },
      };
      handleInputChange(event);
    }
  };

  const handleLanguageSelect = (langCode) => {
    let newSelection;

    if (isMultilingual) {
      // Multilingual mode: toggle selection
      const isSelected = selectedLanguages.some(
        (lang) => lang.name === langCode
      );
      const isDefault = selectedLanguages.find(
        (lang) => lang.name === langCode
      )?.default;

      if (isSelected) {
        // Don't allow deselecting if it's the last language
        if (selectedLanguages.length === 1) return;
        // Don't allow deselecting the default language
        if (isDefault) return;

        newSelection = selectedLanguages.filter(
          (lang) => lang.name !== langCode
        );
      } else {
        newSelection = [
          ...selectedLanguages,
          { name: langCode, default: false },
        ];
      }
    } else {
      // Single language mode: replace selection
      newSelection = [{ name: langCode, default: true }];
    }

    const event = {
      target: {
        name: "businessdetails.lang",
        value: newSelection,
      },
    };
    handleInputChange(event);
  };

  const handleDefaultLanguageChange = (langCode) => {
    // Set all languages to default: false, then set selected one to true
    const newSelection = selectedLanguages.map((lang) => ({
      ...lang,
      default: lang.name === langCode,
    }));

    const event = {
      target: {
        name: "businessdetails.lang",
        value: newSelection,
      },
    };
    handleInputChange(event);
  };

  const isSelected = (langCode) =>
    selectedLanguages.some((lang) => lang.name === langCode);
  const isDefault = (langCode) =>
    selectedLanguages.find((lang) => lang.name === langCode)?.default === true;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Languages className="w-5 h-5 text-primary-600" />
          Language Selection
        </label>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Multilingual Support</span>
          <button
            type="button"
            onClick={() => handleMultilingualToggle(!isMultilingual)}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${isMultilingual ? "bg-primary-600" : "bg-gray-300"}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${isMultilingual ? "translate-x-6" : "translate-x-1"}
              `}
            />
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <Globe2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            {isMultilingual ? (
              <p>
                <strong>Multilingual Mode:</strong> Select multiple languages
                for your business. Your website will support all selected
                languages with language switcher.
              </p>
            ) : (
              <p>
                <strong>Single Language Mode:</strong> Select one primary
                language for your business. You can enable multilingual support
                anytime.
              </p>
            )}
          </div>
        </div>
      </div>

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
                  <div
                    className={`absolute -top-2 -right-2 rounded-full p-1 ${
                      defaultLang ? "bg-blue-600" : "bg-primary-600"
                    } text-white`}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                  {defaultLang && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      DEFAULT
                    </div>
                  )}
                  {/* Set as Default button for non-default selected languages in multilingual mode */}
                  {!defaultLang && isMultilingual && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDefaultLanguageChange(lang.code);
                      }}
                      className="absolute right-0 bg-primary-600 hover:bg-primary-700 text-black text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap transition-colors"
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

      {selectedLanguages.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">
            Selected Languages ({selectedLanguages.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.map((langObj) => {
              const lang = LANGUAGES.find((l) => l.code === langObj.name);
              const defaultLang = langObj.default;
              return lang ? (
                <span
                  key={langObj.name}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-sm font-medium ${
                    defaultLang
                      ? "bg-blue-100 border-blue-300 text-blue-800"
                      : "bg-white border-primary-200 text-gray-700"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  {defaultLang && (
                    <span className="ml-1 text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">
                      DEFAULT
                    </span>
                  )}
                </span>
              ) : null;
            })}
          </div>
          {isMultilingual && (
            <div className="mt-2 text-xs text-gray-500">
              💡 Click "SET DEFAULT" on any selected language to make it the
              primary language
            </div>
          )}
        </div>
      )}
    </div>
  );
}
