import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function AIAssistant({ pageName }: { pageName: string }) {
    return (
        <Card className="rounded-2xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-[#0b1220]">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
                        <Sparkles className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            AI SEO Assistant
                        </div>
                        <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            Generate new SEO title, meta description and keywords for{" "}
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {pageName}
                            </span>{" "}
                            page
                        </div>

                        <Button
                            variant="outline"
                            className="mt-4 h-10 rounded-xl border-slate-200 bg-white text-violet-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-transparent dark:text-violet-200 dark:hover:bg-white/5"
                        >
                            Generate new SEO info
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
