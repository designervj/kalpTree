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
import React from 'react'
import { HeadingKey } from '../GlobalStyleModal';
import { Button } from '@/components/ui/button';


type HeadingControlProps = {
    headingFontFamily: string;
    setHeadingFontFamily: (value: string) => void;
    headingBaseSize: number;
    setHeadingBaseSize: (value: number) => void;
    selectedHeading: HeadingKey;
    setSelectedHeading: (value: HeadingKey) => void;
    activeHeading: {
        weight: number;
        scale: number;
        lineHeight: number;
        letterSpacingEm: number;
    };
    setH: (value: {
        weight?: number;
        scale?: number;
        lineHeight?: number;
        letterSpacingEm?: number;
    }) => void;
    headingPx: (key: HeadingKey) => number;
    WEIGHTS: number[];
}
const HeadingControl = ({headingFontFamily, setHeadingFontFamily, headingBaseSize, setHeadingBaseSize, selectedHeading, setSelectedHeading, activeHeading, setH, headingPx, WEIGHTS}: HeadingControlProps) => {
  return (
      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <TypeIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">Heading Settings</p>
                <p className="text-xs text-muted-foreground">
                  Font family change will reflect in preview “Typography” card.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Heading Font Family</Label>
              <Select value={headingFontFamily} onValueChange={setHeadingFontFamily}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Merriweather">Merriweather (Serif)</SelectItem>
                  <SelectItem value="Space Mono">Space Mono (Monospace)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Heading Base Size</Label>
                <span className="text-xs text-muted-foreground">{headingBaseSize}px</span>
              </div>
              <Slider
                value={[headingBaseSize]}
                min={12}
                max={22}
                step={1}
                onValueChange={(v) => setHeadingBaseSize(v[0])}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <TypeIcon className="h-4 w-4" /> Heading Level
            </Label>
            <div className="grid grid-cols-6 gap-2">
              {(["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingKey[]).map((k) => (
                <Button
                  key={k}
                  size="sm"
                  variant={selectedHeading === k ? "default" : "outline"}
                  onClick={() => setSelectedHeading(k)}
                >
                  {k.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Font Weight</Label>
            <div className="grid grid-cols-3 gap-2">
              {WEIGHTS.filter((w) => w !== 300).map((w) => (
                <Button
                  key={w}
                  variant={activeHeading.weight === w ? "default" : "outline"}
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
                {activeHeading.scale.toFixed(2)} → {headingPx(selectedHeading)}px
              </span>
            </div>
            <Slider
              value={[activeHeading.scale]}
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
              <span className="text-xs text-muted-foreground">{activeHeading.lineHeight.toFixed(2)}</span>
            </div>
            <Slider
              value={[activeHeading.lineHeight]}
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
              <span className="text-xs text-muted-foreground">{activeHeading.letterSpacingEm.toFixed(2)}em</span>
            </div>
            <Slider
              value={[activeHeading.letterSpacingEm * 100]}
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