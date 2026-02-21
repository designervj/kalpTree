# GrapesJS HTML Compatibility Guidelines

This document outlines the best practices and requirements for creating HTML content that is compatible with the GrapesJS editor in the KalpTree project. These guidelines ensure that the generated HTML is not only functional but also fully editable within the GrapesJS builder's Style Manager.

---

## 🚀 AI Agent Quick Checklist

AI agents generating components **MUST** follow these rules to ensure perfect compatibility:

1.  **Wrap in Section**: Always wrap your component in a `<section>` tag with a descriptive ID.
2.  **No Tailwind**: Do not use Tailwind utility classes. Use semantic class names (e.g., `.hero-title`, `.feature-card`).
3.  **Class-Based Styles**: Define all styles in a `<style>` block using simple classes. This allows GrapesJS to map them to the Style Manager.
4.  **Theme Awareness**: Use CSS variables for colors, spacing, fonts, and radii (see **Section 2** for the full token reference).
5.  **No `!important`**: Never use `!important`. It prevents users from changing styles in the editor.
6.  **Responsive Design**: Use Media Queries (`@media`) within your `<style>` block for responsiveness instead of fixed widths.
7.  **Script Isolation**: Wrap all JavaScript in a complete IIFE (Immediately Invoked Function Expression). See **Section 6** for the exact required pattern.
8.  **No Boilerplate**: Do NOT include `<!DOCTYPE html>`, `<html>`, `<head>`, or `<body>` tags. These are already managed by the GrapesJS canvas.
9.  **Element Scope**: Use only `section`, `header`, or `footer` as the top-level wrapper tag. Every section spans the full width.
10. **Unique Section ID**: Generated IDs must be unique (e.g., `section-{{random_hex}}`) to ensure the script's `querySelector` targets the correct component on pages with multiple similar sections.
11. **No Inline Styles**: Never use `style="..."` on elements. All styling must live inside the `<style>` block.
12. **Button Variants**: Use the correct button token set for primary, secondary, or outline buttons (see **Section 3**).

---

## 1. Structural Requirements

### Section Pattern

All top-level content blocks should be wrapped in a `<section>` tag. This helps GrapesJS identify individual sections for movement and deletion.

```html
<section
  id="features-section-a1b2c3"
  class="kt-section"
  data-gjs-custom-name="Features Section"
>
  <div class="kt-container">
    <!-- Your content here -->
  </div>
</section>

<style>
  .kt-section {
    padding: var(--section-pad-y) var(--container-pad);
    background-color: var(--bg);
  }
  .kt-container {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
</style>
```

> **`data-gjs-custom-name`**: This attribute sets the human-readable label shown in the Layers panel of GrapesJS. Always provide a meaningful name for top-level sections and key components.

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

The project uses a dynamic light/dark theme system. Components **must** use CSS variables exclusively — never hardcode colours, fonts, radii, or spacing values.

> ⚠️ **Important**: All CSS variables listed below are **pre-injected** by the platform runtime into the GrapesJS canvas and the frontend `RenderHtml` component. You do NOT need to define them yourself. Simply use them with `var(--token-name)`.

### 2.1 Brand Core

| Variable           | Default Value | Description                 |
| :----------------- | :------------ | :-------------------------- |
| `var(--primary)`   | `#0D6533`     | Primary brand/action colour |
| `var(--secondary)` | `#98C45F`     | Secondary brand colour      |
| `var(--accent)`    | `#CFE7B1`     | Accent / highlight colour   |
| `var(--dark)`      | `#063A1D`     | Darkest brand shade         |
| `var(--ring)`      | `#98C45F`     | Focus ring colour           |

### 2.2 Neutral / Semantic Colours _(theme-aware)_

These values change automatically between `light` and `dark` themes.

| Variable            | Light Mode             | Dark Mode               | Description              |
| :------------------ | :--------------------- | :---------------------- | :----------------------- |
| `var(--bg)`         | `#F7FAF5`              | `#06130B`               | Page background          |
| `var(--surface)`    | `#FFFFFF`              | `#0A2013`               | Card / panel surface     |
| `var(--surface-2)`  | `#FCFDFB`              | `#0D2818`               | Elevated surface         |
| `var(--text)`       | `#0B1610`              | `#EAF4EC`               | Default body text        |
| `var(--muted-text)` | `#55685B`              | `#A9B8AE`               | Secondary / caption text |
| `var(--border)`     | `rgba(13,101,51,0.14)` | `rgba(152,196,95,0.22)` | Default border           |

### 2.3 Link Colours

| Variable            | Light Mode | Dark Mode |
| :------------------ | :--------- | :-------- |
| `var(--link)`       | `#0D6533`  | `#A9E07A` |
| `var(--link-hover)` | `#0A522A`  | `#C9F2A7` |

### 2.4 Status Colours

| Variable         | Value     | Usage             |
| :--------------- | :-------- | :---------------- |
| `var(--success)` | `#16A34A` | Success states    |
| `var(--warning)` | `#F59E0B` | Warning / caution |
| `var(--danger)`  | `#EF4444` | Error / danger    |
| `var(--info)`    | `#0EA5E9` | Info states       |

### 2.5 Shadows

| Variable           | Value                         |
| :----------------- | :---------------------------- |
| `var(--shadow-sm)` | `0 6px 18px rgba(0,0,0,.06)`  |
| `var(--shadow-md)` | `0 16px 40px rgba(0,0,0,.10)` |

### 2.6 Border Radius

| Variable           | Value  |
| :----------------- | :----- |
| `var(--radius-sm)` | `10px` |
| `var(--radius-md)` | `14px` |
| `var(--radius-lg)` | `18px` |

### 2.7 Typography Tokens

#### Font Families

| Variable              | Fonts                          | Usage         |
| :-------------------- | :----------------------------- | :------------ |
| `var(--font-body)`    | `Inter, system-ui, …`          | Body text     |
| `var(--font-heading)` | `Cormorant Garamond, Georgia…` | Headings      |
| `var(--font-button)`  | `Inter, system-ui, …`          | Button labels |

#### Heading Scale

| Level | Size Token           | Weight Token          | Line-Height        | Letter-Spacing        |
| :---- | :------------------- | :-------------------- | :----------------- | :-------------------- |
| H1    | `--h1-size` → `48px` | `--h1-weight` → `700` | `--h1-lh` → `1.05` | `--h1-ls` → `-0.03em` |
| H2    | `--h2-size` → `38px` | `--h2-weight` → `700` | `--h2-lh` → `1.10` | `--h2-ls` → `-0.02em` |
| H3    | `--h3-size` → `28px` | `--h3-weight` → `650` | `--h3-lh` → `1.15` | `--h3-ls` → `-0.01em` |
| H4    | `--h4-size` → `22px` | `--h4-weight` → `650` | `--h4-lh` → `1.20` | `--h4-ls` → `0em`     |
| H5    | `--h5-size` → `18px` | `--h5-weight` → `600` | `--h5-lh` → `1.25` | `--h5-ls` → `0em`     |
| H6    | `--h6-size` → `16px` | `--h6-weight` → `600` | `--h6-lh` → `1.30` | `--h6-ls` → `0.01em`  |

**Usage example:**

```css
.my-heading {
  font-family: var(--font-heading);
  font-size: var(--h2-size);
  font-weight: var(--h2-weight);
  line-height: var(--h2-lh);
  letter-spacing: var(--h2-ls);
  color: var(--text);
}
```

#### Body Text

| Token                       | Value  | Description              |
| :-------------------------- | :----- | :----------------------- |
| `var(--body-size)`          | `16px` | Base font size           |
| `var(--body-weight)`        | `400`  | Base font weight         |
| `var(--body-lh)`            | `1.75` | Base line-height         |
| `var(--body-ls)`            | `0em`  | Base letter-spacing      |
| `var(--body-maxw)`          | `65ch` | Max readable line length |
| `var(--body-paragraph-gap)` | `14px` | Gap between paragraphs   |

### 2.8 Layout Tokens

| Token                  | Value   | Description                       |
| :--------------------- | :------ | :-------------------------------- |
| `var(--announce-h)`    | `36px`  | Announcement bar height           |
| `var(--nav-h)`         | `74px`  | Navigation bar height             |
| `var(--container-pad)` | `5%`    | Horizontal padding for containers |
| `var(--section-pad-y)` | `120px` | Vertical padding for sections     |

### 2.9 Card / Surface Tokens

| Token                | Light                         | Dark                          |
| :------------------- | :---------------------------- | :---------------------------- |
| `var(--card-bg)`     | `#FFFFFF`                     | `#0B2416`                     |
| `var(--card-border)` | `rgba(0,0,0,.08)`             | `rgba(152,196,95,0.22)`       |
| `var(--card-shadow)` | `0 14px 45px rgba(0,0,0,.08)` | `0 18px 60px rgba(0,0,0,.35)` |

### 2.10 Navigation & Footer

| Token              | Light                    | Dark                 |
| :----------------- | :----------------------- | :------------------- |
| `var(--nav-bg)`    | `rgba(247,250,245,0.82)` | `rgba(6,19,11,0.72)` |
| `var(--footer-bg)` | `#FFFFFF`                | `#071A10`            |

---

## 3. Buttons

Use the built-in button token system. **Never hardcode button colours.**

### 3.1 Button Base Tokens

| Token                   | Value       | Description          |
| :---------------------- | :---------- | :------------------- |
| `var(--btn-size)`       | `14px`      | Font size            |
| `var(--btn-weight)`     | `650`       | Font weight          |
| `var(--btn-ls)`         | `0.02em`    | Letter-spacing       |
| `var(--btn-transform)`  | `uppercase` | Text transform       |
| `var(--btn-radius)`     | `999px`     | Border radius (pill) |
| `var(--btn-height)`     | `44px`      | Minimum height       |
| `var(--btn-pad-x)`      | `18px`      | Horizontal padding   |
| `var(--btn-border-w)`   | `1px`       | Border width         |
| `var(--btn-transition)` | `160ms`     | Transition duration  |

### 3.2 Button Variant Reference

#### Primary Button

```css
.btn-primary {
  background-color: var(--btn-primary-bg); /* #0D6533  / dark: #98C45F */
  color: var(--btn-primary-text); /* #FFFFFF  / dark: #07140C */
  border: var(--btn-border-w) solid var(--btn-primary-border);
}
.btn-primary:hover {
  background-color: var(--btn-primary-hover-bg); /* #0A522A  / dark: #A9E07A */
  color: var(--btn-primary-hover-text);
  border-color: var(--btn-primary-hover-border);
}
```

#### Secondary Button

```css
.btn-secondary {
  background-color: var(--btn-secondary-bg); /* rgba(152,196,95,.18) */
  color: var(--btn-secondary-text); /* var(--dark) / dark: #EAF4EC */
  border: var(--btn-border-w) solid var(--btn-secondary-border);
}
.btn-secondary:hover {
  background-color: var(--btn-secondary-hover-bg);
  border-color: var(--btn-secondary-hover-border);
}
```

#### Outline Button

```css
.btn-outline {
  background-color: var(--btn-outline-bg); /* transparent */
  color: var(--btn-outline-text); /* var(--text) / dark: #EAF4EC */
  border: var(--btn-border-w) solid var(--btn-outline-border);
}
.btn-outline:hover {
  background-color: var(--btn-outline-hover-bg);
  border-color: var(--btn-outline-hover-border);
}
```

### 3.3 Complete Button Example

```html
<button class="kt-btn kt-btn-primary">Get Started</button>
<button class="kt-btn kt-btn-secondary">Learn More</button>
<button class="kt-btn kt-btn-outline">View Demo</button>

<style>
  .kt-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: var(--btn-height);
    padding: 0 var(--btn-pad-x);
    border-radius: var(--btn-radius);
    border-width: var(--btn-border-w);
    border-style: solid;
    font-family: var(--font-button);
    font-size: var(--btn-size);
    font-weight: var(--btn-weight);
    letter-spacing: var(--btn-ls);
    text-transform: var(--btn-transform);
    cursor: pointer;
    transition:
      background-color var(--btn-transition),
      color var(--btn-transition),
      border-color var(--btn-transition);
    text-decoration: none;
  }
  /* Primary */
  .kt-btn-primary {
    background-color: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    border-color: var(--btn-primary-border);
  }
  .kt-btn-primary:hover {
    background-color: var(--btn-primary-hover-bg);
    color: var(--btn-primary-hover-text);
    border-color: var(--btn-primary-hover-border);
  }
  /* Secondary */
  .kt-btn-secondary {
    background-color: var(--btn-secondary-bg);
    color: var(--btn-secondary-text);
    border-color: var(--btn-secondary-border);
  }
  .kt-btn-secondary:hover {
    background-color: var(--btn-secondary-hover-bg);
    color: var(--btn-secondary-hover-text);
    border-color: var(--btn-secondary-hover-border);
  }
  /* Outline */
  .kt-btn-outline {
    background-color: var(--btn-outline-bg);
    color: var(--btn-outline-text);
    border-color: var(--btn-outline-border);
  }
  .kt-btn-outline:hover {
    background-color: var(--btn-outline-hover-bg);
    color: var(--btn-outline-hover-text);
    border-color: var(--btn-outline-hover-border);
  }
</style>
```

---

## 4. Inputs & Form Elements

## 5. Components & Interactive Elements

### Images

Ensure images are responsive using CSS classes.

```html
<img
  src="https://via.placeholder.com/800x600"
  alt="Feature Image"
  class="kt-img"
/>

<style>
  .kt-img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: var(--radius-md);
  }
</style>
```

### Cards

```html
<div class="kt-card">
  <h3 class="kt-card-title">Card Title</h3>
  <p class="kt-card-body">Card description text goes here.</p>
</div>

<style>
  .kt-card {
    background-color: var(--card-bg);
    border: 1px solid var(--card-border);
    box-shadow: var(--card-shadow);
    border-radius: var(--radius-lg);
    padding: 32px;
  }
  .kt-card-title {
    font-family: var(--font-heading);
    font-size: var(--h4-size);
    font-weight: var(--h4-weight);
    color: var(--text);
    margin-bottom: 12px;
  }
  .kt-card-body {
    font-family: var(--font-body);
    font-size: var(--body-size);
    color: var(--muted-text);
    line-height: var(--body-lh);
  }
</style>
```

---

## 6. JavaScript Logic (Scripts)

Scripts are extracted and run in an isolated environment. AI agents must follow this **exact** pattern.

### Script Implementation Protocol

1.  **Complete IIFE Wrapping**: The script **must** open with `(function () {` and close with `})();`. Both the opening and closing are required. A missing opening wrapper will cause a syntax error because `return` is used as a guard inside the function body.
2.  **Guard Against Re-execution**: Use a `window.__flagName` guard to prevent the script from running twice when the page re-renders.
3.  **Component Scoping**: Use the unique section ID to target children. See **"The GrapesJS ID Problem"** section below for why this matters.
4.  **No `document.getElementById`**: Prefer `document.querySelector` scoped to the component's root element.

---

### 🔑 The GrapesJS ID Problem — How to Target Buttons & Links

> **Why does this matter?** GrapesJS automatically assigns **random, unstable IDs** to every child element inside a component (e.g., `id="i4ew"`, `id="i9qx"`). These IDs **change** whenever the page is saved, reloaded, or the component is duplicated. If your script targets a child by its `id`, it will break.

#### What you control vs. what GrapesJS controls

| Element                                   | Who sets the `id`?     | Is it stable?                        |
| :---------------------------------------- | :--------------------- | :----------------------------------- |
| `<section>`                               | **You** (the AI agent) | ✅ Yes — define it yourself          |
| `<div>`, `<button>`, `<a>`, `<img>`, etc. | **GrapesJS** (random)  | ❌ No — changes on every save/reload |

**Rule**: Only use `#id` selectors for the **root `<section>` tag** (which you define). For every child element, use a **class selector** or a **custom `data-*` attribute**, always scoped inside the section root.

---

#### Strategy 1 — Class Selectors (Recommended for Custom JS)

Always target child elements by their **CSS class**, scoped to the section root. Never target them by ID.

```html
<section id="hero-section-a1b2c3" data-gjs-custom-name="Hero Section">
  <div class="kt-container">
    <h1 class="hero-title">Welcome</h1>
    <!-- ✅ Use a class, NOT an id, so GrapesJS random IDs don't matter -->
    <button class="hero-cta-btn">Get Started</button>
    <a class="hero-learn-link" href="#">Learn More</a>
  </div>
</section>

<script>
  (function () {
    if (window.__heroSectionA1b2c3Loaded) return;
    window.__heroSectionA1b2c3Loaded = true;

    // ✅ Only the section root is targeted by id — you control this id
    const root = document.querySelector("#hero-section-a1b2c3");
    if (!root) return;

    // ✅ Children are targeted by CLASS — safe even when GrapesJS re-assigns IDs
    const ctaBtn = root.querySelector(".hero-cta-btn");
    const learnLink = root.querySelector(".hero-learn-link");

    if (ctaBtn) {
      ctaBtn.addEventListener("click", () => {
        window.location.href = "/get-started";
      });
    }

    if (learnLink) {
      learnLink.addEventListener("click", (e) => {
        e.preventDefault();
        document
          .querySelector("#features-section")
          ?.scrollIntoView({ behavior: "smooth" });
      });
    }
  })();
</script>
```

---

#### Strategy 2 — Data Attributes (Best for Zero-JS Interactions)

For common interactions (scroll, redirect, show/hide, toggle class), use the **built-in data-attribute engine**. No JavaScript needed at all. The platform's Interactivity Engine handles them automatically via event delegation, regardless of what ID GrapesJS assigns.

```html
<section id="cta-section-x7y8z9" data-gjs-custom-name="CTA Section">
  <div class="kt-container">
    <!-- Smooth scroll to another section on click — no JS needed -->
    <button class="kt-btn kt-btn-primary" data-scroll-to="#features-section">
      See Features
    </button>

    <!-- Open a URL in a new tab — no JS needed -->
    <a
      class="kt-btn kt-btn-secondary"
      data-redirect-url="https://docs.example.com"
      data-redirect-newtab="true"
    >
      Read Docs
    </a>

    <!-- Toggle a mobile menu visibility — no JS needed -->
    <button class="menu-toggle-btn" data-toggle-visibility="#mobile-menu">
      ☰ Menu
    </button>
  </div>
</section>

<!-- No <script> tag required — data attributes handle everything -->
```

> **Why data attributes are better**: They work even before JS loads, survive GrapesJS ID changes, are readable in the Layers panel, and degrade gracefully.

---

#### Strategy 3 — `data-ref` Attributes (For Complex Custom JS)

When you have multiple elements of the same class and need to target a specific one, add a stable `data-ref` attribute to the element. You control this value — GrapesJS does not overwrite it.

```html
<section id="tabs-section-b3c4d5" data-gjs-custom-name="Tabs Section">
  <div class="kt-container">
    <div class="tabs-nav">
      <!-- Use data-ref to identify specific elements safely -->
      <button class="tab-btn" data-ref="tab-features">Features</button>
      <button class="tab-btn" data-ref="tab-pricing">Pricing</button>
      <button class="tab-btn" data-ref="tab-about">About</button>
    </div>
    <div class="tab-panel" data-ref="panel-features">Features content...</div>
    <div class="tab-panel" data-ref="panel-pricing">Pricing content...</div>
    <div class="tab-panel" data-ref="panel-about">About content...</div>
  </div>
</section>

<style>
  #tabs-section-b3c4d5 .tab-panel {
    display: none;
  }
  #tabs-section-b3c4d5 .tab-panel.active {
    display: block;
  }
  #tabs-section-b3c4d5 .tab-btn.active {
    background-color: var(--primary);
    color: #fff;
  }
</style>

<script>
  (function () {
    if (window.__tabsSectionB3c4d5Loaded) return;
    window.__tabsSectionB3c4d5Loaded = true;

    const root = document.querySelector("#tabs-section-b3c4d5");
    if (!root) return;

    // Target by data-ref — stable, not affected by GrapesJS random IDs
    const tabBtns = root.querySelectorAll(".tab-btn[data-ref]");
    const tabPanels = root.querySelectorAll(".tab-panel[data-ref]");

    function showTab(tabRef) {
      tabBtns.forEach((btn) =>
        btn.classList.toggle("active", btn.dataset.ref === tabRef),
      );
      tabPanels.forEach((panel) =>
        panel.classList.toggle(
          "active",
          panel.dataset.ref === "panel-" + tabRef.replace("tab-", ""),
        ),
      );
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => showTab(btn.dataset.ref));
    });

    // Activate the first tab by default
    if (tabBtns[0]) showTab(tabBtns[0].dataset.ref);
  })();
</script>
```

---

#### Quick Reference — Do's and Don'ts for Element Targeting

| Pattern                                          | Safe? | Notes                                                                           |
| :----------------------------------------------- | :---: | :------------------------------------------------------------------------------ |
| `document.querySelector("#my-section-id")`       |  ✅   | Only for the root `<section>` you defined                                       |
| `root.querySelector(".my-class")`                |  ✅   | Class selectors scoped to root — always safe                                    |
| `root.querySelector("[data-ref='my-btn']")`      |  ✅   | Custom data-ref you defined — always safe                                       |
| `data-scroll-to`, `data-redirect-url`, etc.      |  ✅   | Best — zero JS, handled by platform engine                                      |
| `document.querySelector("#i4ew")`                |  ❌   | GrapesJS random ID — changes on every save                                      |
| `document.getElementById("some-child-id")`       |  ❌   | Random GrapesJS ID — will break                                                 |
| `document.querySelector(".my-class")` (unscoped) |  ⚠️   | Works but may hit wrong element on multi-section pages — always scope to `root` |

---

> ⚠️ **Critical Pattern Warning**: The IIFE must contain **both** the opening `(function () {` AND the closing `})();`. Omitting either half will produce a broken script. See the correct pattern below.

**Correct Script Pattern:**

```html
<script>
  (function () {
    // 1. Guard against re-execution
    if (window.__myComponentLoaded) return;
    window.__myComponentLoaded = true;

    // 2. Select the component root
    const section = document.querySelector("#section-a6b2c3");
    if (!section) return;

    // 3. Perform logic inside the section scope
    const tabBtns = section.querySelectorAll(".tab-btn");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Toggle logic here
      });
    });
  })();
</script>
```

**❌ Broken Pattern (missing opening wrapper):**

```html
<script>
    /* WRONG — this will throw a SyntaxError because
       'return' is not allowed at the top level */
    if (window.__myComponentLoaded) return;
    window.__myComponentLoaded = true;
    // ... code ...
  })(); /* ← this closing brace has no matching opening (function() { */
</script>
```

### Built-in Interactivity Engine (Data Attributes)

The platform automatically injects a **global Interactivity Engine** script into every page. For common interactions, you can use **HTML data attributes** instead of writing custom JavaScript. The engine handles these automatically via event delegation:

| Data Attribute                                              | Trigger                       | Action Description                              |
| :---------------------------------------------------------- | :---------------------------- | :---------------------------------------------- |
| `data-scroll-to="#id"`                                      | click                         | Smooth-scrolls to the element with the given ID |
| `data-redirect-url="url"`                                   | click                         | Redirects to the URL                            |
| `data-redirect-newtab="true"`                               | click                         | Opens URL in a new tab                          |
| `data-toggle-class="cls"` + `data-toggle-target="selector"` | click                         | Toggles a CSS class on a target                 |
| `data-show-target="sel"`                                    | click                         | Shows a hidden element                          |
| `data-hide-target="sel"`                                    | click                         | Hides a visible element                         |
| `data-toggle-visibility="sel"`                              | click                         | Toggles element visibility                      |
| `data-scroll-action="show"` / `"add-class"`                 | scroll (IntersectionObserver) | Triggers an action when element enters viewport |

**Data-attribute interactivity example:**

```html
<section id="cta-section-x7y8z9" data-gjs-custom-name="CTA Section">
  <div class="kt-container">
    <!-- This button will smooth-scroll to #contact on click — no JS needed -->
    <button class="kt-btn kt-btn-primary" data-scroll-to="#contact">
      Contact Us
    </button>

    <!-- This button opens a URL in a new tab — no JS needed -->
    <a
      class="kt-btn kt-btn-secondary"
      data-redirect-url="https://example.com"
      data-redirect-newtab="true"
    >
      Visit Site
    </a>
  </div>
</section>

<style>
  /* No JS required for the interactions above */
</style>
```

---

## 7. Common Errors to Avoid

- ❌ **Using Tailwind**: Do not use `w-full`, `mt-4`, etc. Define these in your CSS block. _(The canvas loads Tailwind internally but your component must not depend on it.)_
- ❌ **Fixed Pixel Widths**: Avoid `width: 1200px`. Use `max-width: 100%` or `max-width: 1200px`.
- ❌ **Complex CSS Selectors**: GrapesJS may struggle to map complex selectors. Keep selectors flat.
- ❌ **Hardcoded Colours**: Never use `#0D6533` — use `var(--primary)` instead.
- ❌ **Hardcoded Font Names**: Never hardcode `"Inter"` — use `var(--font-body)`.
- ❌ **Hardcoded Radii / Spacing**: Use `var(--radius-md)`, `var(--section-pad-y)`, etc.
- ❌ **Boilerplate Tags**: Do NOT use `<html>`, `<head>`, or `<body>`.
- ❌ **Inline Styles**: Do NOT use `style="..."` on any element.
- ❌ **`!important`**: Never use it — it blocks the user from editing styles in the editor.
- ❌ **`:root { }` blocks**: Do NOT define `:root { }` CSS variable blocks. The platform injects these for you. A custom `:root` will conflict with the global token injection in `injectCanvasStyles`.
- ❌ **Incomplete IIFE**: A script that ends with `})();` but is **missing** the opening `(function () {` will fail with a `SyntaxError`. Always include the full IIFE wrapper.
- ❌ **`document.getElementById` in scripts**: Prefer `document.querySelector` scoped inside your section's root element to avoid targeting the wrong element on multi-section pages.

---

## 8. Standard Component Structure for AI Agents

### Should I provide the `<head>` tag?

**NO.** Do not provide a `<head>` tag.

- In GrapesJS, the `<head>` is managed by the editor framework. Adding it will result in double head tags or broken imports.
- Global styles (including the full `:root` design token system) are already injected by the KalpTree `injectCanvasStyles` runtime into the canvas iframe head, and by the `RenderHtml` component on the frontend.
- Output only the **Style**, **Partial HTML**, and **Script** blocks.

### The Standard Template

AI Agents should output the component **in this exact order**:

1.  **CSS Block**: `<style> ... </style>` — Contains all component styling. Scope ALL rules to your section ID using `#section-id .class-name { }` to prevent leaking styles to other sections.
2.  **HTML Block**: `<section> ... </section>` — The visual structure.
3.  **JS Block**: `<script> ... </script>` — The interactivity wrapper (**optional** if using data-attribute interactions).

### Scoping Styles to Your Section ID

Because a page can have multiple sections, all CSS rules **must** be prefixed with the section's unique ID to prevent style collisions:

```css
/* ✅ CORRECT — scoped to this section only */
#section-unique-id .hero-title { ... }
#section-unique-id .hero-lead  { ... }

/* ❌ WRONG — leaks to all sections on the page */
.hero-title { ... }
.hero-lead  { ... }
```

> **Note on the `<style>` tag**: The `id` attribute of a `<style>` tag (e.g., `<style id="my-styles">`) is **not** the same as the CSS `#` id selector. The `#section-id` prefix you see inside the `<style>` block is a **CSS selector**, not an HTML attribute. Do NOT put `#` inside the `id` attribute of the style tag itself.

**Full Example of AI Agent Output:**

```html
<!-- 1. STYLE TAGS FIRST — scoped by section ID -->
<style>
  #section-unique-id .hero-title {
    font-family: var(--font-heading);
    font-size: var(--h1-size);
    font-weight: var(--h1-weight);
    line-height: var(--h1-lh);
    letter-spacing: var(--h1-ls);
    color: var(--text);
  }
  #section-unique-id .hero-lead {
    font-size: var(--body-size);
    color: var(--muted-text);
    max-width: var(--body-maxw);
  }
  #section-unique-id .scroll-btn {
    /* Uses button token set */
    height: var(--btn-height);
    padding: 0 var(--btn-pad-x);
    border-radius: var(--btn-radius);
    background-color: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    border: var(--btn-border-w) solid var(--btn-primary-border);
    font-size: var(--btn-size);
    font-weight: var(--btn-weight);
    letter-spacing: var(--btn-ls);
    text-transform: var(--btn-transform);
    cursor: pointer;
    transition: background-color var(--btn-transition);
  }
  #section-unique-id .scroll-btn:hover {
    background-color: var(--btn-primary-hover-bg);
    border-color: var(--btn-primary-hover-border);
  }
  #section-unique-id .result-box {
    background-color: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    padding: 20px;
    color: var(--text);
  }
</style>

<!-- 2. SEMANTIC HTML (No <html>, <head>, or <body> tags) -->
<section id="section-unique-id" data-gjs-custom-name="My Component">
  <div class="kt-container">
    <h1 class="hero-title">Welcome to KalpTree</h1>
    <p class="hero-lead">Build beautiful pages with ease.</p>
    <button class="scroll-btn">Scroll Down</button>
    <div class="result-box"></div>
  </div>
</section>

<!-- 3. SCRIPT TAG LAST (complete IIFE — both opening and closing are required) -->
<script>
  (function () {
    // Guard: prevent re-execution on re-renders
    if (window.__sectionUniqueIdLoaded) return;
    window.__sectionUniqueIdLoaded = true;

    const root = document.querySelector("#section-unique-id");
    if (!root) return;

    // --- Example 1: Scroll to another section ---
    const scrollBtn = root.querySelector(".scroll-btn");
    if (scrollBtn) {
      scrollBtn.addEventListener("click", () => {
        const targetSection = document.querySelector("#next-section");
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    // --- Example 2: API Call with Fetch ---
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
    fetchData();
  })();
</script>
```

---

### Final HTML String Format (Multi-Section Pages)

```html
<style>
  /* All component and section CSS combined — each scoped by section ID */
  #section-1 .hero-title {
    font-family: var(--font-heading);
    font-size: var(--h1-size);
  }
  #section-2 .feature-card {
    background-color: var(--card-bg);
    border-radius: var(--radius-lg);
  }
</style>

<!-- Body Content (HTML Sections) -->
<section id="section-1">...</section>
<section id="section-2">...</section>

<script>
  /* All extracted JavaScript logic — each in its own complete IIFE */
  (function () {
    if (window.__section1Loaded) return;
    window.__section1Loaded = true;
    /* section-1 logic */
  })();
  (function () {
    if (window.__section2Loaded) return;
    window.__section2Loaded = true;
    /* section-2 logic */
  })();
</script>
```

### Why this structure?

- **Style Priority**: The `<style>` block is placed at the top so the browser can paint the layout correctly as soon as the body content loads.
- **No `:root` block**: Do not include a `:root { }` block in your output. The design tokens are injected by `injectCanvasStyles` (editor) and `RenderHtml` (frontend) — adding your own will create conflicts with the platform's variable injection.
- **Fragment-Based**: It does **not** include `<html>` or `<body>` wrappers. It is a "document fragment" injected into the project's layout template.
- **Script Deferral**: The `<script>` block is placed at the end to ensure all DOM elements are rendered before any interactivity is initialized.
- **Complete IIFE**: Both `(function () {` and `})();` must be present. The guard flag (`window.__flag`) prevents the script from running twice when the component re-renders in the editor.

---

## 9. External Fonts & JS Libraries

If your component requires external assets (e.g., Google Fonts, FontAwesome, or third-party JS libraries like Chart.js), follow these rules.

### 1. External Fonts (Google Fonts)

The two brand fonts (`Inter` and `Cormorant Garamond`) are already loaded by the platform. Only add a `<link>` for additional decorative fonts. Place it at the very top of your output.

**Example:**

```html
<!-- Include additional Google Fonts at the top -->
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap"
  rel="stylesheet"
/>

<style>
  #custom-font-section .my-display-text {
    font-family: "Playfair Display", serif;
  }
</style>

<section id="custom-font-section">
  <h2 class="my-display-text">Elegant Typography</h2>
</section>
```

### 2. External JS Libraries (CDN)

Include the `<script src="...">` tag within your fragment. The system will ensure it is loaded before your component's interactive logic runs.

**Example:**

```html
<section id="chart-section">
  <canvas id="myChart"></canvas>
</section>

<!-- Include library via CDN — place BEFORE your inline script -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
  (function () {
    if (window.__chartSectionLoaded) return;
    window.__chartSectionLoaded = true;

    const ctx = document.querySelector("#chart-section #myChart");
    if (!ctx) return;
    new Chart(ctx, {
      /* chart config */
    });
  })();
</script>
```

### Important Notes

- **Pre-loaded dependencies**: Lucide Icons and the two brand fonts (`Inter`, `Cormorant Garamond`) are available globally by default — no extra `<link>` needed.
- **Placement**: Place external assets (`<link>` / `<script src>`) outside the main `<section>` but within the single output string. The parser will handle the rest.
- **CDN scripts before inline scripts**: Always place `<script src="...">` tags **before** your inline `<script>` block that consumes the library. This ensures the library is available when your IIFE runs.
