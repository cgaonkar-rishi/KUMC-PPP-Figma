# KU Branding Implementation Guide

## Overview
This document outlines the University of Kansas (KU) branding standards applied to the Participant Payment Portal.

## Color Palette

### Primary Colors
- **KU Blue**: `#0051BA` - Primary brand color
  - Used for: Primary buttons, navigation, headers, links
  - CSS Variable: `--ku-blue`
  
- **KU Blue Dark**: `#003A70` - Darker shade for hover states
  - Used for: Hover states, darker accents
  - CSS Variable: `--ku-blue-dark`

### Secondary Colors
- **KU Crimson**: `#E8000D` - Accent color for critical actions
  - Used for: Destructive buttons, alerts, error states
  - CSS Variable: `--ku-crimson`

### Neutral Colors
- **KU Cool Gray**: `#B4B8BB`
  - Used for: Muted text, borders
  - CSS Variable: `--ku-cool-gray`
  
- **KU Warm Gray**: `#85898C`
  - Used for: Secondary text, disabled states
  - CSS Variable: `--ku-warm-gray`
  
- **KU Charcoal**: `#333333`
  - Used for: Body text, headings
  - CSS Variable: `--ku-charcoal`

## Typography

### Font Family
- System font stack for optimal performance and readability
- Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif`

### Font Weights
- **Normal**: 400 (body text, inputs)
- **Medium**: 500 (headings, buttons, labels)
- **Bold**: Not used in current implementation

### Type Scale
- **H1**: Uses `--text-2xl` with medium weight
- **H2**: Uses `--text-xl` with medium weight
- **H3**: Uses `--text-lg` with medium weight
- **H4**: Uses `--text-base` with medium weight
- **Body**: Uses `--text-base` with normal weight

## Logo Usage

### KUMC Logo
- **Source**: Official KUMC horizontal logo (2-color version)
- **URL**: `https://www.kumc.edu/images/communications/logos/KUMC_scr_UnitHorz_2color.png`
- **Background**: White background for optimal visibility
- **Location**: Top-left header area
- **Sizing**: Height of 40px (10 in Tailwind units) when sidebar expanded

### Logo Guidelines
- Always use on white background
- Maintain proper spacing around logo
- Never distort or modify logo
- Use official KUMC logo files only

## Button Styles

### Primary Button
- **Background**: KU Blue (`#0051BA`)
- **Text**: White
- **Hover**: KU Blue at 90% opacity with elevated shadow
- **Border Radius**: 6px (matches `--radius` variable)
- **Shadow**: Subtle shadow on default, elevated shadow on hover

### Secondary Button
- **Background**: Light gray (`#f5f5f5`)
- **Text**: KU Charcoal
- **Hover**: Slightly darker gray (80% opacity)
- **Border Radius**: 6px

### Destructive Button
- **Background**: KU Crimson (`#E8000D`)
- **Text**: White
- **Hover**: KU Crimson at 90% opacity
- **Border Radius**: 6px

### Outline Button
- **Background**: White/Transparent
- **Border**: Gray (`#d1d5db`)
- **Text**: KU Charcoal
- **Hover**: Light gray background with darker border
- **Border Radius**: 6px

### Ghost Button
- **Background**: Transparent
- **Text**: Inherits
- **Hover**: Light gray background
- **Border Radius**: 6px

## Component Styling

### Sidebar
- **Background**: Solid KU Blue (`#0051BA`) - no gradients
- **Text**: White
- **Active State**: White background with KU Blue text
- **Hover State**: KU Blue Dark with 70% opacity
- **Border Radius**: 8px for navigation items (rounded-lg)

### Header
- **Background**: White
- **Border**: Light gray bottom border
- **Icons**: Gray with KU Blue on hover
- **Page Title**: KU Blue color
- **Badge Icons**: Solid KU Blue background (no gradients)

### Cards
- **Background**: White
- **Border**: Light gray (`rgba(0, 0, 0, 0.1)`)
- **Border Radius**: 6px
- **Shadow**: Subtle shadow for elevation

### Forms
- **Input Background**: Light gray (`#f3f3f5`)
- **Input Border**: Transparent default, KU Blue on focus
- **Label**: Medium weight, KU Charcoal
- **Focus Ring**: KU Blue with 50% opacity

## Spacing & Layout

### Border Radius
- **Standard**: 6px (`--radius`)
- **Small**: 2px (`--radius-sm`)
- **Medium**: 4px (`--radius-md`)
- **Large**: 6px (`--radius-lg`)
- **Extra Large**: 10px (`--radius-xl`)

### Container Padding
- Standard: 24px (p-6 in Tailwind)
- Compact: 16px (p-4 in Tailwind)

## Design Principles

### 1. Solid Colors Over Gradients
- KU branding emphasizes solid, bold colors
- Avoid heavy gradients except for subtle avatar/icon backgrounds
- Use solid KU Blue for primary brand elements

### 2. Clean, Professional Aesthetic
- Ample white space
- Clear hierarchy
- Consistent spacing

### 3. Accessibility
- High contrast ratios (KU Blue on white: 8.59:1)
- Focus states clearly visible
- Proper ARIA labels

### 4. Consistency
- Use defined color variables consistently
- Maintain uniform border radius across components
- Consistent button styling throughout

## Utility Classes

### Background Colors
```css
.bg-ku-blue          /* KU Blue */
.bg-ku-blue-dark     /* KU Blue Dark */
.bg-ku-blue-light    /* KU Blue Light */
.bg-ku-crimson       /* KU Crimson */
```

### Text Colors
```css
.text-ku-blue        /* KU Blue */
.text-ku-blue-dark   /* KU Blue Dark */
.text-ku-crimson     /* KU Crimson */
```

### Border Colors
```css
.border-ku-blue      /* KU Blue */
.border-ku-crimson   /* KU Crimson */
```

### Hover States
```css
.hover:bg-ku-blue:hover       /* KU Blue on hover */
.hover:bg-ku-blue-dark:hover  /* KU Blue Dark on hover */
.hover:text-ku-blue:hover     /* KU Blue text on hover */
```

## Implementation Checklist

- ✅ KU color palette defined in CSS variables
- ✅ Typography system established
- ✅ KUMC logo properly implemented
- ✅ Button styles aligned with KU branding
- ✅ Sidebar using solid KU Blue (no gradients)
- ✅ Header using solid KU Blue for icons
- ✅ Consistent border radius (6px standard)
- ✅ Utility classes for KU brand colors
- ✅ Focus states using KU Blue
- ✅ Error/destructive states using KU Crimson

## Future Considerations

1. **Font Loading**: Consider loading KU-approved fonts (Gotham, if licensed)
2. **Accessibility Audit**: Ensure all color combinations meet WCAG AA standards
3. **Dark Mode**: If needed, ensure KU colors adapt appropriately
4. **Print Styles**: Consider print-friendly versions of branded elements
5. **Responsive Behavior**: Ensure branding is consistent across all breakpoints

## Resources

- KU Brand Guidelines: https://brand.ku.edu/design
- KUMC Communications: https://www.kumc.edu/communications.html
- Color Contrast Checker: https://webaim.org/resources/contrastchecker/

---

**Last Updated**: January 2026
**Version**: 1.0
