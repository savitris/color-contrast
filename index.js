console.log(`foreground ${process.argv[2]}`);
console.log(`background ${process.argv[3]}`);

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
const textColors = [foreground, "#333", "#aabbcc", "#fff"]; // Replace with your text color options

const accessibleTextColor = findAccessibleTextColor(
  backgroundColor,
  textColors
);

if (accessibleTextColor) {
  console.log(`Accessible text color: ${accessibleTextColor}`);
} else {
  console.log("No accessible text color found.");
}
