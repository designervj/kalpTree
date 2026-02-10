import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { IconRadio } from "./IconRadio";
import { FormMode, FormSettings, FieldInputType, FormField, StyleElement, Anim } from "./types";
import { ACCENT } from "./constants";

export interface GernalModel{
    mode:string;
    formName:string;
    notifyEmail:string;
    submissionsList:string;
}
const General = () => {
    const [generalSetting ,setGeneralSetting] = useState<GernalModel>({
        mode:"standalone",
        formName:"",
        notifyEmail:"",
        submissionsList:""
    })
  return (
    <>

      <div className="space-y-5">
                            {/* Purple promo card */}
                           

                            {/* Form mode radios */}
                            <RadioGroup
                                value={generalSetting.mode}
                                onValueChange={(v) => setGeneralSetting({...generalSetting,mode:v})}
                                className="space-y-2"
                            >
                                <label className="cursor-pointer">
                                    <div className="flex items-start gap-3">
                                        <RadioGroupItem value="standalone" className="sr-only" />
                                        <IconRadio
                                            checked={generalSetting.mode === "standalone"}
                                            title="Stand-alone form"
                                            desc="Collects its own list of submissions"
                                        />
                                    </div>
                                </label>

                                <label className="cursor-pointer">
                                    <div className="flex items-start gap-3">
                                        <RadioGroupItem value="connected" className="sr-only" />
                                        <IconRadio
                                            checked={generalSetting.mode === "connected"}
                                            title="Connected form"
                                            desc="Collects submissions into one list with the connected form"
                                        />
                                    </div>
                                </label>
                            </RadioGroup>

                            <Separator />

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-sm font-semibold text-slate-900">
                                        Form name
                                    </Label>
                                    <div className="text-sm text-slate-500">
                                        Appears in the submissions list. Visible to you.
                                    </div>
                                </div>
                                <Input
                                    value={generalSetting.formName}
                                    onChange={(e) => setGeneralSetting({...generalSetting,formName:e.target.value})}
                                    className="h-11 rounded-md"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-sm font-semibold text-slate-900">
                                        Email
                                    </Label>
                                    <div className="text-sm text-slate-500">
                                        Email notifications for submissions
                                    </div>
                                </div>
                                <Input
                                    value={generalSetting.notifyEmail}
                                    onChange={(e) => setGeneralSetting({...generalSetting,notifyEmail:e.target.value})}
                                    className="h-11 rounded-md"
                                />
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="text-sm font-semibold text-slate-900">
                                    Submissions Lists
                                </div>
                                <div className="text-sm text-slate-500">
                                    Manage all form submissions
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full rounded-md mt-2"
                                    style={{ color: ACCENT, borderColor: "#E5E7EB" }}
                                >
                                    View Submissions Lists
                                </Button>
                            </div>
                        </div>
    </>
  )
}

export default General