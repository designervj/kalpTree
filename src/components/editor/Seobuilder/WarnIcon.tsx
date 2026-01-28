import { AlertCircle } from "lucide-react";

export function WarnIcon() {
    return (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300">
            <AlertCircle className="h-4 w-4" />
        </span>
    );
}
