import { GrapesJSEditor } from "@/hooks/use-editor";


export const cleanupComponentStylesAndScripts = (editor: GrapesJSEditor, component: any) => {
  if (!editor || !component) return;

  try {
    // Get component identifiers before it's fully removed
    const attrs = component.getAttributes?.() || {};
    const componentId = component.getId?.() || attrs.id || component.cid;
    const componentClasses = attrs.class || '';
    const componentType = component.get?.('type') || '';
    const tagName = component.get?.('tagName') || '';

    // Collect styles and scripts from the component tree before removal
    const componentStyles: string[] = [];
    const componentScripts: Array<{ content: string; id?: string }> = [];

    // Recursively scan component tree for styles and scripts
    const scanComponent = (comp: any) => {
      if (!comp) return;

      const compTagName = comp.get?.('tagName')?.toLowerCase();
      const compType = comp.get?.('type');

      // Check for style tags
      if (compTagName === 'style' || compType === 'style') {
        let styleContent = comp.get?.('content');
        if (!styleContent) {
          const innerComps = comp.get?.('components');
          if (innerComps && innerComps.length > 0) {
            styleContent = innerComps.at(0)?.get?.('content');
          }
        }
        if (styleContent && styleContent.trim()) {
          componentStyles.push(styleContent.trim());
        }
      }

      // Check for script tags
      if (compTagName === 'script' || compType === 'script') {
        let scriptContent = comp.get?.('content');
        if (!scriptContent) {
          const innerComps = comp.get?.('components');
          if (innerComps && innerComps.length > 0) {
            scriptContent = innerComps.at(0)?.get?.('content');
          }
        }
        if (scriptContent && scriptContent.trim()) {
          // Get script ID if available
          const scriptId = comp.getAttributes?.()?.id;
          componentScripts.push({
            content: scriptContent.trim(),
            id: scriptId,
          });
        }
      }

      // Check for inline styles on the component itself
      const inlineStyles = comp.getStyle?.() || {};
      if (Object.keys(inlineStyles).length > 0) {
        // Convert inline styles to CSS rule format
        const styleString = Object.entries(inlineStyles)
          .map(([prop, val]) => `  ${prop}: ${val};`)
          .join('\n');
        if (styleString) {
          const compId = comp.getId?.() || comp.getAttributes?.()?.id || comp.cid;
          const compClass = comp.getAttributes?.()?.class;
          let selector = '';
          if (compId && !compId.includes('cid')) {
            selector = `#${compId}`;
          } else if (compClass) {
            const firstClass = compClass.split(/\s+/)[0];
            if (firstClass && !firstClass.includes('gjs-')) {
              selector = `.${firstClass}`;
            }
          }
          if (selector) {
            componentStyles.push(`${selector} {\n${styleString}\n}`);
          }
        }
      }

      // Recursively check children
      const children = comp.get?.('components');
      if (children) {
        if (typeof children.forEach === 'function') {
          children.forEach((child: any) => scanComponent(child));
        } else if (children.models && typeof children.models.forEach === 'function') {
          children.models.forEach((child: any) => scanComponent(child));
        } else if (Array.isArray(children)) {
          children.forEach((child: any) => scanComponent(child));
        }
      }
    };

    // Scan the component tree
    scanComponent(component);

    // Also try to get HTML representation for additional style/script extraction
    try {
      const componentHtml = component.toHTML?.() || '';
      if (componentHtml) {
        // Extract styles from HTML string
        const styleMatches = componentHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
        styleMatches.forEach((styleTag: string) => {
          const contentMatch = styleTag.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
          if (contentMatch && contentMatch[1]) {
            const styleContent = contentMatch[1].trim();
            if (styleContent && !componentStyles.includes(styleContent)) {
              componentStyles.push(styleContent);
            }
          }
        });

        // Extract scripts from HTML string
        const scriptMatches = componentHtml.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
        scriptMatches.forEach((scriptTag: string) => {
          const contentMatch = scriptTag.match(/<script[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/script>/i);
          const idMatch = scriptTag.match(/id=["']([^"']+)["']/i);
          const scriptId = contentMatch?.[1] || idMatch?.[1];
          const scriptContentMatch = scriptTag.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
          if (scriptContentMatch && scriptContentMatch[1]) {
            const scriptContent = scriptContentMatch[1].trim();
            if (scriptContent) {
              const existing = componentScripts.find(s => s.content === scriptContent);
              if (!existing) {
                componentScripts.push({
                  content: scriptContent,
                  id: scriptId,
                });
              }
            }
          }
        });
      }
    } catch (e) {
      console.warn('Could not extract HTML for cleanup (this is normal for some components):', e);
    }

    // Remove CSS rules targeting this component from global CSS
    if (typeof editor.getCss === 'function') {
      let currentCss = editor.getCss() || '';

      if (currentCss && (componentStyles.length > 0 || componentId || componentClasses)) {
        // Build selectors that might target this component
        const selectorsToRemove: string[] = [];

        // Add ID-based selector
        if (componentId && typeof componentId === 'string' && !componentId.includes('cid')) {
          selectorsToRemove.push(`#${componentId}`);
        }

        // Add class-based selectors
        if (componentClasses) {
          const classes = componentClasses.split(/\s+/).filter((c: string) => c.trim());
          classes.forEach((cls: string) => {
            if (cls && !cls.includes('gjs-') && !cls.includes('gjs-')) {
              selectorsToRemove.push(`.${cls}`);
            }
          });
        }

        // Remove CSS rules that match these selectors
        selectorsToRemove.forEach(selector => {
          // Match CSS rules like "selector { ... }" (handle multi-line)
          const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // Match selector followed by braces with any content
          const selectorRegex = new RegExp(
            `${escapedSelector}\\s*\\{[^}]*\\}`,
            'g'
          );
          currentCss = currentCss.replace(selectorRegex, '');
        });

        // Remove component-specific styles that were extracted
        componentStyles.forEach(style => {
          if (style) {
            // Escape special regex characters
            const escapedStyle = style.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Remove the style content (handle multi-line)
            currentCss = currentCss.replace(new RegExp(escapedStyle, 'g'), '');
          }
        });

        // Clean up empty rules, empty selectors, and extra whitespace
        currentCss = currentCss
          .replace(/[^{}]*\{\s*\}/g, '') // Remove empty rules
          .replace(/\{[^}]*\}/g, (match) => {
            const content = match.replace(/[{}]/g, '').trim();
            return content ? match : '';
          })
          .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
          .replace(/^\s+|\s+$/g, '') // Trim start/end
          .trim();

        // Update the CSS
        if (typeof editor.setStyle === 'function' && currentCss !== editor.getCss()) {
          editor.setStyle(currentCss);
        }
      }
    }

    // Remove script components from wrapper that reference this component
    try {
      const wrapper = editor.Components?.getWrapper?.();
      if (wrapper) {
        // Find all script components in the wrapper
        const allScripts = wrapper.find?.('script') || [];

        allScripts.forEach((scriptComp: any) => {
          if (!scriptComp) return;

          let scriptContent = scriptComp.get?.('content');
          if (!scriptContent) {
            const innerComps = scriptComp.get?.('components');
            if (innerComps && innerComps.length > 0) {
              scriptContent = innerComps.at(0)?.get?.('content');
            }
          }

          if (scriptContent) {
            const scriptId = scriptComp.getAttributes?.()?.id;
            const scriptContentStr = scriptContent.trim();

            // Check if script references the deleted component
            const referencesComponent =
              (componentId && typeof componentId === 'string' && scriptContentStr.includes(componentId)) ||
              (componentClasses && componentClasses.split(/\s+/).some((cls: string) =>
                cls && !cls.includes('gjs-') && scriptContentStr.includes(cls)
              )) ||
              componentScripts.some((s: { content: string; id?: string }) => s.content === scriptContentStr);

            // Also check if script ID matches component ID
            const scriptMatchesComponentId = scriptId && componentId && scriptId === componentId;

            if (referencesComponent || scriptMatchesComponentId) {
              try {
                scriptComp.remove();
                console.log('✅ Removed script component from wrapper:', scriptId || 'anonymous');
              } catch (e) {
                console.warn('Could not remove script component:', e);
              }
            }
          }
        });
      }
    } catch (e) {
      console.warn('Error removing script components from wrapper:', e);
    }

    // Remove scripts associated with this component from global JS
    if (typeof editor.getJs === 'function' && componentScripts.length > 0) {
      let currentJs = editor.getJs() || '';
      const originalJs = currentJs;

      if (currentJs) {
        // Remove each script that was found in the component
        componentScripts.forEach((script: { content: string; id?: string }) => {
          const scriptContent = script.content;
          const scriptId = script.id;

          if (scriptContent) {
            // Escape special regex characters
            const escapedContent = scriptContent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Try multiple patterns to match and remove the script
            const patterns = [
              // Exact match
              new RegExp(escapedContent, 'g'),
              // With IIFE wrapper: (function(){ ... })();
              new RegExp(`\\(function\\(\\)\\s*\\{[^]*?${escapedContent}[^]*?\\}\\)\\(\\);?`, 'g'),
              // With comment and script ID
              scriptId ? new RegExp(`/\\*[^]*?Interactivity Script:[^]*?${scriptId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^]*?\\*/[^]*?${escapedContent}`, 'g') : null,
              // Script with ID attribute reference
              scriptId ? new RegExp(`/\\*[^]*?${scriptId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^]*?\\*/[^]*?${escapedContent}`, 'g') : null,
            ].filter(Boolean);

            patterns.forEach(pattern => {
              if (pattern) {
                currentJs = currentJs.replace(pattern, '');
              }
            });

            // Also remove scripts with component ID in comments
            if (componentId && typeof componentId === 'string') {
              const idCommentPattern = new RegExp(
                `/\\*[^]*?${componentId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^]*?\\*/[^]*?${escapedContent}`,
                'g'
              );
              currentJs = currentJs.replace(idCommentPattern, '');
            }
          }
        });

        // Clean up extra whitespace and empty lines
        currentJs = currentJs
          .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
          .replace(/^\s+|\s+$/g, '') // Trim start/end
          .trim();

        // Update the JS if it changed
        if (typeof editor.setJs === 'function' && currentJs !== originalJs) {
          editor.setJs(currentJs);
          return currentJs;
        }
      }
    }

  } catch (error) {
    console.error('❌ Error cleaning up component styles and scripts:', error);
    return typeof editor.getJs === 'function' ? editor.getJs() : '';
  }

  // Return the current JS if no changes were made above
  return typeof editor.getJs === 'function' ? editor.getJs() : '';
};