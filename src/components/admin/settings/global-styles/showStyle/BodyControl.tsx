import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { AlignLeft, MoveVertical } from 'lucide-react';
import React from 'react';
import { BodyStyle } from '../GlobalStyleModal';

interface BodyControlProps {
    body: BodyStyle;
    setBody: (patch: Partial<BodyStyle>) => void;
    globalFontFamily: string;
    setGlobalFontFamily: (value: string) => void;
}

const BodyControl = ({
    body,
    setBody,
    globalFontFamily,
    setGlobalFontFamily,
}: BodyControlProps) => {
    const WEIGHTS = [300, 400, 500, 600, 700, 800, 900];

    return (
        <Card>
            <CardContent className="pt-6 space-y-5">
                <div className="space-y-2">
                    <Label>Body Font Family</Label>
                    <Select value={globalFontFamily} onValueChange={setGlobalFontFamily}>
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
                        <Label>Body Size</Label>
                        <span className="text-xs text-muted-foreground">{body.sizePx}px</span>
                    </div>
                    <Slider value={[body.sizePx]} min={12} max={24} step={1} onValueChange={(v) => setBody({ sizePx: v[0] })} />
                </div>

                <div className="space-y-3">
                    <Label>Font Weight</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {WEIGHTS.map((w) => (
                            <Button
                                key={w}
                                variant={body.weight === w ? "default" : "outline"}
                                size="sm"
                                onClick={() => setBody({ weight: w })}
                            >
                                {w}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <Label className="flex items-center gap-2">
                            <MoveVertical className="w-3 h-3" /> Line Height
                        </Label>
                        <span className="text-xs text-muted-foreground">{body.lineHeight.toFixed(2)}</span>
                    </div>
                    <Slider value={[body.lineHeight]} min={1.1} max={2.2} step={0.05} onValueChange={(v) => setBody({ lineHeight: v[0] })} />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <Label className="flex items-center gap-2">
                            <AlignLeft className="w-3 h-3" /> Letter Spacing
                        </Label>
                        <span className="text-xs text-muted-foreground">{body.letterSpacingEm.toFixed(2)}em</span>
                    </div>
                    <Slider
                        value={[body.letterSpacingEm * 100]}
                        min={-5}
                        max={20}
                        step={1}
                        onValueChange={(v) => setBody({ letterSpacingEm: v[0] / 100 })}
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <Label>Paragraph Max Width</Label>
                        <span className="text-xs text-muted-foreground">{body.maxWidthCh}ch</span>
                    </div>
                    <Slider value={[body.maxWidthCh]} min={40} max={90} step={1} onValueChange={(v) => setBody({ maxWidthCh: v[0] })} />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <Label>Paragraph Gap</Label>
                        <span className="text-xs text-muted-foreground">{body.paragraphGapPx}px</span>
                    </div>
                    <Slider value={[body.paragraphGapPx]} min={0} max={32} step={1} onValueChange={(v) => setBody({ paragraphGapPx: v[0] })} />
                </div>
            </CardContent>
        </Card>
    );
};

export default BodyControl;
