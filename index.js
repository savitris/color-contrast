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
    // added contrastratio. Should this be 0, null, or undefined?
    value: token.value,
    comment: token.comment,
    originalvalue: token.original.value,
    contrastratio: 0,
  }))
  .filter(Boolean);

// let's see what the first item in the themeColors array looks like now:
// console.log(themeColors[0]);

// console.log("value of first token is " + themeColors[105].value);
// console.log("comment is " + themeColors[105].comment);
// console.log("original value is " + themeColors[105].originalvalue);

//for testing purposes
// console.log(themeColors);

//this allows you to see all of the items of the array instead of just the first 100
// console.dir(themeColors, { maxArrayLength: null });

const foreground = process.argv[2];
const background = process.argv[3];

const colorString = require("color-string");
const Color = require("color");

function getContrastRatio(color1, color2) {
  if (
    colorString.get(color1) !== null
    // typeof Color(color1).luminosity() === "number"
    // typeof Color(color1) === "string"
  ) {
    // console.log("this is the color1 " + color1);
    const luminance1 = Color(color1).luminosity();
    const luminance2 = Color(color2).luminosity();

    const brighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    // console.log(luminance1);
    return (brighter + 0.05) / (darker + 0.05);
  }
}

function findAccessibleTextColor(background, textColorsPalette) {
  const MIN_CONTRAST_RATIO = 4.5; // WCAG AA standard
  const goodContrastArray = [];
  for (const i of textColorsPalette) {
    const contrastRatio = getContrastRatio(i.value, background);

    i.contrastratio = contrastRatio;

    if (contrastRatio >= MIN_CONTRAST_RATIO) {
      goodContrastArray.push(i);
    }

    // if (contrastRatio >= MIN_CONTRAST_RATIO) {
    //   // instead of returning, push i into the contrastedColors array
    //   // save only those that meet the min contrast only
    //   return i;
    //   // ADD SAVING IN MEMORY THAT THIS HAS MIN CONTRAST BUT KEEP ON CHECKING THE OTHER VALUES IN THE ARRAY
    // }
  }
  if (goodContrastArray.length > 0) {
    // console.log(goodContrastArray[0]);

    // USE THE COMPARE FUNCTION TO SORT THE ITEMS IN goodContrastArray BY BIGGEST TO SMALLEST contrastratio VALUE
    // 1- HOW CAN I REACH THE INDIVIDUAL contrastratio VALUES FROM THE goodContrastArray ARRAY?
    goodContrastArray.sort((a, b) => b.contrastratio - a.contrastratio);
    // a lot of results are the same color, should we only get one "copy" of each color offered or be strict and offer literraly the best 3 matches even if they're the same color, all cause they have a different comment?

    // original
    // return goodContrastArray.slice(0, 3);

    // #1 REMOVING DUPLICATE OBJECTS USING THE PROPERTY NAME
    function uniqByKeepLast(data, key) {
      return [...new Map(data.map((x) => [key(x), x])).values()].slice(0, 3);
    }
    return uniqByKeepLast(goodContrastArray, (it) => it.contrastratio);
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
  // console.log(accessibleTextColor);
  if (accessibleTextColor[0].value == foreground) {
    console.log(
      `The text color given, ${accessibleTextColor[0].value}, meets the minimum contrast criteria determined by WCAG AA: 4.5:1`
    );
  } else {
    console.log(
      `The text color given does not meet the minimum color contrast WCAG AAstandard. The first color from the design tokens pallette that meets this standard is: ${accessibleTextColor[0].value}. Its comment is ${accessibleTextColor[0].comment}`
    );

    // To do: sort the array "AccessibleTextColor" by each items contrastratio value, so you can sort them from best. Or get the top 3
    // google "sort array of objects javascript" <-- !!!
    // possibly remove duplicates from the array too.
    console.log("These are accessible: ");
    for (const i of accessibleTextColor) {
      console.table(i);
      // console.log(i.value);
    }
  }
} else {
  console.log(
    "The given foreground text color and background color combination is not accessible. No alternative accessible text color found in the design tokens that would meet the WCAG AA color contrast standard with the given background color ."
  );
}
