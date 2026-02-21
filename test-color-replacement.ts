
import { updateCssWithColors } from './src/components/editor/style-editor/GlobalStyelModel';

const samplePalette = {
    brand: {
        accent: "#BFDBFE",
        border: "#D6E0F0",
        dark: "#0B1E3A",
        mutedText: "#5B6B82",
        primary: "#1E5DB3",
        ring: "#3B82F6",
        secondary: "#3B82F6",
        text: "#0B1E3A",
    },
    buttons: {
        outline: {
            bg: "transparent",
            border: "#93C5FD",
            hoverBg: "#F0F7FF",
            hoverBorder: "#60A5FA",
            hoverText: "#0B1E3A",
            text: "#0B1E3A",
        },
        primary: {
            bg: "#1E5DB3",
            border: "#1E5DB3",
            hoverBg: "#174A91",
            hoverBorder: "#174A91",
            hoverText: "#FFFFFF",
            text: "#FFFFFF",
        },
        secondary: {
            bg: "#EFF6FF",
            border: "#D6E0F0",
            hoverBg: "#DBEAFE",
            hoverBorder: "#C7D7F2",
            hoverText: "#0B1E3A",
            text: "#0B1E3A",
        }
    }
};

const sampleCss = `
:root {
    /* Brand Core */
    --primary: #0D6533;
    --secondary: #98C45F;
    --accent: #CFE7B1;
    --dark: #063A1D;
    --ring: #98C45F;
    --text: #111;
    --muted-text: #666;
    --border: rgba(0, 0, 0, .12);

    /* Button: PRIMARY */
    --btn-primary-bg: var(--primary);
    --btn-primary-text: #FFFFFF;
    --btn-primary-border: var(--primary);
    --btn-primary-hover-bg: #0A522A;
    --btn-primary-hover-text: #FFFFFF;
    --btn-primary-hover-border: #0A522A;

    /* Button: SECONDARY */
    --btn-secondary-bg: rgba(152, 196, 95, .18);
    --btn-secondary-text: var(--dark);
    --btn-secondary-border: rgba(152, 196, 95, .35);
    --btn-secondary-hover-bg: rgba(152, 196, 95, .26);
    --btn-secondary-hover-text: var(--dark);
    --btn-secondary-hover-border: rgba(152, 196, 95, .55);

    /* Button: OUTLINE */
    --btn-outline-bg: transparent;
    --btn-outline-text: var(--text);
    --btn-outline-border: rgba(152, 196, 95, .45);
    --btn-outline-hover-bg: rgba(152, 196, 95, .14);
    --btn-outline-hover-text: var(--text);
    --btn-outline-hover-border: rgba(152, 196, 95, .70);
}
`;

const result = updateCssWithColors(sampleCss, samplePalette);

console.log("Original CSS Sample Check:");
console.log("--primary:", sampleCss.includes("--primary: #0D6533"));

console.log("\nUpdated CSS Results:");
const expectedValues = [
    "--primary: #1E5DB3",
    "--secondary: #3B82F6",
    "--accent: #BFDBFE",
    "--dark: #0B1E3A",
    "--btn-primary-bg: #1E5DB3",
    "--btn-secondary-bg: #EFF6FF",
    "--btn-outline-border: #93C5FD"
];

expectedValues.forEach(val => {
    const present = result.includes(val);
    console.log(`${val} present: ${present}`);
});

if (expectedValues.every(val => result.includes(val))) {
    console.log("\n✅ ALL TESTS PASSED");
} else {
    console.log("\n❌ SOME TESTS FAILED");
    console.log("\nFull Result:\n", result);
}
