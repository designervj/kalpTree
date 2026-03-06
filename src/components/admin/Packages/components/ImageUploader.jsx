import { useRef } from "react";
import { cls } from "../utils/helpers";
import { Btn, FL } from "./UI";
import { Ic } from "./Icons";

// ─── IMAGE UPLOADER ───────────────────────────────────────────────
export const ImageUploader = ({ images = [], onAdd, onRemove, label = "Images" }) => {
  const ref = useRef(null);
  const handleFiles = (e) => {
    Array.from(e.target.files || []).forEach((f) => onAdd(URL.createObjectURL(f)));
    e.target.value = "";
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <FL>{label}</FL>
        <Btn variant="outline" size="xs" onClick={() => ref.current?.click()}>+ Add</Btn>
        <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
      </div>
      {images.length === 0 ? (
        <div
          onClick={() => ref.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all"
        >
          <p className="text-xs text-gray-400">Click to upload images</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => onRemove(i)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                  <Ic.X />
                </div>
              </button>
            </div>
          ))}
          <div
            onClick={() => ref.current?.click()}
            className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-300 transition-all text-gray-400"
          >
            <Ic.Plus />
          </div>
        </div>
      )}
    </div>
  );
};
