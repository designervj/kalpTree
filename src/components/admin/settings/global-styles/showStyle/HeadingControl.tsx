import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';
import { AlignLeft, MoveVertical, TypeIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { HeadingKey, HeadingStyle } from '../GlobalStyleModal';
import { Button } from '@/components/ui/button';
import { FontUploader } from '@/app/admin/websites/[website]/branding/typography/Fontuploader';


type FontEntry = {
  _id: string;
  name: string;
  url: string;
  fontType: string;
};
type HeadingControlProps = {
  headings: Record<HeadingKey, HeadingStyle>;
  headingFontFamily: string;
  setHeadingFontFamily: (value: string) => void;
  selectedHeading: HeadingKey;
  setSelectedHeading: (value: HeadingKey) => void;
  setH: (value: {
    weight?: number;
    scale?: number;
    lineHeight?: number;
    letterSpacingEm?: number;
  }) => void;
}
const HeadingControl = ({ headings, headingFontFamily, setHeadingFontFamily, setH, selectedHeading, setSelectedHeading }: HeadingControlProps) => {
  const WEIGHTS = [400, 500, 600, 700, 800, 900];
  const [headingBaseSize, setHeadingBaseSize] = useState(17);
  const [allFonts, setAllFonts] = useState<FontEntry[]>([]);
  const headingPx = (k: HeadingKey) => Math.round(headingBaseSize * headings[k].scale);
  console.log("headingFontFamily", headingFontFamily)
  const handleHeadingFontChange = (value: string) => {
    if (!value) return;
    setHeadingFontFamily(value);

  };

  useEffect(() => {
    (async () => {
      try {
        const req = await fetch("/api/admin/typography");
        const res = await req.json();
        setAllFonts(res.data ?? []);
      } catch (error) {
        console.error("Failed to load fonts:", error);
      }
    })();
  }, []);


  const FontOptions = ({ type }: { type?: string[] }) => {
    const finalOptions =
      type != undefined
        ? allFonts.filter((d) => type.includes(d.fontType))
        : allFonts;
    return (
      <>
        <SelectItem value="Inter">Inter</SelectItem>
        <SelectItem value="Merriweather">Merriweather (Serif)</SelectItem>
        <SelectItem value="Space Mono">Space Mono (Monospace)</SelectItem>
        {finalOptions.map((f) => (
          <SelectItem key={f._id} value={f.name}>
            {f.name}
          </SelectItem>
        ))}
      </>
    );
  };

  return (
    <Card>
      <FontUploader
        s3Config={{
          bucketName: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
          region: process.env.NEXT_PUBLIC_AWS_REGION!,
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        }}
      />
      <CardContent className="pt-6 space-y-5">
        <div className="flex items-center gap-2">
          <TypeIcon className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">Heading Settings</p>
            <p className="text-xs text-muted-foreground">
              Font family only affects headings — body font is separate.
            </p>
          </div>
        </div>
        {/* ── Heading font selector ── */}
        <div className="space-y-2">
          <Label>Heading Font Family</Label>
          <Select
            value={headingFontFamily}
            onValueChange={handleHeadingFontChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <FontOptions type={["heading", "general"]} />
            </SelectContent>
          </Select>
        </div>

        {/* Preview badge showing active heading font */}
        <div
          className="rounded-md border px-3 py-2 text-sm"
          style={{ fontFamily: headingFontFamily }}
        >
          <span className="text-xs text-muted-foreground mr-2">
            Heading preview:
          </span>
          <span className="font-bold">{headingFontFamily}</span>
        </div>
        <div className="space-y-3">
          <Label>Font Weight</Label>
          <div className="grid grid-cols-3 gap-2">
            {WEIGHTS.filter((w) => w !== 300).map((w) => (
              <Button
                key={w}
                variant={headings[selectedHeading].weight === w ? "default" : "outline"}
                size="sm"
                onClick={() => setH({ weight: w })}
              >
                {w}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Size Scale</Label>
            <span className="text-xs text-muted-foreground">
              {headings[selectedHeading].scale.toFixed(2)} → {headingPx(selectedHeading)}px
            </span>
          </div>
          <Slider
            value={[headings[selectedHeading].scale]}
            min={0.8}
            max={4.0}
            step={0.05}
            onValueChange={(v) => setH({ scale: v[0] })}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="flex items-center gap-2">
              <MoveVertical className="w-3 h-3" /> Line Height
            </Label>
            <span className="text-xs text-muted-foreground">{headings[selectedHeading].lineHeight.toFixed(2)}</span>
          </div>
          <Slider
            value={[headings[selectedHeading].lineHeight]}
            min={0.9}
            max={2.2}
            step={0.05}
            onValueChange={(v) => setH({ lineHeight: v[0] })}
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="flex items-center gap-2">
              <AlignLeft className="w-3 h-3" /> Letter Spacing
            </Label>
            <span className="text-xs text-muted-foreground">{headings[selectedHeading].letterSpacingEm.toFixed(2)}em</span>
          </div>
          <Slider
            value={[headings[selectedHeading].letterSpacingEm * 100]}
            min={-10}
            max={20}
            step={1}
            onValueChange={(v) => setH({ letterSpacingEm: v[0] / 100 })}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default HeadingControl