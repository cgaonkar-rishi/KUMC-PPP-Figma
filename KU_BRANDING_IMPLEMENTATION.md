# KU Branding Implementation Guide

## ✅ COMPLETED

### 1. Global CSS Variables (/styles/globals.css)
- ✅ Added KU brand color variables
  - `--ku-blue: #0051BA`
  - `--ku-blue-dark: #003459`
  - `--ku-blue-light: #5DADE2`
  - `--ku-crimson: #E8000D`
  - `--ku-cool-gray: #B4B8BB`
  - `--ku-warm-gray: #85898C`
- ✅ Updated CSS utility classes (.bg-ku-blue, .text-ku-blue, etc.)
- ✅ Mapped system colors to KU brand
  - `--primary:` now uses `var(--ku-blue)`
  - `--destructive:` now uses `var(--ku-crimson)`

### 2. Sidebar (/components/Sidebar.tsx)  
- ✅ Updated gradient from generic blue to KU Blue
  - `from-[#0066CC] to-[#004C99]` → `from-ku-blue to-ku-blue-dark`
- ✅ Updated active menu item color
  - `text-blue-600` → `text-ku-blue`
- ✅ Updated hover states
  - `hover:bg-blue-700/50` → `hover:bg-ku-blue-dark/70`
- ✅ Updated submenu colors
  - `bg-blue-600/50` → `bg-ku-blue-dark/50`
  - `hover:bg-blue-700/30` → `hover:bg-ku-blue-dark/30`

### 3. Header (/components/Header.tsx)
- ✅ Updated page title gradient
  - `from-blue-600 to-blue-800` → `from-ku-blue to-ku-blue-dark`
- ✅ Updated icon gradient
  - `from-blue-500 to-blue-600` → `from-ku-blue to-ku-blue-dark`
- ✅ Updated profile avatar gradient
  - `from-blue-500 to-blue-600` → `from-ku-blue to-ku-blue-dark`
- ✅ Updated notification badge to KU Blue
- ✅ Updated text links to KU Blue
  - "Mark all as read", "View all notifications"

---

## 📋 REMAINING UPDATES NEEDED

### Primary Buttons (HIGH PRIORITY)
**Pattern:** `bg-blue-600 text-white ... hover:bg-blue-700`
**Replace with:** `bg-ku-blue text-white ... hover:bg-ku-blue-dark`

**Files to Update:**
- `/components/Dashboard.tsx` (1 occurrence)
- `/components/Studies.tsx` (5 occurrences)
- `/components/Participants.tsx` (3 occurrences)
- `/components/Payments.tsx` (2 occurrences)
- `/components/PaymentsPanel.tsx` (6 occurrences)
- `/components/EnrollmentPanel.tsx` (1 occurrence)
- `/components/Grants.tsx` (multiple)
- `/components/Locations.tsx` (multiple)

### Section Headers (HIGH PRIORITY)
**Pattern:** `border-l-4 border-blue-600`
**Replace with:** `border-l-4 border-ku-blue`

**Files:**
- `/components/Studies.tsx`
- `/components/Participants.tsx`
- `/components/Payments.tsx`
- `/components/Grants.tsx`
- `/components/Locations.tsx`
- `/components/PaymentsPanel.tsx`

### Secondary Blue Elements (MEDIUM PRIORITY)
**Patterns to update:**
- `bg-blue-500` → `bg-ku-blue`
- `bg-blue-50` (light backgrounds) → Keep or adjust slightly
- `text-blue-600` → `text-ku-blue`
- `border-blue-500` → `border-ku-blue`
- `focus:ring-blue-500` → `focus:ring-ku-blue`

### Red/Destructive Actions (MEDIUM PRIORITY)
**Pattern:** `bg-red-600 ... hover:bg-red-700`
**Replace with:** `bg-ku-crimson ... hover:bg-red-700`

**Already using:** Most red buttons are already using appropriate red shades, but should standardize to KU Crimson for consistency.

### Icon Backgrounds (MEDIUM PRIORITY)
- Section header icons: Update to use KU Blue gradient
- Badge backgrounds: Ensure consistency with KU palette

---

## Quick Reference

### Color Mapping Table
| Old Color | New KU Brand Color | Usage |
|-----------|-------------------|-------|
| `bg-blue-600` | `bg-ku-blue` | Primary buttons, main actions |
| `bg-blue-700` | `bg-ku-blue-dark` | Hover states |
| `text-blue-600` | `text-ku-blue` | Links, active states |
| `border-blue-600` | `border-ku-blue` | Section accents |
| `bg-red-600` | `bg-ku-crimson` | Destructive actions |
| Generic grays | `--ku-cool-gray`, `--ku-warm-gray` | Neutral elements |

---

## Implementation Commands

To apply remaining fixes, run find-and-replace across components:

1. **Primary Buttons:**
   ```
   Find: bg-blue-600 text-white rounded-lg hover:bg-blue-700
   Replace: bg-ku-blue text-white rounded-lg hover:bg-ku-blue-dark
   ```

2. **Section Borders:**
   ```
   Find: border-l-4 border-blue-600
   Replace: border-l-4 border-ku-blue
   ```

3. **Text Links:**
   ```
   Find: text-blue-600
   Replace: text-ku-blue
   ```

4. **Icon Backgrounds:**
   ```
   Find: bg-blue-500
   Replace: bg-ku-blue
   ```
