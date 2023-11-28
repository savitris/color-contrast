console.log(`foreground ${process.argv[2]}`);
console.log(`background ${process.argv[3]}`);
const themeTokens = require("@utrecht/design-tokens/dist/index.json");
const themeColors = themeTokens
  .filter((token) => {
    return (
      token["$extensions"] &&
      token["$extensions"]["nl.nldesignsystem.css.property"] &&
      token["$extensions"]["nl.nldesignsystem.css.property"]["syntax"] ===
        "<color>"
    );
  })
  .map((token) => token.value)
  .filter(Boolean);

// console.log(themeColors);
//this allows you to see all of the items of the array instead of just the first 100
console.dir(themeColors, { maxArrayLength: null });

const foreground = process.argv[2];
const background = process.argv[3];

const Color = require("color");

function getContrastRatio(color1, color2) {
  const luminance1 = Color(color1).luminosity();
  const luminance2 = Color(color2).luminosity();

  const brighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (brighter + 0.05) / (darker + 0.05);
}

function findAccessibleTextColor(background, textColorOptions) {
  const MIN_CONTRAST_RATIO = 4.5; // WCAG AA standard

  for (const textColor of textColorOptions) {
    const contrastRatio = getContrastRatio(textColor, background);

    if (contrastRatio >= MIN_CONTRAST_RATIO) {
      return textColor;
    }
  }

  // If no suitable text color is found, you might want to handle this case accordingly
  return null;
}

// Example usage
const backgroundColor = background; // Replace with your background color
const textColors = [foreground, ...themeColors]; // Replace with your text color options

const accessibleTextColor = findAccessibleTextColor(
  backgroundColor,
  textColors
);

if (accessibleTextColor) {
  if (accessibleTextColor == foreground) {
    console.log(
      `The foreground color given meets the minimum contrast criteria determined by WCAG: ${accessibleTextColor}`
    );
  } else {
    console.log(
      `The foreground color given does not meet the minimum color contrast WCAG standard. The first color from the design tokens pallette that meets this standard is: ${accessibleTextColor}`
    );
  }
} else {
  console.log("No accessible text color found.");
}
