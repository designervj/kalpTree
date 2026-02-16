import React, { useEffect, useState, useRef } from 'react';

interface CssCodeProps {
    localCss: string;
    setLocalCss: (css: string) => void;
}

const formatCss = (css: string) => {
    if (!css) return '';
    return css
        .replace(/\s*\{\s*/g, ' {\n  ')
        .replace(/\s*;\s*/g, ';\n  ')
        .replace(/\s*\}\s*/g, '\n}\n\n')
        .replace(/\s*,\s*/g, ', ')
        .replace(/:\s*/g, ': ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
};

const CssCode: React.FC<CssCodeProps> = ({ localCss, setLocalCss }) => {
    const [internalCode, setInternalCode] = useState(() => formatCss(localCss));
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const currentNormalized = internalCode.replace(/\s+/g, '');
        const incomingNormalized = localCss.replace(/\s+/g, '');

        if (currentNormalized !== incomingNormalized) {
            setInternalCode(formatCss(localCss));
        }
    }, [localCss]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value;
        setInternalCode(newVal);
        setLocalCss(newVal);
    };

    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
        }
    };

    const lineNumbers = internalCode.split('\n').length;

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">styles.css</span>
                </div>
                <div className="text-[10px] font-bold text-blue-500/80 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    CSS
                </div>
            </div>
            <div className="flex flex-1 min-h-0 relative overflow-hidden bg-[#1e1e1e]">
                <div
                    ref={lineNumbersRef}
                    className="absolute left-0 top-0 bottom-0 py-4 text-right bg-[#1e1e1e] text-slate-600 select-none border-r border-slate-800/50 min-w-[3.5rem] px-3 font-medium text-xs leading-6 overflow-hidden z-10"
                >
                    {Array.from({ length: Math.max(lineNumbers, 1) }, (_, i) => (
                        <div key={i + 1} className="leading-6">{i + 1}</div>
                    ))}
                </div>

                <textarea
                    ref={textareaRef}
                    className="flex-1 ml-[3.5rem] w-[calc(100%-3.5rem)] p-4 bg-transparent outline-none resize-none whitespace-pre leading-6 text-[#ce9178] focus:ring-0 border-none selection:bg-blue-500/30 overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
                    value={internalCode}
                    onChange={handleChange}
                    onScroll={handleScroll}
                    spellCheck={false}
                    style={{
                        caretColor: '#fff',
                        fontFamily: "'Fira Code', 'Cascadia Code', 'Source Code Pro', monospace",
                    }}
                />
            </div>
        </div>
    );
};

export default CssCode;