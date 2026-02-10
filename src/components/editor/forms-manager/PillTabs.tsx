import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ACCENT } from "./constants";

export function PillTabs({
    value,
    onValueChange,
}: {
    value: string;
    onValueChange: (v: string) => void;
}) {
    return (
        <Tabs value={value} onValueChange={onValueChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
                {[
                    ["general", "General"],
                    ["fields", "Fields"],
                    ["button", "Button"],
                    ["style", "Style"],

                ].map(([k, label]) => (
                    <TabsTrigger
                        key={k}
                        value={k}
                        className={cn(
                            "rounded-none border-b-2 border-transparent px-0 py-3 text-sm",
                            "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                            "data-[state=active]:text-slate-900",
                            "data-[state=inactive]:text-slate-500"
                        )}
                        style={
                            k === value
                                ? { borderBottomColor: ACCENT }
                                : { borderBottomColor: "transparent" }
                        }
                    >
                        {label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}
