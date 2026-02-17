import React from 'react'
import { extractColors, extractFontsAndSizesFromHTML } from './util/ExtractColorFont';

type htmlProps = {
    html: string
}
const ShowPallete = ({ html }: htmlProps) => {
    const colors = extractColors(html);
    const { fontFamilies, fontSizes } = extractFontsAndSizesFromHTML(html);


    return (
        <div className="flex w-full h-full">
            {colors?.map((col: any, idx: number) => (
                <div
                    key={idx}
                    className="flex-1 h-full"
                    style={{ background: col }}
                    title={col}
                />
            ))}
        </div>
    )
}

export default ShowPallete