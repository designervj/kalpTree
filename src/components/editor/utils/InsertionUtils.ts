/**
 * Adds a component to the GrapesJS editor, ensuring it's placed above the footer if one exists.
 * @param editor GrapesJS editor instance
 * @param content Component content (HTML string or object)
 * @returns The added component(s)
 */
export const addComponentAboveFooter = (editor: any, content: any) => {
    if (!editor) return;

    const wrapper = editor.getWrapper();
    // Look for footer tag at the top level of the wrapper
    const footer = wrapper.find('footer')[0];
   console.log("footer", footer)
    if (footer) {
        const parent = footer.parent();
        console.log("parent", parent)
        if (parent) {
            const index = footer.index();
            console.log("index", index)
            // Insert before the footer
            return parent.append(content, { at: index });
        }
    }

    // Fallback: append normally (at the end)
    return editor.addComponents(content);
};
