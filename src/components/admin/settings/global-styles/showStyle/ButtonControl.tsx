import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Paintbrush } from 'lucide-react';
import React from 'react';
import { BtnKey, ButtonBaseStyle, ButtonColors } from '../GlobalStyleModal';

interface ButtonControlProps {
    buttonBase: ButtonBaseStyle;
    setButtonBase: (patch: Partial<ButtonBaseStyle>) => void;
    buttonColors: Record<BtnKey, ButtonColors>;
    setButtonColors: React.Dispatch<React.SetStateAction<Record<BtnKey, ButtonColors>>>;
    selectedBtn: BtnKey;
    setSelectedBtn: (value: BtnKey) => void;
}

function isHexColor(v: string) {
    return /^#([0-9a-fA-F]{6})$/.test(v.trim());
}

const ButtonControl = ({
    buttonBase,
    setButtonBase,
    buttonColors,
    setButtonColors,
    selectedBtn,
    setSelectedBtn,
}: ButtonControlProps) => {
    const WEIGHTS = [300, 400, 500, 600, 700, 800, 900];
    const activeBtnColors = buttonColors[selectedBtn];

    const setBase = (patch: Partial<ButtonBaseStyle>) => setButtonBase(patch);

    const setColors = (patch: Partial<ButtonColors>) => {
        setButtonColors((prev) => ({
            ...prev,
            [selectedBtn]: { ...prev[selectedBtn], ...patch },
        }));
    };

    return (
        <Card>
            <CardContent className="pt-6 space-y-5">
                <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="flex items-center gap-2">
                        <Paintbrush className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-semibold">Button Settings</p>
                            <p className="text-xs text-muted-foreground">Primary / Secondary / Outline (+ Ghost preview)</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Button Type (colors)</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {(["primary", "secondary", "outline"] as BtnKey[]).map((k) => (
                            <Button
                                key={k}
                                size="sm"
                                variant={selectedBtn === k ? "default" : "outline"}
                                onClick={() => setSelectedBtn(k)}
                            >
                                {k === "primary" ? "Primary" : k === "secondary" ? "Secondary" : "Outline"}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Button Font Family</Label>
                    <Select value={buttonBase.fontFamily} onValueChange={(v) => setBase({ fontFamily: v })}>
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
                        <Label>Font Size</Label>
                        <span className="text-xs text-muted-foreground">{buttonBase.sizePx}px</span>
                    </div>
                    <Slider value={[buttonBase.sizePx]} min={12} max={20} step={1} onValueChange={(v) => setBase({ sizePx: v[0] })} />
                </div>

                <div className="space-y-3">
                    <Label>Font Weight</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {WEIGHTS.filter((w) => w >= 400).map((w) => (
                            <Button
                                key={w}
                                variant={buttonBase.weight === w ? "default" : "outline"}
                                size="sm"
                                onClick={() => setBase({ weight: w })}
                            >
                                {w}
                            </Button>
                        ))}
                    </div>
                </div>

                <Separator />

                {(["bg", "text", "border", "hoverBg", "hoverText", "hoverBorder"] as const).map((key) => {
                    const labelMap: Record<typeof key, string> = {
                        bg: "Background",
                        text: "Text",
                        border: "Border",
                        hoverBg: "Hover Background",
                        hoverText: "Hover Text",
                        hoverBorder: "Hover Border",
                    };
                    const val = activeBtnColors[key];

                    return (
                        <div key={key} className="space-y-2">
                            <Label>{labelMap[key]}</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    value={val}
                                    onChange={(e) =>
                                        setButtonColors((p) => ({
                                            ...p,
                                            [selectedBtn]: { ...p[selectedBtn], [key]: e.target.value } as any,
                                        }))
                                    }
                                />
                                <input
                                    type="color"
                                    className="h-9 w-10 rounded-md border bg-background px-1"
                                    value={isHexColor(val) ? val : "#000000"}
                                    onChange={(e) => setColors({ [key]: e.target.value } as any)}
                                />
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};

export default ButtonControl;
