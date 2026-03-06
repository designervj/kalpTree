import React, { useMemo } from 'react'

type Props = {
  html: string
}
const ShowHeaderHtml = ({ html }: Props) => {


  console.log("html header--->", html)
  const srcDoc = useMemo(() => `
        <!DOCTYPE html>
        <html style="overflow: hidden; pointer-events: none; width: 100%; height: 100%;">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { 
                margin: 0; 
                padding: 0; 
                width: 100%;
                overflow: hidden;
                background: white;
              }
              /* Ensure content fits the width */
              * { max-width: 100%; box-sizing: border-box; }
            </style>
          </head>
          <body>${html?.replace(/\\n/g, '') || ''}</body>
        </html>
      `, [html]);

  return (
    <div className="w-full h-full overflow-hidden relative bg-white pointer-events-none">
      {/* Using a larger scale (0.8) to make it more readable while still isolated in an iframe */}
      <div className="absolute inset-0 w-[125%] h-[125%] origin-top-left transform scale-[0.8]">
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

export default ShowHeaderHtml


