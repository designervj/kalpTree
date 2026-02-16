# GrapesJS HTML Compatibility Guidelines

This document outlines the best practices and requirements for creating HTML content that is compatible with the GrapesJS editor in the KalpTree project. These guidelines ensure that the generated HTML is not only functional but also fully editable within the GrapesJS builder's Style Manager.

---

## 🚀 AI Agent Quick Checklist

AI agents generating components **MUST** follow these rules to ensure perfect compatibility:

1.  **Wrap in Section**: Always wrap your component in a `<section>` tag with a descriptive ID.
2.  **No Tailwind**: Do not use Tailwind utility classes. Use semantic class names (e.g., `.hero-title`, `.feature-card`).
3.  **Class-Based Styles**: Define all styles in a `<style>` block using simple classes. This allows GrapesJS to map them to the Style Manager.
4.  **Theme Awareness**: Use CSS variables for colors: `var(--primary)`, `var(--secondary)`, `var(--text)`, etc.
5.  **No `!important`**: Never use `!important`. It prevents users from changing styles in the editor.
6.  **Responsive Design**: Use Media Queries (`@media`) within your `<style>` block for responsiveness instead of fixed widths.
7.  **Script Isolation**: Wrap all JavaScript in an IIFE and use the provided pattern for component scoping.

---

## 1. Structural Requirements

### Section Pattern

All top-level content blocks should be wrapped in a `<section>` tag. This helps GrapesJS identify individual sections for movement and deletion.

```html
<section
  id="features-section"
  class="section-padding"
  data-gjs-custom-name="Features Section"
>
  <div class="container">
    <!-- Your content here -->
  </div>
</section>

<style>
  .section-padding {
    padding: 80px 0;
    background-color: var(--bg-body);
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
</style>
```

### Layout & Responsiveness

Use Flexbox or Grid within your CSS classes. Avoid absolute positioning unless necessary.

```html
<div class="grid-layout">
  <div class="card">...</div>
  <div class="card">...</div>
</div>

<style>
  .grid-layout {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }
  @media (max-width: 768px) {
    .grid-layout {
      grid-template-columns: 1fr;
    }
  }
</style>
```

---

## 2. Style & Theme Integration

The project uses a dynamic theme system. To ensure components adapt to the user's branding, follow these styling rules:

### CSS Variables (Theming)

The editor injects a `:root` style block. **Directly use these variables** in your class definitions.

| Variable           | Description             |
| :----------------- | :---------------------- |
| `var(--primary)`   | Main brand color        |
| `var(--secondary)` | Secondary brand color   |
| `var(--accent)`    | Accent/highlight color  |
| `var(--text)`      | Default body text color |
| `var(--bg-body)`   | Main background color   |
| `var(--border)`    | Default border color    |

### Writing Editable Styles

GrapesJS identifies "classes" and makes them editable. To make your component user-friendly:

1.  **Unique Names**: Use specific class names like `.kt-hero-btn` to avoid conflicts.
2.  **Flat Selectors**: Avoid deep nesting like `.card div ul li`. Use `.card-item` directly.
3.  **No Inline Styles**: Never use `style="..."` on elements. Everything should be in the `<style>` block.

---

## 3. GrapesJS Specific Attributes

Use these attributes to control how GrapesJS handles your HTML.

| Attribute                           | Purpose                                                               |
| :---------------------------------- | :-------------------------------------------------------------------- |
| `data-gjs-type="text"`              | Forces the element to use the Text component (better inline editing). |
| `data-gjs-custom-name="Hero Image"` | Sets the label in the Layers panel (highly recommended).              |
| `data-gjs-draggable="false"`        | Prevents a specific element from being moved.                         |
| `data-gjs-removable="false"`        | Prevents a crucial element (like a inner wrapper) from being deleted. |

---

## 4. Components & Interactive Elements

### Buttons

Buttons should use the primary theme colors and have clear hover states defined in CSS.

```html
<button class="primary-button">Get Started</button>

<style>
  .primary-button {
    background-color: var(--primary);
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .primary-button:hover {
    filter: brightness(0.9);
  }
</style>
```

### Images

Ensure images are responsive using CSS classes.

```html
<img
  src="https://via.placeholder.com/800x600"
  alt="Feature Image"
  class="responsive-image"
/>

<style>
  .responsive-image {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 12px;
  }
</style>
```

---

## 5. JavaScript Logic (Scripts)

Scripts are extracted and run in an isolated environment. AI agents must follow this specific pattern:

### Script Implementation Protocol

1.  **IIFE Wrapping**: Scripts should never leak into the global scope.
2.  **Component Scoping**: Use a unique ID or class on the parent section to target children.
3.  **No `document.getElementById`**: Prefer `document.querySelector` scoped to the component's root.

**Correct Script Pattern for AI:**

```html
<script>
  (function () {
    // 1. Select the component root
    const section = document.querySelector("#a6-unique-id");
    if (!section) return;

    // 2. Perform logic inside the section scope
    const tabBtns = section.querySelectorAll(".tab-btn");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Toggle logic
      });
    });
  })();
</script>
```

---

## 6. Common Errors to Avoid

- ❌ **Using Tailwind**: Do not use `w-full`, `mt-4`, etc. Define these in your CSS block.
- ❌ **Fixed Pixel Widths**: Avoid `width: 1200px`. Use `max-width: 100%` or `max-width: 1200px`.
- ❌ **Complex CSS Selectors**: GrapesJS might struggle to map complex selectors to the correct element. Keep it simple.
- ❌ **Hardcoded Colors**: Never use `#3b82f6` if it should be the brand color. Use `var(--primary)`.
- ❌ **Boilerplate Tags**: Do NOT use `<html>`, `<head>`, or `<body>`.

---

## 7. Standard Component Structure for AI Agents

### Should I provide the `<head>` tag?

**NO.** Do not provide a `<head>` tag.

- In GrapesJS, the `<head>` is managed by the editor framework. Adding it will result in double head tags or broken imports.
- Global styles and external libraries are already injected by the KalpTree `RenderHtml` component.
- The AI agent should output only the **Style**, **Partial HTML**, and **Script** blocks.

### The Standard Template

AI Agents should output the component in this exact order:

1.  **CSS Block**: `<style> ... </style>` - Contains all component styling.
2.  **HTML Block**: `<section> ... </section>` - The visual structure.
3.  **JS Block**: `<script> ... </script>` - The interactivity wrapper.

**Full Example of AI Agent Output:**

```html
<!-- 1. STYLE TAGS FIRST -->
<style>
  #section-unique-id .interactive-element {
    color: var(--primary);
  }
</style>

<!-- 2. SEMANTIC HTML (No <html>, <head>, or <body> tags) -->
<section id="section-unique-id" data-gjs-custom-name="My Component">
  <button class="scroll-btn">Scroll Down</button>
  <button class="api-btn">Call API</button>
  <div class="result-box"></div>
</section>

<!-- 3. SCRIPT TAG LAST -->

<script>
  (function () {
    const root = document.querySelector("#section-unique-id");
    if (!root) return;

    // --- Example 1: Scroll to another section ---
    const scrollBtn = root.querySelector(".scroll-btn");
    scrollBtn.addEventListener("click", () => {
      const targetSection = document.querySelector("#next-section");
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });

    // --- Example 2: API Call with Fetch ---
    const apiBtn = root.querySelector(".api-btn");
    const resultBox = root.querySelector(".result-box");

    async function fetchData() {
      try {
        resultBox.textContent = "Loading...";
        const response = await fetch("https://api.example.com/data");
        const data = await response.json();
        resultBox.textContent = JSON.stringify(data);
      } catch (err) {
        resultBox.textContent = "Error fetching data";
      }
    }

    apiBtn.addEventListener("click", fetchData);

    // --- Example 3: Defining and calling a local function ---
    function myLocalFunction() {
      console.log("Function called within component scope");
    }
    myLocalFunction();
  })();
</script>
```

### Important Structural Rules:

- **No Boilerplate**: Do NOT include `<!DOCTYPE html>`, `<html>`, `<head>`, or `<body>` tags. These are already managed by the GrapesJS canvas.
- **Root Element**: There should only be ONE root tag (the `<section>`). All other tags (`header`, `footer`, `div`) must be inside that section.
- **Section ID**: Generated IDs must be unique (e.g., `section-{{random_hex}}`) to ensure the script's `querySelector` targets the correct component on pages with multiple similar sections.

---

## 8. Database Storage Structure

When information is saved in the KalpTree database (PostgreSQL/MongoDB), it is stored as a single flattened string. This string follows a specific sequence which the `RenderHtml` component parses at runtime.

### Final DB String Format:

```html
<style>
  /* All component and section CSS combined */
  .section-1 { ... }
  .btn-primary { ... }
</style>

<!-- Body Content (HTML Sections) -->
<section id="section-1">...</section>
<section id="section-2">...</section>

<script>
  /* All extracted JavaScript logic */
  (function() { ... })();
  (function() { ... })();
</script>
```

### Why this structure?

- **Style Priority**: The `<style>` block is placed at the top so the browser can paint the layout correctly as soon as the body content loads.
- **Fragment-Based**: It does **not** include `<html>` or `<body>` wrappers. It is a "document fragment" that gets injected into the project's layout template.
- **Script Deferral**: The `<script>` block is placed at the end to ensure all DOM elements are rendered before any interactivity is initialized.

---

## 9. External Fonts & JS Libraries

If your component requires external assets (e.g., Google Fonts, FontAwesome, or third-party JS libraries like Chart.js), follow these rules:

### 1. External Fonts (Google Fonts)

Place the `<link>` tag at the very top of your output. The system will automatically extract it and inject it into the editor canvas and the final page.

**Example:**

```html
<!-- Include Google Fonts at the top -->
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Cormorant+Garamond:wght@500&display=swap"
  rel="stylesheet"
/>

<style>
  .my-text {
    font-family: "Cormorant Garamond", serif;
  }
</style>

<section id="custom-font-section">
  <h2 class="my-text">Elegant Typography</h2>
</section>
```

### 2. External JS Libraries (CDN)

Include the `<script src="...">` tag within your fragment. The system will ensure it is loaded before your component's interactive logic runs.

**Example:**

```html
<section id="chart-section">
  <canvas id="myChart"></canvas>
</section>

<!-- Include library via CDN -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
  (function() {
    // Your logic that uses Chart.js
    const ctx = document.querySelector('#chart-section #myChart');
    new Chart(ctx, { ... });
  })();
</script>
```

### Important Notes:

- **Dependencies**: Lucide Icons is already available by default.
- **Placement**: Place external assets (links/scripts) outside the main `<section>` but within the single output string provided to GrapesJS. The parser will handle the rest.
