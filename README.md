# color-contrast

node script to check color contrast in themes and offer AA meeting shades

Make sure to install the 'color' package using `npm install color` before running the script.

This script defines two functions: `getContrastRatio` to calculate the contrast ratio between two colors (a foreground color and a background color), and `findAccessibleTextColor` to find a suitable text color that meets the WCAG contrast ratio requirements against a given background color.

The script first checks the contrast of the pair of colors given. If the contrast between them does not meet the WCAG AA standard, then it keeps on checking text color values from an array (`textColors`) of colors (currently) hardcoded by us.

The values from said array should in the future be coming from the design tokens from the appropriate NLDS Theme.

How to use:

```
# Syntax
node index.js "foreground color" "background color"

# Example
node index.js "#6B6B6B" "#FFFFFF"
```

Result:

```

foreground #6B6B6B
background #FFFFFF
Accessible text color: #6B6B6B
```
