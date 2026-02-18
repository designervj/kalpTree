import React from 'react'
import { extractColors, extractFontsAndSizesFromHTML } from './util/ExtractColorFont';
import { TemplateDocument } from '../TemplateType';

type htmlProps = {
    html: TemplateDocument
}
const ShowPallete = ({ html }: htmlProps) => {
    const colors = extractColors(html?.content || "");
    const { fontFamilies, fontSizes } = extractFontsAndSizesFromHTML(html?.content || "");
    console.log("colors", colors)
    console.log("fontFamilies", fontFamilies)
    console.log("fontSizes", fontSizes)

    return (
        <>
            <div className="flex w-full h-full">
                {colors?.map((col: { color: string; count: number }, idx: number) => (
                    <div
                        key={idx}
                        className="flex-1 h-full"
                        style={{ background: col.color }}
                        title={`${col.color} (used ${col.count} times)`}
                    />
                ))}
            </div>
            <div
                className="text-sm font-semibold text-slate-900 truncate"
                style={{ fontFamily: fontFamilies[0], fontSize: fontSizes[0] }}
            >
                {html.label}
            </div>
        </>
    )
}

export default ShowPallete