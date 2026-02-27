export const generateGlobalStyleContent = (cssVars: Record<string, string>) => {
  const cssVarString = Object.entries(cssVars)
    .map(([prop, val]) => `  ${prop}: ${val};`)
    .sort()
    .join('\n');

  const headingStyles = [1, 2, 3, 4, 5, 6].map(num => `
h${num} {
  font-size: var(--h${num}-size);
  font-weight: var(--h${num}-weight);
  line-height: var(--h${num}-lh);
  letter-spacing: var(--h${num}-ls);
  margin-top: 0;
  margin-bottom: 0.5em;
}`).join('\n');

  const buttonStyles = ['primary', 'secondary', 'outline'].map(type => `
.btn-${type} {
  background-color: var(--btn-${type}-bg);
  color: var(--btn-${type}-text);
  border: 1px solid var(--btn-${type}-border);
  border-radius: var(--btn-radius);
  font-size: var(--btn-size);
  height: var(--btn-height);
  transition: all var(--btn-transition);
}
.btn-${type}:hover {
  background-color: var(--btn-${type}-hover-bg);
}`).join('\n');

  return `
:root {
${cssVarString}
}

body {
  font-family: var(--font-body, var(--font-family, sans-serif));
  font-size: var(--body-size, 16px);
  font-weight: var(--body-weight, 400);
  line-height: var(--body-lh, 1.5);
  letter-spacing: var(--body-ls, 0);
  color: var(--text, #000);
  background-color: var(--bg, #fff);
  margin: 0;
  padding: 0;
  background: var(--quantum-black);
}

${headingStyles}

${buttonStyles}

* {
  box-sizing: border-box;
}

p {
  margin-bottom: var(--body-paragraph-gap, 1rem);
}
`;
}