export function extractHeader(html: string | null): {
    header: string | null;
    updatedHtml: string | null;
  } {
    if (!html) return { header: null, updatedHtml: null };
  
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
  
    const header = doc.querySelector("header");
  
    let headerHtml: string | null = null;
  
    if (header) {
      headerHtml = header.outerHTML;
      header.remove(); // 🔥 removes header from document
    }
  
    return {
      header: headerHtml,
      updatedHtml: doc.documentElement.outerHTML, // updated full HTML
    };
  }
  