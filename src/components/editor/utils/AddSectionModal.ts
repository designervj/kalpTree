export const openAddSectionModal = (editor: any, component: any) => {
  if (!editor || !component) return;

  const index = component.index();
  const componentName = component.getName() || 'this section';

  editor.Modal.open({
    title: 'Add New Section',
    content: `
      <div style="padding: 24px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <p style="margin-bottom: 24px; color: #4b5563; font-size: 15px; line-height: 1.5;">
          Choose a section template to add after <b>${componentName}</b>.
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="template-item" onclick="window.parent.postMessage({type: 'ADD_SECTION', index: ${index + 1}, template: 'basic'}, '*')">
            <div class="template-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>
            </div>
            <span class="template-label">Basic Section</span>
          </div>
          <div class="template-item" onclick="window.parent.postMessage({type: 'ADD_SECTION', index: ${index + 1}, template: 'feature'}, '*')">
            <div class="template-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <span class="template-label">Feature Section</span>
          </div>
        </div>
      </div>
      <style>
        .template-item {
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          background: white;
        }
        .template-item:hover {
          border-color: #6366f1;
          background-color: #f5f3ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
        }
        .template-icon {
          width: 48px;
          height: 48px;
          background-color: #f3f4f6;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
          transition: background-color 0.2s ease;
        }
        .template-item:hover .template-icon {
          background-color: #e0e7ff;
        }
        .template-label {
          font-weight: 600;
          font-size: 14px;
          color: #1f2937;
        }
      </style>
    `,
  });
};
