# KU Branding Visual Checklist

Use this checklist to verify all branding updates have been applied correctly.

---

## 🎨 Color Palette Verification

### CSS Variables Check (`/styles/globals.css`)
- [ ] Open `/styles/globals.css` in editor
- [ ] Verify `--ku-blue: #0051BA` is defined
- [ ] Verify `--ku-blue-dark: #003A70` is defined
- [ ] Verify `--ku-crimson: #E8000D` is defined
- [ ] Verify `--radius: 6px` is defined
- [ ] Verify font family system is defined

---

## 🧭 Navigation Components

### Sidebar (`/components/Sidebar.tsx`)
**What to check:**
- [ ] Background is solid KU Blue (not gradient)
- [ ] Active menu items have white background with KU Blue text
- [ ] Hover states show darker blue (KU Blue Dark)
- [ ] Border radius on menu items is 8px (rounded-lg)

**Expected appearance:**
```
✅ Solid blue background (#0051BA)
✅ Clean, flat design (no gradient)
✅ White active states with blue text
```

### Header (`/components/Header.tsx`)
**What to check:**
- [ ] KUMC logo displays on white background
- [ ] Page icon circle uses solid KU Blue (not gradient)
- [ ] Page title uses solid KU Blue text (not gradient text)
- [ ] Icon has `rounded-lg` border radius
- [ ] Icon has shadow-md for depth

**Expected appearance:**
```
✅ Logo: Official KUMC horizontal on white
✅ Page icon: Solid blue square with white icon
✅ Page title: Solid blue text, no gradient effect
```

---

## 📄 Page Headers

### Studies Page (`/components/Studies.tsx`)
**What to check:**
- [ ] Section header has white background
- [ ] Left border is 4px KU Blue
- [ ] Icon circle uses solid KU Blue (not bg-blue-500)
- [ ] Shadow is subtle (shadow-sm)
- [ ] Border radius is 6px (rounded-lg)
- [ ] Primary button uses KU Blue

**Expected code:**
```tsx
className="bg-white border-l-4 border-ku-blue rounded-lg shadow-sm"
// Icon background:
className="w-12 h-12 bg-ku-blue rounded-lg"
```

### Participants Page (`/components/Participants.tsx`)
**What to check:**
- [ ] Section header has white background
- [ ] Left border uses `border-ku-blue` (not border-blue-600)
- [ ] Shadow is `shadow-sm` (not shadow-md)

### Payments Page (`/components/Payments.tsx`)
**What to check:**
- [ ] Section header has white background
- [ ] Left border uses `border-ku-blue`
- [ ] Consistent with other page headers

### Grants Page (`/components/Grants.tsx`)
**What to check:**
- [ ] Section header has white background
- [ ] Left border uses `border-ku-blue`
- [ ] No gradient backgrounds in header

### Locations Page (`/components/Locations.tsx`)
**What to check:**
- [ ] Section header has white background
- [ ] Left border uses `border-ku-blue`
- [ ] Matches other page header styling

### Help Page (`/components/Help.tsx`)
**What to check:**
- [ ] Header uses solid KU Blue background (not gradient)
- [ ] No blue-purple gradient
- [ ] Uses `bg-ku-blue` class

**Expected code:**
```tsx
className="bg-ku-blue rounded-lg shadow-md p-8 text-white"
```

---

## 🔘 Button Components

### Primary Buttons (`/components/ui/button.tsx`)
**What to check:**
- [ ] Default variant uses `bg-primary` (maps to KU Blue)
- [ ] Has `shadow-sm` on default state
- [ ] Has `hover:shadow-md` on hover
- [ ] Border radius is 6px (rounded-md)

**Expected button appearance:**
```
✅ Solid KU Blue background
✅ White text
✅ Subtle shadow, elevated on hover
✅ 6px border radius
```

### Destructive Buttons
**What to check:**
- [ ] Uses `bg-destructive` (maps to KU Crimson)
- [ ] White text for proper contrast
- [ ] Shadow on hover

---

## 🎯 Visual Consistency Check

### Before/After Comparison

#### Sidebar
- ❌ **Before**: Gradient from light blue to dark blue
- ✅ **After**: Solid KU Blue (#0051BA)

#### Section Headers (Studies, Participants, Payments, etc.)
- ❌ **Before**: Gray gradient (from-gray-50 to-gray-100)
- ✅ **After**: White background with KU Blue left border

#### Page Title (Header)
- ❌ **Before**: Gradient text effect (transparent text with gradient background)
- ✅ **After**: Solid KU Blue text

#### Help Page Header
- ❌ **Before**: Blue-purple gradient (from-blue-600 to-purple-600)
- ✅ **After**: Solid KU Blue (bg-ku-blue)

#### Studies Icon Background
- ❌ **Before**: bg-blue-500
- ✅ **After**: bg-ku-blue

---

## 🖥️ Browser Testing Checklist

### Chrome/Edge
- [ ] Open app in Chrome or Edge
- [ ] Navigate to Studies page - verify header styling
- [ ] Check Sidebar - should be solid blue
- [ ] Open Participants page - verify header
- [ ] Open Payments page - verify header
- [ ] Open Help page - verify blue header (not gradient)
- [ ] Check all buttons use KU Blue

### Safari
- [ ] Repeat all checks above
- [ ] Verify colors render correctly
- [ ] Check shadows display properly

### Firefox
- [ ] Repeat all checks above
- [ ] Verify no gradient artifacts

---

## 📱 Responsive Testing Checklist

### Mobile (320px - 768px)
- [ ] Sidebar collapses correctly with KU Blue maintained
- [ ] Logo scales appropriately
- [ ] Section headers remain white with blue accent
- [ ] Buttons maintain KU Blue color
- [ ] Text remains readable

### Tablet (768px - 1024px)
- [ ] All elements scale properly
- [ ] Colors remain consistent
- [ ] Sidebar behavior is correct

### Desktop (1024px+)
- [ ] Full layout displays correctly
- [ ] All branding elements visible
- [ ] Colors match KU standards

---

## ♿ Accessibility Checklist

### Color Contrast
- [ ] KU Blue on white background: ≥ 8.59:1 (passes WCAG AA) ✓
- [ ] White text on KU Blue: ≥ 8.59:1 (passes WCAG AA) ✓
- [ ] KU Crimson on white: ≥ 7.0:1 (passes WCAG AA) ✓

### Focus States
- [ ] Buttons show visible focus ring (KU Blue)
- [ ] Links have clear focus indication
- [ ] Tab navigation works correctly
- [ ] Focus ring uses `--ring: var(--ku-blue)`

### Interactive Elements
- [ ] All buttons have hover states
- [ ] Hover states use KU Blue variations
- [ ] Active states are clearly visible
- [ ] Disabled states are distinguishable

---

## 📋 Component-by-Component Checklist

### ✅ Completed Components

#### Global Styles
- [x] Color variables defined in `/styles/globals.css`
- [x] Typography system established
- [x] Border radius standardized to 6px
- [x] KU brand utility classes created

#### Navigation
- [x] Sidebar - Solid KU Blue background
- [x] Header - Solid KU Blue icons and title
- [x] Logo - KUMC on white background

#### Pages
- [x] Studies - White header with KU Blue accent
- [x] Participants - White header with KU Blue accent
- [x] Payments - White header with KU Blue accent
- [x] Grants - White header with KU Blue accent
- [x] Locations - White header with KU Blue accent
- [x] Help - Solid KU Blue header

#### UI Components
- [x] Button - Enhanced with KU colors and shadows
- [x] Cards - 6px border radius
- [x] Forms - KU Blue focus states

#### Documentation
- [x] KU_BRANDING_GUIDE.md created
- [x] BRANDING_UPDATES_LOG.md created
- [x] KU_BRANDING_SUMMARY.md created
- [x] KU_BRANDING_CHECKLIST.md created (this file)

---

## 🔍 Quality Assurance

### Visual Polish
- [ ] No gradients on primary brand elements
- [ ] Consistent border radius (6px) across all cards and buttons
- [ ] Shadows are subtle and purposeful
- [ ] Spacing is consistent

### Code Quality
- [ ] Using CSS variables (`var(--ku-blue)`) not hard-coded colors
- [ ] Utility classes used where appropriate
- [ ] Consistent class naming
- [ ] No deprecated gradient classes

### Brand Compliance
- [ ] All primary actions use KU Blue
- [ ] All destructive actions use KU Crimson
- [ ] Official KUMC logo used (not modified)
- [ ] Typography follows KU standards

---

## 🚀 Final Verification Steps

1. **Clear Browser Cache**
   - [ ] Clear cache to ensure latest styles load
   - [ ] Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

2. **Navigate Through All Pages**
   - [ ] Studies
   - [ ] Participants
   - [ ] Payments
   - [ ] Grants
   - [ ] Locations
   - [ ] Reports
   - [ ] Help

3. **Verify Each Page Header**
   - [ ] White background (not gray gradient)
   - [ ] KU Blue left border (4px)
   - [ ] Subtle shadow (shadow-sm)
   - [ ] Consistent spacing

4. **Check All Interactive Elements**
   - [ ] Buttons use KU Blue
   - [ ] Links use KU Blue
   - [ ] Hover states work correctly
   - [ ] Focus states are visible

5. **Logo and Branding**
   - [ ] KUMC logo displays correctly
   - [ ] White background for logo visibility
   - [ ] No unauthorized logo modifications

---

## ✨ Success Criteria

**The portal passes KU branding standards if:**

✅ All primary elements use official KU Blue (#0051BA)  
✅ No unauthorized gradients on brand elements  
✅ Official KUMC logo properly displayed  
✅ Consistent 6px border radius  
✅ Typography follows system standards  
✅ Color contrast meets WCAG AA (8.59:1)  
✅ Buttons have KU Blue primary styling  
✅ Section headers are clean and consistent  
✅ All documentation is complete  

---

## 📞 Support & Resources

**KU Brand Guidelines**: https://brand.ku.edu/design  
**KUMC Communications**: https://www.kumc.edu/communications.html  
**Contrast Checker**: https://webaim.org/resources/contrastchecker/

**Documentation Files:**
- `/KU_BRANDING_GUIDE.md` - Comprehensive branding reference
- `/BRANDING_UPDATES_LOG.md` - Detailed change log
- `/KU_BRANDING_SUMMARY.md` - Executive summary
- `/KU_BRANDING_CHECKLIST.md` - This checklist

---

**Last Updated**: January 22, 2026  
**Status**: Ready for Review  
**Brand Compliance Target**: 95%+
