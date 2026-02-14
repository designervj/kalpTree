# GrapesJS HTML Compatibility Guidelines

This document outlines the best practices and requirements for creating HTML content that is compatible with the GrapesJS editor in the KalpTree project.

## 1. Structural Requirements

### Section Pattern

All top-level content blocks should be wrapped in a `<section>` tag with standard padding and container constraints.

```html
<section class="py-16 bg-white">
  <div class="container mx-auto px-4 max-w-6xl">
    <!-- Your content here -->
  </div>
</section>
```

- **Padding**: Use `py-16` or `py-20` for vertical spacing.
- **Container**: Use `container mx-auto px-4 max-w-6xl` to maintain consistent alignment with other sections.

### Columns and Layout

Use Tailwind's Flexbox or Grid utilities for responsive layouts.

```html
<!-- Flexbox Columns -->
<div class="flex flex-wrap -mx-4">
  <div class="w-full md:w-1/2 p-4">
    <!-- Column 1 -->
  </div>
  <div class="w-full md:w-1/2 p-4">
    <!-- Column 2 -->
  </div>
</div>

<!-- Grid Columns -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
  <!-- Items -->
</div>
```

## 2. Tailwind CSS Usage

The editor uses Tailwind CSS (via CDN) for styling. Ensure all components use standard Tailwind utility classes.

- **Colors**: Use the `primary` variable for theme consistency:
  - `bg-primary`, `text-primary`, `border-primary`.
- **Text**: Use `text-gray-700`, `text-gray-800` for body text and `text-gray-900` for headings.
- **Backgrounds**: Standard backgrounds are `bg-white`, `bg-gray-50`, and `bg-gray-900` (dark).

## 3. GrapesJS Specific Attributes

To improve the editing experience, use the following `data-gjs-*` attributes:

| Attribute                     | Purpose                                                                    |
| ----------------------------- | -------------------------------------------------------------------------- |
| `data-gjs-type="text"`        | Explicitly marks an element as a text component for better inline editing. |
| `data-gjs-droppable=".cell"`  | Restricts what can be dropped inside the element.                          |
| `data-gjs-draggable=".row"`   | Restrict where the element can be dragged.                                 |
| `data-gjs-custom-name="Hero"` | Sets the display name in the Layers panel.                                 |
| `data-gjs-selectable="false"` | Prevents the element from being selected in the canvas.                    |

## 4. Components

### Buttons

Buttons should have consistent sizing and transition effects.

```html
<button
  class="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200"
>
  Button Text
</button>
```

### Forms

Forms require specific handling in GrapesJS. Use the `form` type and ensure inputs are properly styled.

```html
<form data-gjs-type="form" class="space-y-6">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">Label</label>
    <input
      type="text"
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
    />
  </div>
  <button
    type="submit"
    class="w-full px-6 py-3 bg-primary text-white rounded-md"
  >
    Submit
  </button>
</form>
```

### Images and Media

Always ensure images are responsive and have consistent styling.

```html
<img src="URL" alt="Description" class="w-full h-auto rounded-lg shadow-md" />
```

## 5. JavaScript and Interactivity

Scripts are handled specially in this project. All inline `<script>` tags are extracted from the HTML, wrapped in IIFEs (Immediately Invoked Function Expressions), and managed by the GrapesJS Script Editor.

### Best Practices for Scripts

1. **Use IIFEs for Isolation**: To prevent naming collisions between different sections, always wrap your logic in an IIFE.

   ```javascript
   (function() {
     // Your logic here
     const btn = document.querySelector('.my-button');
     btn.addEventListener('click', () => { ... });
   })();
   ```

   _Note: The project's automated extractor will attempt to wrap your code if you don't, but manual wrapping is safer._

2. **Avoid Global Variables**: Do not declare variables in the global scope (`window`). Use local variables instead.

3. **External Scripts**: Script tags with `src` attributes (e.g., `<script src="...">`) are currently filtered out during the extraction process. If you need external libraries, ensure they are available in the editor's canvas configuration or use dynamic script loading.

4. **Event Listeners**: Avoid inline event handlers like `onclick="..."`. Use `addEventListener` within your script block to maintain clean HTML and better compatibility with GrapesJS.

5. **Idempotence**: Scripts may be re-run when sections are re-ordered or re-rendered in the editor. Ensure your code can handle being executed multiple times (e.g., check if a listener is already attached or clear previous state).

6. **Selecting Elements**: When writing scripts for a specific section, use unique classes or IDs to ensure you're targeting the correct elements.

   ```javascript
   // Bad: might target elements in other sections
   const items = document.querySelectorAll(".item");

   // Good: use a scoped selector
   const section = document.querySelector("#my-unique-section");
   const items = section.querySelectorAll(".item");
   ```

### GrapesJS Component Scripts (Advanced)

If you are developing a native GrapesJS component, you can use the `script` property:

```javascript
editor.Components.addType("my-comp", {
  model: {
    defaults: {
      script: function () {
        // 'this' refers to the component's DOM element
        console.log("Component element:", this);
      },
    },
  },
});
```

## 6. Best Practices Summary

1. **Avoid Hardcoded Styles**: Use Tailwind classes instead of `style="..."` whenever possible.
2. **Layer Naming**: Use `data-gjs-custom-name` for complex components to keep the Layers panel organized.
3. **Responsive Design**: Always use mobile-first classes (e.g., `w-full md:w-1/2`).
4. **Interactive Elements**: Ensure hover states are defined (`hover:bg-primary/90`).
5. **Clean HTML**: Keep the DOM structure deep enough for layout but shallow enough for easy selection.
