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

export function handleInteractivityChange(
  component: any,
  { type, event, action, target, options }: InteractivityOptions
) {
  if (!component) return;

  const editor = component.em.get("Editor");
  const wrapper = editor.getWrapper();

  // ===============================
  // ADD CLICK → SCROLL
  // ===============================
  if (
    type === "add" &&
    event === "click" &&
    action === "scroll-to" &&
    target
  ) {
    const SCRIPT_ID = "smooth-scroll-script";

    // Add data-scroll-to attribute
    component.addAttributes({
      "data-scroll-to": target,
    });

    // Inject script once
    if (!wrapper.find(`#${SCRIPT_ID}`).length) {
      editor.addComponents({
        tagName: 'script',
        attributes: { id: SCRIPT_ID },
        content: `
          (function () {
      function initScroll() {
        var triggers = document.querySelectorAll('[data-scroll-to]');

        triggers.forEach(function (el) {
          el.onclick = function () {
            var targetId = el.getAttribute('data-scroll-to');
            var targetEl = document.getElementById(targetId);

            if (!targetEl) return;

            var offset = 80; // height of fixed navbar
            var y =
              targetEl.getBoundingClientRect().top +
              window.pageYOffset -
              offset;

            window.scrollTo({
              top: y,
              behavior: 'smooth'
            });
          };
        });
      }

      // Run immediately (important for GrapesJS)
      initScroll();

      // Re-run after GrapesJS renders components
      setTimeout(initScroll, 500);
      setTimeout(initScroll, 1500);
    })();
        `,
        layerable: true,
      });
    }
  }

  // ===============================
  // REMOVE CLICK → SCROLL
  // ===============================
  if (
    type === "remove" &&
    event === "click" &&
    action === "scroll-to"
  ) {
    const SCRIPT_ID = "smooth-scroll-script";

    // Remove data-scroll-to attributes
    component.removeAttributes("data-scroll-to");
    component.removeAttributes("data-scroll-offset");
    component.removeAttributes("data-scroll-duration");

    // Check if any element still uses data-scroll-to
    const stillUsed = wrapper.find("[data-scroll-to]").length > 0;

    // Remove script if unused
    if (!stillUsed) {
      const script = wrapper.find(`#${SCRIPT_ID}`)[0];
      script && script.remove();
    }
  }

  // ===============================
  // ADD CLICK → TOGGLE CLASS
  // ===============================
  if (
    type === "add" &&
    event === "click" &&
    action === "toggle-class"
  ) {
    const SCRIPT_ID = "toggle-class-script";
    const targetSelector = target || "self";
    const className = options?.class || "active";

    component.addAttributes({
      "data-toggle-class": className,
      "data-toggle-target": targetSelector,
    });

    if (!wrapper.find(`#${SCRIPT_ID}`).length) {
      editor.addComponents({
        tagName: 'script',
        attributes: { id: SCRIPT_ID },
        content: `
          (function () {
            document.addEventListener("click", function (e) {
              var trigger = e.target.closest("[data-toggle-class]");
              if (!trigger) return;

              e.preventDefault();

              var className = trigger.getAttribute("data-toggle-class");
              var targetSelector = trigger.getAttribute("data-toggle-target");
              var targetEl = targetSelector === "self" ? trigger : document.querySelector(targetSelector);
              
              if (targetEl) {
                targetEl.classList.toggle(className);
              }
            });
          })();
        `,
        layerable: true,
      });
    }
  }

  // ===============================
  // REMOVE CLICK → TOGGLE CLASS
  // ===============================
  if (
    type === "remove" &&
    event === "click" &&
    action === "toggle-class"
  ) {
    const SCRIPT_ID = "toggle-class-script";

    component.removeAttributes("data-toggle-class");
    component.removeAttributes("data-toggle-target");

    const stillUsed = wrapper.find("[data-toggle-class]").length > 0;
    if (!stillUsed) {
      const script = wrapper.find(`#${SCRIPT_ID}`)[0];
      script && script.remove();
    }
  }

  // ===============================
  // ADD CLICK → ADD CLASS
  // ===============================
  if (
    type === "add" &&
    event === "click" &&
    action === "add-class"
  ) {
    const SCRIPT_ID = "add-class-script";
    const targetSelector = target || "self";
    const className = options?.class || "active";

    component.addAttributes({
      "data-add-class": className,
      "data-add-target": targetSelector,
    });

    if (!wrapper.find(`#${SCRIPT_ID}`).length) {
      editor.addComponents({
        tagName: 'script',
        attributes: { id: SCRIPT_ID },
        content: `
          (function () {
            document.addEventListener("click", function (e) {
              var trigger = e.target.closest("[data-add-class]");
              if (!trigger) return;

              e.preventDefault();

              var className = trigger.getAttribute("data-add-class");
              var targetSelector = trigger.getAttribute("data-add-target");
              var targetEl = targetSelector === "self" ? trigger : document.querySelector(targetSelector);
              
              if (targetEl) {
                targetEl.classList.add(className);
              }
            });
          })();
        `,
        layerable: true,
      });
    }
  }

  // ===============================
  // REMOVE CLICK → ADD CLASS
  // ===============================
  if (
    type === "remove" &&
    event === "click" &&
    action === "add-class"
  ) {
    const SCRIPT_ID = "add-class-script";

    component.removeAttributes("data-add-class");
    component.removeAttributes("data-add-target");

    const stillUsed = wrapper.find("[data-add-class]").length > 0;
    if (!stillUsed) {
      const script = wrapper.find(`#${SCRIPT_ID}`)[0];
      script && script.remove();
    }
  }

  // ===============================
  // ADD CLICK → REMOVE CLASS
  // ===============================
  if (
    type === "add" &&
    event === "click" &&
    action === "remove-class"
  ) {
    const SCRIPT_ID = "remove-class-script";
    const targetSelector = target || "self";
    const className = options?.class || "active";

    component.addAttributes({
      "data-remove-class": className,
      "data-remove-target": targetSelector,
    });

    if (!wrapper.find(`#${SCRIPT_ID}`).length) {
      editor.addComponents({
        tagName: 'script',
        attributes: { id: SCRIPT_ID },
        content: `
          (function () {
            document.addEventListener("click", function (e) {
              var trigger = e.target.closest("[data-remove-class]");
              if (!trigger) return;

              e.preventDefault();

              var className = trigger.getAttribute("data-remove-class");
              var targetSelector = trigger.getAttribute("data-remove-target");
              var targetEl = targetSelector === "self" ? trigger : document.querySelector(targetSelector);
              
              if (targetEl) {
                targetEl.classList.remove(className);
              }
            });
          })();
        `,
        layerable: true,
      });
    }
  }

  // ===============================
  // REMOVE CLICK → REMOVE CLASS
  // ===============================
  if (
    type === "remove" &&
    event === "click" &&
    action === "remove-class"
  ) {
    const SCRIPT_ID = "remove-class-script";

    component.removeAttributes("data-remove-class");
    component.removeAttributes("data-remove-target");

    const stillUsed = wrapper.find("[data-remove-class]").length > 0;
    if (!stillUsed) {
      const script = wrapper.find(`#${SCRIPT_ID}`)[0];
      script && script.remove();
    }
  }

  // ===============================
  // ADD CLICK → SHOW
  // ===============================
  if (
    type === "add" &&
    event === "click" &&
    action === "show" &&
    target
  ) {
    const SCRIPT_ID = "show-element-script";

    component.addAttributes({
      "data-show-target": target,
      "data-show-animation": options?.animation || "none",
      "data-show-duration": options?.duration || "300",
    });

    if (!wrapper.find(`#${SCRIPT_ID}`).length) {
      editor.addComponents({
        tagName: 'script',
        attributes: { id: SCRIPT_ID },
        content: `
          (function () {
            document.addEventListener("click", function (e) {
              var trigger = e.target.closest("[data-show-target]");
              if (!trigger) return;

              e.preventDefault();

              var targetSelector = trigger.getAttribute("data-show-target");
              var animation = trigger.getAttribute("data-show-animation");
              var duration = parseInt(trigger.getAttribute("data-show-duration") || "300");
              var targetEl = document.querySelector(targetSelector);
              
              if (!targetEl) return;

              if (animation === "fade") {
                targetEl.style.opacity = "0";
                targetEl.style.display = "block";
                targetEl.style.transition = "opacity " + duration + "ms";
                setTimeout(function() { targetEl.style.opacity = "1"; }, 10);
              } else {
                targetEl.style.display = "block";
              }
            });
          })();
        `,
        layerable: true,
      });
    }
  }

  // ===============================
  // REMOVE CLICK → SHOW
  // ===============================
  if (
    type === "remove" &&
    event === "click" &&
    action === "show"
  ) {
    const SCRIPT_ID = "show-element-script";

    component.removeAttributes("data-show-target");
    component.removeAttributes("data-show-animation");
    component.removeAttributes("data-show-duration");

    const stillUsed = wrapper.find("[data-show-target]").length > 0;
    if (!stillUsed) {
      const script = wrapper.find(`#${SCRIPT_ID}`)[0];
      script && script.remove();
    }
  }

  // ===============================
  // ADD CLICK → HIDE
  // ===============================
  if (
    type === "add" &&
    event === "click" &&
    action === "hide" &&
    target
  ) {
    const SCRIPT_ID = "hide-element-script";

    component.addAttributes({
      "data-hide-target": target,
      "data-hide-animation": options?.animation || "none",
      "data-hide-duration": options?.duration || "300",
    });

    if (!wrapper.find(`#${SCRIPT_ID}`).length) {
      editor.addComponents({
        tagName: 'script',
        attributes: { id: SCRIPT_ID },
        content: `
          (function () {
            document.addEventListener("click", function (e) {
              var trigger = e.target.closest("[data-hide-target]");
              if (!trigger) return;

              e.preventDefault();

              var targetSelector = trigger.getAttribute("data-hide-target");
              var animation = trigger.getAttribute("data-hide-animation");
              var duration = parseInt(trigger.getAttribute("data-hide-duration") || "300");
              var targetEl = document.querySelector(targetSelector);
              
              if (!targetEl) return;

              if (animation === "fade") {
                targetEl.style.transition = "opacity " + duration + "ms";
                targetEl.style.opacity = "0";
                setTimeout(function() { targetEl.style.display = "none"; }, duration);
              } else {
                targetEl.style.display = "none";
              }
            });
          })();
        `,
        layerable: true,
      });
    }
  }

  // ===============================
  // REMOVE CLICK → HIDE
  // ===============================
  if (
    type === "remove" &&
    event === "click" &&
    action === "hide"
  ) {
    const SCRIPT_ID = "hide-element-script";

    component.removeAttributes("data-hide-target");
    component.removeAttributes("data-hide-animation");
    component.removeAttributes("data-hide-duration");

    const stillUsed = wrapper.find("[data-hide-target]").length > 0;
    if (!stillUsed) {
      const script = wrapper.find(`#${SCRIPT_ID}`)[0];
      script && script.remove();
    }
  }

  // ===============================
  // ADD CLICK → TOGGLE VISIBILITY
  // ===============================
  if (
    type === "add" &&
    event === "click" &&
    action === "toggle" &&
    target
  ) {
    const SCRIPT_ID = "toggle-visibility-script";

    component.addAttributes({
      "data-toggle-visibility": target,
      "data-toggle-animation": options?.animation || "none",
      "data-toggle-duration": options?.duration || "300",
    });

    if (!wrapper.find(`#${SCRIPT_ID}`).length) {
      editor.addComponents({
        tagName: 'script',
        attributes: { id: SCRIPT_ID },
        content: `
          (function () {
            document.addEventListener("click", function (e) {
              var trigger = e.target.closest("[data-toggle-visibility]");
              if (!trigger) return;

              e.preventDefault();

              var targetSelector = trigger.getAttribute("data-toggle-visibility");
              var animation = trigger.getAttribute("data-toggle-animation");
              var duration = parseInt(trigger.getAttribute("data-toggle-duration") || "300");
              var targetEl = document.querySelector(targetSelector);
              
              if (!targetEl) return;

              var isVisible = targetEl.style.display !== "none" && window.getComputedStyle(targetEl).display !== "none";

              if (isVisible) {
                if (animation === "fade") {
                  targetEl.style.transition = "opacity " + duration + "ms";
                  targetEl.style.opacity = "0";
                  setTimeout(function() { targetEl.style.display = "none"; }, duration);
                } else {
                  targetEl.style.display = "none";
                }
              } else {
                if (animation === "fade") {
                  targetEl.style.opacity = "0";
                  targetEl.style.display = "block";
                  targetEl.style.transition = "opacity " + duration + "ms";
                  setTimeout(function() { targetEl.style.opacity = "1"; }, 10);
                } else {
                  targetEl.style.display = "block";
                }
              }
            });
          })();
        `,
        layerable: true,
      });
    }
  }

  // ===============================
  // REMOVE CLICK → TOGGLE VISIBILITY
  // ===============================
  if (
    type === "remove" &&
    event === "click" &&
    action === "toggle"
  ) {
    const SCRIPT_ID = "toggle-visibility-script";

    component.removeAttributes("data-toggle-visibility");
    component.removeAttributes("data-toggle-animation");
    component.removeAttributes("data-toggle-duration");

    const stillUsed = wrapper.find("[data-toggle-visibility]").length > 0;
    if (!stillUsed) {
      const script = wrapper.find(`#${SCRIPT_ID}`)[0];
      script && script.remove();
    }
  }

  // ===============================
  // ADD CLICK → REDIRECT
  // ===============================
  if (
    type === "add" &&
    event === "click" &&
    action === "redirect"
  ) {
    const SCRIPT_ID = "redirect-script";
    const url = options?.url || "";
    const newTab = options?.newTab || false;

    component.addAttributes({
      "data-redirect-url": url,
      "data-redirect-newtab": newTab ? "true" : "false",
    });

    if (!wrapper.find(`#${SCRIPT_ID}`).length) {
      editor.addComponents({
        tagName: 'script',
        attributes: { id: SCRIPT_ID },
        content: `
          (function () {
            document.addEventListener("click", function (e) {
              var trigger = e.target.closest("[data-redirect-url]");
              if (!trigger) return;

              e.preventDefault();

              var url = trigger.getAttribute("data-redirect-url");
              var newTab = trigger.getAttribute("data-redirect-newtab") === "true";
              
              if (url) {
                if (newTab) {
                  window.open(url, "_blank");
                } else {
                  window.location.href = url;
                }
              }
            });
          })();
        `,
        layerable: true,
      });
    }
  }

  // ===============================
  // REMOVE CLICK → REDIRECT
  // ===============================
  if (
    type === "remove" &&
    event === "click" &&
    action === "redirect"
  ) {
    const SCRIPT_ID = "redirect-script";

    component.removeAttributes("data-redirect-url");
    component.removeAttributes("data-redirect-newtab");

    const stillUsed = wrapper.find("[data-redirect-url]").length > 0;
    if (!stillUsed) {
      const script = wrapper.find(`#${SCRIPT_ID}`)[0];
      script && script.remove();
    }
  }

  // ===============================
  // ADD SCROLL → SHOW/HIDE/ADD-CLASS
  // ===============================
  if (
    type === "add" &&
    event === "scroll" &&
    (action === "show" || action === "hide" || action === "add-class")
  ) {
    const SCRIPT_ID = "scroll-observer-script";
    const offset = options?.offset || "0";

    component.addAttributes({
      "data-scroll-action": action,
      "data-scroll-offset": offset,
      ...(action === "add-class" && { "data-scroll-class": options?.class || "active" }),
    });

    if (!wrapper.find(`#${SCRIPT_ID}`).length) {
      editor.addComponents({
        tagName: 'script',
        attributes: { id: SCRIPT_ID },
        content: `
          (function () {
            if (!('IntersectionObserver' in window)) return;

            var observerCallback = function(entries) {
              entries.forEach(function(entry) {
                if (entry.isIntersecting && !entry.target.classList.contains('scroll-triggered')) {
                  entry.target.classList.add('scroll-triggered');
                  var action = entry.target.getAttribute('data-scroll-action');
                  
                  if (action === 'show') {
                    entry.target.style.display = 'block';
                    setTimeout(function() { entry.target.style.opacity = '1'; }, 10);
                  } else if (action === 'add-class') {
                    var className = entry.target.getAttribute('data-scroll-class');
                    if (className) entry.target.classList.add(className);
                  }
                }
              });
            };

            var observer = new IntersectionObserver(observerCallback, {
              threshold: 0.1,
              rootMargin: '0px'
            });

            document.querySelectorAll('[data-scroll-action]').forEach(function(el) {
              observer.observe(el);
            });
          })();
        `,
        layerable: true,
      });
    }

    // Set initial state for "show" action
    if (action === "show") {
      component.addStyle({
        display: "none",
        opacity: "0",
        transition: "opacity 0.3s ease",
      });
    }
  }

  // ===============================
  // REMOVE SCROLL → ACTIONS
  // ===============================
  if (
    type === "remove" &&
    event === "scroll"
  ) {
    const SCRIPT_ID = "scroll-observer-script";

    component.removeAttributes("data-scroll-action");
    component.removeAttributes("data-scroll-offset");
    component.removeAttributes("data-scroll-class");
    component.removeClass("scroll-triggered");

    const stillUsed = wrapper.find("[data-scroll-action]").length > 0;
    if (!stillUsed) {
      const script = wrapper.find(`#${SCRIPT_ID}`)[0];
      script && script.remove();
    }
  }

  console.log(`✅ Interactivity ${type}: ${event} → ${action}`);
}
