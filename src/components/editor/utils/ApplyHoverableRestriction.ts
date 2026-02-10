  // Helper function to recursively apply hoverable restriction
  
  
    // Helper function to check if a component is inside a section tag
  export const isComponentUnderSection = (component: any): boolean => {
    if (!component) return false;
    let current = typeof component.parent === 'function' ? component.parent() : component.parent;
    while (current) {
      if (current.get('tagName') === 'section') {
        return true;
      }
      current = typeof current.parent === 'function' ? current.parent() : current.parent;
    }
    return false;
  };


  export const applyHoverableRestriction = (component: any) => {
    if (!component) return;

    const tagName = component.get('tagName');
    if (tagName === 'div' && isComponentUnderSection(component)) {
      component.set('hoverable', false);
    }
    if(tagName === 'body'){
      component.set('hoverable', false);
    }

    const children = component.get('components');
    if (children && children.models) {
      children.models.forEach((child: any) => applyHoverableRestriction(child));
    } else if (Array.isArray(children)) {
      children.forEach((child: any) => applyHoverableRestriction(child));
    }
  };