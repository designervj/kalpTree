import React, { useMemo } from 'react'
import { extractColors, extractFontsAndSizesFromHTML,} from './util/ExtractColorFont'

type htmlProps = {
    html: string
}
const ShowHTMLtemplate = ({ html }: htmlProps) => {



    const srcDoc = useMemo(() => `
    <!DOCTYPE html>
    <html style="overflow: hidden; pointer-events: none; width: 100%; height: 100%;">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            width: 1200px;
            overflow: hidden;
            background: white;
          }
          /* Ensure content fits the 1200px width */
          * { max-width: 100%; box-sizing: border-box; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `, [html]);

    return (
        <div className="w-full h-full overflow-hidden relative bg-white pointer-events-none">
            {/* The 400% width + 0.25 scale trick ensures it always fills 100% of the parent container */}
            <div className="absolute inset-0 w-[400%] h-[400%] origin-top-left transform scale-[0.25]">
                <iframe
                    srcDoc={srcDoc}
                    className="w-full h-full border-none pointer-events-none"
                    title="Template Preview"
                    scrolling="no"
                />
            </div>
            
            {/* Overlay to catch any stray interactions */}
            <div className="absolute inset-0 z-10" />
        </div>
    )
}

export default ShowHTMLtemplate