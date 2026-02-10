import { useEffect, useRef, useState } from "react";
import { isHexColor } from "../util/ColorFunction";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
const HexInput = ({
  label,
  value,
  fallback,
  onCommit,
}: {
  label: string;
  value: string;
  fallback: string;
  onCommit: (v: string) => void;
}) => {
  const [draft, setDraft] = useState(value);
  const lastValidRef = useRef(isHexColor(value) ? value : fallback);

  useEffect(() => {
    setDraft(value);
    if (isHexColor(value)) lastValidRef.current = value;
  }, [value, fallback]);

  const displayForPicker = isHexColor(draft) ? draft : lastValidRef.current;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => {
            const v = e.target.value;
            setDraft(v);
            if (isHexColor(v)) {
              lastValidRef.current = v.trim();
              onCommit(v.trim());
            }
          }}
          onBlur={() => {
            if (!isHexColor(draft)) {
              setDraft(lastValidRef.current);
            } else {
              onCommit(draft.trim());
            }
          }}
          placeholder={fallback}
          spellCheck={false}
          autoComplete="off"
          inputMode="text"
        />
        <input
          type="color"
          className="h-9 w-10 rounded-md border bg-background px-1"
          value={displayForPicker}
          onChange={(e) => {
            const v = e.target.value;
            lastValidRef.current = v;
            setDraft(v);
            onCommit(v);
          }}
          title="Pick color"
        />
      </div>
      {!isHexColor(draft) ? (
        <p className="text-[11px] text-muted-foreground">
          Tip: Hex format <span className="font-mono">#RRGGBB</span> (example:{" "}
          <span className="font-mono">{fallback}</span>)
        </p>
      ) : null}
    </div>
  );
}

export default HexInput;