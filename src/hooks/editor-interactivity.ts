/**
 * Utility to handle interactivity changes in the GrapesJS editor.
 * This refactors the complex logic for adding/removing interactions 
 * into a separate file for better maintainability.
 */

export interface InteractivityOptions {
  type: string;
  event: string;
  action: string;
  target?: string;
  options?: any;
}

/**
 * Returns a single, unified script that handles all interactivity types.
 * It includes helper functions and a section for generated component handlers.
 */
export function getGlobalInteractivityScript(dynamicHandlers = "") {
  return `
  // Ensure we don't double-register the global listener
  if (window.__interactivityEngineLoaded) {
    console.log('🔄 KalpTree Interactivity Engine Already Shared');
    return;
  }
  window.__interactivityEngineLoaded = true;

  console.log('🚀 KalpTree Interactivity Engine Loaded');

  // --- HELPER FUNCTIONS ---
  function smoothScroll(targetId) {
    var targetEl = document.getElementById(targetId) || document.querySelector(targetId);
    if (!targetEl) return;
    var offset = 80;
    var y = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  function handleVisibility(selector, action, anim, dur) {
    var targetEl = document.querySelector(selector);
    if (!targetEl) return;
    
    var isShowing = action === 'show' || (action === 'toggle' && (targetEl.style.display === 'none' || getComputedStyle(targetEl).display === 'none'));

    if (isShowing) {
      if (anim === 'fade') {
        targetEl.style.opacity = '0';
        targetEl.style.display = 'block';
        setTimeout(function() { 
          targetEl.style.transition = 'opacity ' + dur + 'ms';
          targetEl.style.opacity = '1'; 
        }, 10);
      } else {
        targetEl.style.display = 'block';
      }
    } else {
      if (anim === 'fade') {
        targetEl.style.transition = 'opacity ' + dur + 'ms';
        targetEl.style.opacity = '0';
        setTimeout(function() { targetEl.style.display = 'none'; }, dur);
      } else {
        targetEl.style.display = 'none';
      }
    }
  }

  // --- COMPONENT HANDLERS ---
  /* INTERACTION_HANDLERS_START */
${dynamicHandlers}
  /* INTERACTION_HANDLERS_END */

  // --- GLOBAL DELEGATION (Fallback for attributes) ---
  document.addEventListener('click', function(e) {
    var target = e.target;
    
    // Check if there is already a specific handler that called preventDefault
    if (e.defaultPrevented) return;

    // REDIRECT
    var redirectTrigger = target.closest('[data-redirect-url]');
    if (redirectTrigger) {
      var url = redirectTrigger.getAttribute('data-redirect-url');
      var newTab = redirectTrigger.getAttribute('data-redirect-newtab') === 'true';
      
      if (url) {
        console.log('🔗 Interactivity: Redirecting to', url, 'in', newTab ? 'new tab' : 'same tab');
        
        // Fix for hash URLs in new tabs: prepend current path
        if (newTab && url.startsWith('#')) {
          url = window.location.pathname + url;
        }

        e.preventDefault();
        if (newTab) {
          var win = window.open(url, '_blank');
          if (win) {
            win.focus();
          } else {
            window.location.href = url; // Fallback
          }
        } else {
          window.location.href = url;
        }
      }
      return;
    }

    // SCROLL TO
    var scrollTrigger = target.closest('[data-scroll-to]');
    if (scrollTrigger) {
      e.preventDefault();
      smoothScroll(scrollTrigger.getAttribute('data-scroll-to'));
      return;
    }

    // TOGGLE/ADD/REMOVE CLASS
    var classTrigger = target.closest('[data-toggle-class], [data-add-class], [data-remove-class]');
    if (classTrigger) {
      e.preventDefault();
      var action = classTrigger.hasAttribute('data-toggle-class') ? 'toggle' : 
                   (classTrigger.hasAttribute('data-add-class') ? 'add' : 'remove');
      var className = classTrigger.getAttribute('data-' + action + '-class');
      var selector = classTrigger.getAttribute('data-' + action + '-target');
      var targetEl = selector === 'self' ? classTrigger : document.querySelector(selector);
      if (targetEl && className) targetEl.classList[action](className);
      return;
    }

    // VISIBILITY
    var visibilityTrigger = target.closest('[data-show-target], [data-hide-target], [data-toggle-visibility]');
    if (visibilityTrigger) {
      e.preventDefault();
      var action = visibilityTrigger.hasAttribute('data-show-target') ? 'show' :
                   (visibilityTrigger.hasAttribute('data-hide-target') ? 'hide' : 'toggle');
      var selector = visibilityTrigger.getAttribute('data-' + action + (action === 'toggle' ? '-visibility' : '-target'));
      var anim = visibilityTrigger.getAttribute('data-' + action + '-animation') || 'none';
      var dur = parseInt(visibilityTrigger.getAttribute('data-' + action + '-duration') || '300');
      handleVisibility(selector, action, anim, dur);
      return;
    }
  });

  // --- SCROLL OBSERVER ---
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !entry.target.classList.contains('scroll-triggered')) {
          entry.target.classList.add('scroll-triggered');
          var action = entry.target.getAttribute('data-scroll-action');
          if (action === 'show') {
            entry.target.style.opacity = '1';
            entry.target.style.display = 'block';
          } else if (action === 'add-class') {
            var cls = entry.target.getAttribute('data-scroll-class');
            if (cls) entry.target.classList.add(cls);
          }
        }
      });
    }, { threshold: 0.1 });

    function initObservers() {
      document.querySelectorAll('[data-scroll-action]').forEach(function(el) {
        observer.observe(el);
      });
    }
    
    initObservers();
    setTimeout(initObservers, 1000);
  }
})();
  `;
}

/**
 * Scans the entire document for components with interactivity attributes
 * and ensures the global script is present.
 */
export function syncInteractivityScript(editor: any) {
  if (!editor || !editor.getJs || !editor.setJs) return;

  const wrapper = editor.Components.getWrapper();
  if (!wrapper) return;


  let dynamicHandlers = "";



  // Update the global script
  const fullScript = getGlobalInteractivityScript(dynamicHandlers);

  // Apply to editor
  if (editor.setJs) {
    editor.setJs(fullScript);
  }

  // Also inject directly into the canvas document for immediate effect in editor
  if (editor.Canvas) {
    const frame = editor.Canvas.getFrameEl();
    const doc = frame?.contentDocument;
    if (doc) {
      // Remove old script if exists
      doc.getElementById('kalptree-interactivity-runtime')?.remove();

      const script = doc.createElement('script');
      script.id = 'kalptree-interactivity-runtime';
      // Remove the guard from the runtime version to ensure it refreshes handlers if needed
      // (Though since we moved to delegation, the code itself is static)
      script.innerHTML = fullScript;
      doc.body.appendChild(script);
      console.log('✅ Injected interactivity runtime into canvas');
    }
  }
}

export function handleInteractivityChange(
  component: any,
  { type, event, action, target, options }: InteractivityOptions,
  editor?: any // Added editor to support script sync
) {
  console.log("component", component);
  console.log("type", type);
  console.log("event", event);
  console.log("action", action);
  console.log("target", target);
  console.log("options", options);
  if (!component) return;

  // REMOVE ACTIONS
  if (type === "remove") {
    if (action === "scroll-to") component.removeAttributes("data-scroll-to");
    if (action === "toggle-class") component.removeAttributes(["data-toggle-class", "data-toggle-target"]);
    if (action === "add-class") component.removeAttributes(["data-add-class", "data-add-target"]);
    if (action === "remove-class") component.removeAttributes(["data-remove-class", "data-remove-target"]);
    if (action === "show") component.removeAttributes(["data-show-target", "data-show-animation", "data-show-duration"]);
    if (action === "hide") component.removeAttributes(["data-hide-target", "data-hide-animation", "data-hide-duration"]);
    if (action === "toggle") component.removeAttributes(["data-toggle-visibility", "data-toggle-animation", "data-toggle-duration"]);
    if (action === "redirect") component.removeAttributes(["data-redirect-url", "data-redirect-newtab"]);
    if (event === "scroll") component.removeAttributes(["data-scroll-action", "data-scroll-offset", "data-scroll-class"]);
  }

  // ADD ACTIONS - Manage attributes
  if (type === "add" || type === "update") {
    // Ensure component has an ID if it's going to have a script handler
    if (!component.getId()) {
      component.setId(`comp-${Date.now()}`);
    }

    if (event === "click") {
      if (action === "scroll-to" && target) {
        component.addAttributes({ "data-scroll-to": target });
      }

      if (action === "toggle-class") {
        component.addAttributes({
          "data-toggle-class": options?.class || "active",
          "data-toggle-target": target || "self",
        });
      }

      if (action === "add-class") {
        component.addAttributes({
          "data-add-class": options?.class || "active",
          "data-add-target": target || "self",
        });
      }

      if (action === "remove-class") {
        component.addAttributes({
          "data-remove-class": options?.class || "active",
          "data-remove-target": target || "self",
        });
      }

      if (action === "show" && target) {
        component.addAttributes({
          "data-show-target": target,
          "data-show-animation": options?.animation || "none",
          "data-show-duration": options?.duration || "300",
        });
      }

      if (action === "hide" && target) {
        component.addAttributes({
          "data-hide-target": target,
          "data-hide-animation": options?.animation || "none",
          "data-hide-duration": options?.duration || "300",
        });
      }

      if (action === "toggle" && target) {
        component.addAttributes({
          "data-toggle-visibility": target,
          "data-toggle-animation": options?.animation || "none",
          "data-toggle-duration": options?.duration || "300",
        });
      }

      if (action === "redirect") {
        const url = options?.url || "";
        const isNewTab = (options?.newTab || target === "_blank");
        component.addAttributes({
          "data-redirect-url": url,
          "data-redirect-newtab": isNewTab ? "true" : "false",
        });

        // If it's a link component, sync native attributes too
        if (component.get('tagName') === 'a') {
          component.addAttributes({
            href: url || "#",
            target: isNewTab ? "_blank" : "_self"
          });
        }
      }
    }

    if (event === "scroll") {
      component.addAttributes({
        "data-scroll-action": action,
        "data-scroll-offset": options?.offset || "0",
        ...(action === "add-class" && { "data-scroll-class": options?.class || "active" }),
      });
      if (action === "show") {
        component.addStyle({ display: "none", opacity: "0", transition: "opacity 0.3s ease" });
      }
    }
  }

  // Sync the global script if editor is provided
  if (editor) {
    syncInteractivityScript(editor);
  }

  console.log(`✅ Interactivity updated and synced: ${event} → ${action}`);
}
