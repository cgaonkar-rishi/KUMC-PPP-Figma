# KU Brand Quick Reference Card

**Quick reference for developers working on the Participant Payment Portal**

---

## 🎨 Colors - Use These!

### CSS Variables (Preferred)
```css
var(--ku-blue)          /* #0051BA - Primary brand color */
var(--ku-blue-dark)     /* #003A70 - Hover states */
var(--ku-crimson)       /* #E8000D - Destructive actions */
var(--ku-charcoal)      /* #333333 - Body text */
var(--ku-warm-gray)     /* #85898C - Secondary text */
var(--ku-cool-gray)     /* #B4B8BB - Borders */
```

### Tailwind Classes
```css
bg-ku-blue              /* KU Blue background */
bg-ku-blue-dark         /* KU Blue Dark background */
bg-ku-crimson           /* KU Crimson background */
text-ku-blue            /* KU Blue text */
text-ku-crimson         /* KU Crimson text */
border-ku-blue          /* KU Blue border */
hover:bg-ku-blue-dark   /* Hover state */
```

---

## ✅ Do's

### Primary Buttons
```tsx
// ✅ GOOD - Use KU Blue
<button className="bg-ku-blue text-white px-4 py-2 rounded-lg hover:bg-ku-blue-dark">
  Submit
</button>
```

### Section Headers
```tsx
// ✅ GOOD - White with KU Blue accent
<div className="bg-white border-l-4 border-ku-blue rounded-lg shadow-sm p-5">
  <h2>Section Title</h2>
</div>
```

### Icons
```tsx
// ✅ GOOD - Solid KU Blue
<div className="w-12 h-12 bg-ku-blue rounded-lg flex items-center justify-center">
  <Icon className="text-white" />
</div>
```

### Links
```tsx
// ✅ GOOD - KU Blue with hover
<a className="text-ku-blue hover:text-ku-blue-dark">
  Learn More
</a>
```

---

## ❌ Don'ts

### Avoid Gradients on Brand Elements
```tsx
// ❌ BAD - Don't use gradients
<div className="bg-gradient-to-r from-blue-500 to-blue-700">

// ✅ GOOD - Use solid colors
<div className="bg-ku-blue">
```

### Don't Use Generic Blues
```tsx
// ❌ BAD - Generic blue colors
<button className="bg-blue-600 hover:bg-blue-700">

// ✅ GOOD - KU branded colors
<button className="bg-ku-blue hover:bg-ku-blue-dark">
```

### Don't Hard-Code Colors
```tsx
// ❌ BAD - Hard-coded hex
<div style={{ backgroundColor: '#0051BA' }}>

// ✅ GOOD - CSS variable
<div style={{ backgroundColor: 'var(--ku-blue)' }}>

// ✅ BETTER - Tailwind class
<div className="bg-ku-blue">
```

### Don't Modify the Logo
```tsx
// ❌ BAD - Never modify logo
<img src="logo.png" style={{ filter: 'hue-rotate(45deg)' }} />

// ✅ GOOD - Use official logo as-is
<img src="https://www.kumc.edu/images/communications/logos/KUMC_scr_UnitHorz_2color.png" alt="KUMC Logo" />
```

---

## 📏 Spacing & Sizing

### Border Radius
```css
rounded-md    /* 6px - Standard for buttons/inputs */
rounded-lg    /* 8px - Cards and sections */
```

### Shadows
```css
shadow-sm     /* Subtle - For cards */
shadow-md     /* Medium - For modals, elevated elements */
shadow-lg     /* Large - For dropdowns */
```

### Padding
```css
p-4    /* 16px - Compact spacing */
p-5    /* 20px - Section headers */
p-6    /* 24px - Standard card padding */
p-8    /* 32px - Large sections */
```

---

## 🎯 Common Patterns

### Primary Action Button
```tsx
<button className="bg-ku-blue text-white px-4 py-2 rounded-lg hover:bg-ku-blue-dark shadow-sm hover:shadow-md transition-all">
  Primary Action
</button>
```

### Destructive Action Button
```tsx
<button className="bg-ku-crimson text-white px-4 py-2 rounded-lg hover:bg-ku-crimson/90 shadow-sm transition-all">
  Delete
</button>
```

### Secondary Button
```tsx
<button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 shadow-sm">
  Cancel
</button>
```

### Outline Button
```tsx
<button className="border border-gray-300 bg-white text-foreground px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-gray-400">
  Secondary
</button>
```

### Icon Button
```tsx
<button className="p-2 text-gray-600 hover:bg-blue-50 hover:text-ku-blue rounded-lg transition-all">
  <Icon size={20} />
</button>
```

### Card Component
```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <h3 className="text-lg font-medium text-ku-blue mb-4">Card Title</h3>
  <p className="text-gray-600">Card content...</p>
</div>
```

### Page Section Header
```tsx
<div className="bg-white border-l-4 border-ku-blue rounded-lg shadow-sm p-5 flex items-center justify-between">
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-ku-blue rounded-lg flex items-center justify-center shadow-sm">
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <h2 className="text-2xl text-gray-800 font-semibold">Section Title</h2>
      <p className="text-gray-600 text-sm">Section description</p>
    </div>
  </div>
</div>
```

### Badge/Status Indicator
```tsx
// Active/Success
<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
  Active
</span>

// Error/Inactive
<span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
  Inactive
</span>

// Info
<span className="px-3 py-1 bg-blue-100 text-ku-blue rounded-full text-sm">
  Info
</span>
```

---

## 🔤 Typography

### Headings
```tsx
<h1 className="text-2xl text-ku-blue font-medium">Main Heading</h1>
<h2 className="text-xl text-gray-800 font-medium">Section Heading</h2>
<h3 className="text-lg text-gray-800 font-medium">Subsection</h3>
```

### Body Text
```tsx
<p className="text-base text-gray-700">Regular body text</p>
<p className="text-sm text-gray-600">Secondary text</p>
<p className="text-xs text-gray-500">Helper text</p>
```

### Links
```tsx
<a href="#" className="text-ku-blue hover:text-ku-blue-dark hover:underline">
  Text Link
</a>
```

---

## 🎨 Color Usage Guidelines

### When to Use Each Color

**KU Blue** (`--ku-blue`)
- Primary buttons
- Navigation active states
- Page titles and headings
- Links
- Icons in headers
- Brand elements

**KU Blue Dark** (`--ku-blue-dark`)
- Hover states for KU Blue elements
- Darker accents when needed

**KU Crimson** (`--ku-crimson`)
- Delete/remove buttons
- Error states
- Critical alerts
- Destructive actions

**KU Charcoal** (`--ku-charcoal`)
- Body text
- Default text color
- Headings (when not using KU Blue)

**KU Warm Gray** (`--ku-warm-gray`)
- Secondary text
- Muted content
- Disabled text

**KU Cool Gray** (`--ku-cool-gray`)
- Borders
- Dividers
- Disabled backgrounds

---

## 📦 Component Examples

### Form Input
```tsx
<input 
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-ku-blue focus:ring-2 focus:ring-ku-blue/20 outline-none transition-all"
  placeholder="Enter text..."
/>
```

### Select Dropdown
```tsx
<select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-ku-blue focus:ring-2 focus:ring-ku-blue/20 outline-none">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Checkbox
```tsx
<label className="flex items-center gap-2 cursor-pointer">
  <input 
    type="checkbox"
    className="w-4 h-4 text-ku-blue border-gray-300 rounded focus:ring-ku-blue focus:ring-2"
  />
  <span className="text-gray-700">Checkbox Label</span>
</label>
```

---

## 🚦 Status Colors

While KU Brand colors are primary, these utility colors are acceptable:

```css
/* Success */
bg-green-500, bg-green-600, text-green-700, bg-green-50

/* Warning */
bg-yellow-500, bg-orange-500, text-orange-700, bg-yellow-50

/* Error (prefer KU Crimson) */
bg-red-500, text-red-700, bg-red-50

/* Info (prefer KU Blue) */
bg-blue-100, text-ku-blue
```

---

## ⚡ Quick Tips

1. **Always use CSS variables** for KU brand colors
2. **Avoid gradients** on primary brand elements (sidebar, headers, buttons)
3. **Use 6px border radius** (rounded-lg) for consistency
4. **Add subtle shadows** for depth (shadow-sm on cards)
5. **KU Blue for primary actions**, KU Crimson for destructive
6. **Official KUMC logo only** - never modify
7. **White backgrounds** for logo visibility
8. **Test color contrast** - KU Blue on white = 8.59:1 ✅

---

## 📚 Resources

- **Full Guide**: `/KU_BRANDING_GUIDE.md`
- **Change Log**: `/BRANDING_UPDATES_LOG.md`
- **Summary**: `/KU_BRANDING_SUMMARY.md`
- **Checklist**: `/KU_BRANDING_CHECKLIST.md`

**KU Brand Site**: https://brand.ku.edu/design

---

**Keep this reference handy when building new components!**
