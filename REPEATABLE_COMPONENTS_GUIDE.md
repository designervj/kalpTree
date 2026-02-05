# Making Inner Components Repeatable in GrapesJS

## Overview

This guide explains how to add a `repeatable` property to component definitions to control whether inner/child components can be duplicated dynamically.

## Implementation Approach

### 1. **Add Custom Property to Component Model**

Add a custom property in the component's model defaults to mark which inner components are repeatable:

```javascript
domc.addType("custom-card", {
  model: {
    defaults: {
      tagName: "div",
      draggable: true,
      droppable: true,
      attributes: { class: "card-component" },
      // ✨ NEW: Add repeatable configuration
      repeatableChildren: {
        enabled: true, // Whether children can be repeated
        selector: ".repeatable-item", // CSS selector for repeatable items
        maxItems: 10, // Optional: maximum number of items
        minItems: 1, // Optional: minimum number of items
      },
    },
  },
});
```

### 2. **Mark Specific Child Components as Repeatable**

For individual child components, you can add a `repeatable` property:

```javascript
domc.addType("list-item", {
  model: {
    defaults: {
      tagName: "li",
      repeatable: true, // ✨ This component can be duplicated
      copyable: true, // Allow copying
      removable: true, // Allow deletion
      attributes: {
        class: "list-item",
        "data-repeatable": "true", // Add data attribute for identification
      },
    },
  },
});
```

### 3. **Use Custom Traits for Dynamic Control**

Add traits to allow users to control repeatability through the UI:

```javascript
domc.addType("repeatable-section", {
  model: {
    defaults: {
      traits: [
        {
          type: "checkbox",
          name: "allowRepeat",
          label: "Allow Item Duplication",
          changeProp: 1,
        },
        {
          type: "number",
          name: "maxItems",
          label: "Max Items",
          min: 1,
          max: 50,
          changeProp: 1,
        },
      ],
    },
    init() {
      // Listen for trait changes
      this.on("change:allowRepeat", this.handleRepeatChange);
      this.on("change:maxItems", this.handleMaxItemsChange);
    },
    handleRepeatChange() {
      const allowRepeat = this.get("allowRepeat");
      // Update children repeatability
      this.components().each((child) => {
        child.set({ copyable: allowRepeat });
      });
    },
    handleMaxItemsChange() {
      const maxItems = this.get("maxItems");
      // Store max items for validation
      this.set("data-max-items", maxItems);
    },
  },
});
```

### 4. **Example: Card with Repeatable List Items**

Based on your HTML structure with the technical architecture card, here's a complete example:

```javascript
// Define the repeatable list item
domc.addType("feature-item", {
  isComponent: (el) => {
    return el.tagName === "LI" && el.closest('[data-component="feature-list"]');
  },
  model: {
    defaults: {
      tagName: "li",
      name: "Feature Item",
      repeatable: true, // ✨ Mark as repeatable
      copyable: true,
      removable: true,
      draggable: "li",
      droppable: false,
      attributes: {
        class: "flex items-start text-sm text-slate-600",
        "data-repeatable": "true",
      },
      content: `
        <span class="text-gold-500 mr-2">✓</span>
        <strong>Feature:</strong> Description
      `,
    },
  },
});

// Define the parent container with repeatable children
domc.addType("feature-list", {
  isComponent: (el) => {
    return el.getAttribute("data-component") === "feature-list";
  },
  model: {
    defaults: {
      tagName: "ul",
      name: "Feature List",
      attributes: {
        class: "space-y-3",
        "data-component": "feature-list",
        "data-repeatable-children": "true", // ✨ Mark that children are repeatable
      },
      components: [{ type: "feature-item" }, { type: "feature-item" }],
      // ✨ Configuration for repeatable children
      repeatableConfig: {
        childType: "feature-item",
        minItems: 1,
        maxItems: 10,
        addButtonText: "Add Feature",
        removeButtonText: "Remove",
      },
      traits: [
        {
          type: "number",
          name: "maxFeatures",
          label: "Maximum Features",
          min: 1,
          max: 20,
          changeProp: 1,
        },
        {
          type: "checkbox",
          name: "allowAddRemove",
          label: "Allow Add/Remove Items",
          changeProp: 1,
        },
      ],
    },
    init() {
      // Add custom methods for managing repeatable items
      this.on("component:add", this.validateItemCount);
      this.on("component:remove", this.validateItemCount);
    },
    validateItemCount() {
      const config = this.get("repeatableConfig") || {};
      const items = this.components().length;
      const max = this.get("maxFeatures") || config.maxItems;
      const min = config.minItems || 1;

      // Disable adding if max reached
      if (items >= max) {
        this.set("canAddMore", false);
      } else {
        this.set("canAddMore", true);
      }

      // Disable removing if min reached
      if (items <= min) {
        this.components().each((child) => child.set({ removable: false }));
      } else {
        this.components().each((child) => child.set({ removable: true }));
      }
    },
  },
});
```

### 5. **Using Data Attributes for Configuration**

You can also store the repeatable configuration in data attributes:

```html
<div
  data-component="card"
  data-repeatable-children="true"
  data-repeatable-selector=".feature-item"
  data-max-items="10"
  data-min-items="1"
>
  <ul class="feature-list">
    <li class="feature-item" data-repeatable="true">Feature 1</li>
    <li class="feature-item" data-repeatable="true">Feature 2</li>
  </ul>
</div>
```

## Practical Usage

### For Your Technical Architecture Card:

```javascript
// In use-editor.ts, add this component type definition

domc.addType("tech-feature", {
  isComponent: (el) => {
    return (
      el.tagName === "LI" && el.closest('[data-component="tech-features"]')
    );
  },
  model: {
    defaults: {
      tagName: "li",
      name: "Tech Feature",
      repeatable: true, // ✨ Repeatable property
      copyable: true,
      removable: true,
      attributes: {
        class: "flex items-start text-sm text-slate-600",
        "data-repeatable": "true",
      },
    },
  },
});

domc.addType("tech-card", {
  model: {
    defaults: {
      tagName: "div",
      attributes: {
        class: "bg-white p-8 rounded-2xl shadow-sm",
        "data-component": "tech-card",
        "data-has-repeatable-children": "true", // ✨ Indicate it has repeatable children
      },
      // ✨ Define which children are repeatable
      repeatableChildren: {
        ".tech-feature": {
          min: 1,
          max: 10,
          addable: true,
          removable: true,
        },
      },
    },
  },
});
```

## Summary

To mark inner components as repeatable, you can:

1. **Add `repeatable: true`** to the component's model defaults
2. **Add `repeatableChildren` configuration** to parent components
3. **Use data attributes** like `data-repeatable="true"` for identification
4. **Add traits** for UI-based control
5. **Implement validation** for min/max items

This approach gives you flexibility to control which components can be duplicated and how many times they can be repeated.
