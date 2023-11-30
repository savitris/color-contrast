console.log(`Foreground color: ${process.argv[2]}`);
console.log(`Background color: ${process.argv[3]}`);
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
  .map((token) => ({
    // we've beefed up each 'token' in the themeColors array now:
    value: token.value,
    comment: token.comment,
    originalvalue: token.original.value,
  }))
  .filter(Boolean);

// let's see what the first item in the themeColors array looks like now:
console.log(themeColors[0]);

// console.log("value of first token is " + themeColors[105].value);
// console.log("comment is " + themeColors[105].comment);
// console.log("original value is " + themeColors[105].originalvalue);

//for testing purposes
// console.log(themeColors);

//this allows you to see all of the items of the array instead of just the first 100
// console.dir(themeColors, { maxArrayLength: null });

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

function findAccessibleTextColor(background, textColorsPalette) {
  const MIN_CONTRAST_RATIO = 4.5; // WCAG AA standard

  for (const i of textColorsPalette) {
    const contrastRatio = getContrastRatio(i.value, background);

    if (contrastRatio >= MIN_CONTRAST_RATIO) {
      return i;
    }
  }

  // If no suitable text color is found
  return null;
}

// themeColors temporarily gets flattened to just an array of strings that contain each token's (color) value.
const backgroundColor = background; // Replace with your background color
const textColorsPalette = [
  {
    value: foreground,
  },
  // foreground,
  ...themeColors,
  // ...themeColors.map((token) => token.value),
  // ...themeColors.map((token) => token.comment),
];

// console.log("the textColorsPalette is" + textColorsPalette);
const accessibleTextColor = findAccessibleTextColor(
  backgroundColor,
  textColorsPalette
);

if (accessibleTextColor) {
  if (accessibleTextColor.value == foreground) {
    console.log(
      `The text color given, ${accessibleTextColor.value}, meets the minimum contrast criteria determined by WCAG AA: `
    );
  } else {
    console.log(
      `The text color given does not meet the minimum color contrast WCAG AAstandard. The first color from the design tokens pallette that meets this standard is: ${accessibleTextColor.value}. Its comment is ${accessibleTextColor.comment}`
      // GET THE COMMENT SHOWING HERE FROM themeColors!!!
    );
  }
} else {
  console.log(
    "The given foreground text color and background color combination is not accessible. No alternative accessible text color found in the design tokens that would meet the WCAG AA color contrast standard with the given background color ."
  );
}
