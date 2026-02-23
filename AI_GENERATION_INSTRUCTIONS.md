# AI Generation Instructions for GrapesJS Sections

Follow these strict guidelines to generate HTML, CSS, and JavaScript for website sections compatible with the GrapesJS editor.

## 1. Output Structure

Output the component in this exact order:

1.  **`<style>`**: Scoped CSS rules.
2.  **`<section>`**: The HTML structure.
3.  **`<script>`**: The isolated interaction logic (IIFE).

## 2. Structural Requirements

- **Root Element**: Wrap everything in a single `<section>` tag.
- **Unique ID**: Assign a unique, stable ID to the section (e.g., `id="section-{{random_hex}}"`).
- **Custom Name**: Use the `data-gjs-custom-name` attribute on the `<section>` for the GrapesJS Layers panel.
- **No Boilerplate**: Do NOT include `<html>`, `<head>`, or `<body>` tags.

## 3. Styling Guidelines

- **Scoped Selectors**: Prefix ALL CSS rules with the section's unique ID (e.g., `#section-123 .title { ... }`) to prevent style leakage.
- **CSS Variables**: Use ONLY pre-defined CSS variables (tokens). Never hardcode colors or pixels.
  - **Colors**: `var(--primary)`, `var(--text)`, `var(--bg)`, `var(--card-bg)`.
  - **Typography**: `var(--font-heading)`, `var(--h1-size)`, `var(--body-size)`.
  - **Spacing**: `var(--section-pad-y)`, `var(--container-pad)`.
- **No Tailwind**: Do not use Tailwind utility classes (e.g., `flex`, `p-4`). Define all styles in the `<style>` block.
- **No Inline Styles**: Never use the `style="..."` attribute on elements.
- **No `!important`**: Avoid using `!important` as it prevents users from making manual adjustments in the Style Manager.

## 4. JavaScript Guidelines

- **Isolation**: Wrap all JS in a complete IIFE: `(function() { ... })();`.
- **Re-execution Guard**:
  ```javascript
  if (window.__sectionIDLoaded) return;
  window.__sectionIDLoaded = true;
  ```
- **Component Scoping**: Target elements using `root.querySelector('.class')`, where `root` is `document.querySelector('#section-id')`.
- **Targeting Children**: Never target children by ID (GrapesJS assigns random IDs). Always use classes or `data-ref` attributes.

## 5. Standard Data-Attribute Interactions

For common actions, prefer these `data-` attributes over custom JS:

- `data-scroll-to="#target-id"`
- `data-redirect-url="https://..."`
- `data-redirect-newtab="true"`
- `data-toggle-visibility="#element-id"`

---

### Example Template for AI Generation:

```html
<style>
  #hero-a1b2c3 .hero-container {
    padding: var(--section-pad-y) var(--container-pad);
    background-color: var(--bg);
  }
  #hero-a1b2c3 .hero-title {
    font-family: var(--font-heading);
    color: var(--text);
    font-size: var(--h1-size);
  }
</style>

<section id="hero-a1b2c3" data-gjs-custom-name="Hero Section">
  <div class="hero-container">
    <h1 class="hero-title">Title Here</h1>
  </div>
</section>

<script>
  (function () {
    if (window.__heroA1b2c3Loaded) return;
    window.__heroA1b2c3Loaded = true;
    const root = document.querySelector("#hero-a1b2c3");
    if (!root) return;

    // Logic here
    console.log("Hero initialized");
  })();
</script>
```
