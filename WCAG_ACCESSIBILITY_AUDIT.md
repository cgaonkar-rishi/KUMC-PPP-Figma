# WCAG 2.0 Accessibility Audit Report
## Participant Payment Portal

**Audit Date:** January 27, 2026  
**Auditor:** AI Accessibility Review  
**Standard:** WCAG 2.0 Level AA

---

## Executive Summary

This audit identifies accessibility issues across the Participant Payment Portal application. The application has several **critical accessibility violations** that must be addressed to achieve WCAG 2.0 Level AA compliance.

**Overall Status:** ❌ **NOT COMPLIANT**

---

## Critical Issues (Priority 1)

### 1. ❌ Missing ARIA Labels on Interactive Elements
**WCAG Guideline:** 4.1.2 Name, Role, Value (Level A)  
**Severity:** Critical

**Issues Found:**
- Header buttons (notifications, settings, profile) lack `aria-label` attributes
- Icon-only buttons throughout the application missing descriptive labels
- Dropdown toggles without proper ARIA attributes
- Modal close buttons without accessible names

**Example Violations:**
```tsx
// ❌ INCORRECT - Header.tsx line 156-160
<button 
  onClick={() => setShowNotifications(!showNotifications)}
  className="relative p-2 hover:bg-blue-50..."
  title="Notifications"
>
  <Bell size={20} />
</button>

// ✅ CORRECT
<button 
  onClick={() => setShowNotifications(!showNotifications)}
  className="relative p-2 hover:bg-blue-50..."
  aria-label="Notifications"
  aria-expanded={showNotifications}
  aria-haspopup="true"
>
  <Bell size={20} aria-hidden="true" />
</button>
```

**Impact:** Screen reader users cannot identify button purposes

---

### 2. ❌ Insufficient Color Contrast
**WCAG Guideline:** 1.4.3 Contrast (Minimum) (Level AA)  
**Severity:** Critical

**Issues Found:**
- Gray text on light backgrounds (text-gray-500, text-gray-400) fail 4.5:1 ratio
- Badge/status pills with insufficient contrast
- Placeholder text in inputs may not meet contrast requirements
- Icon colors (text-gray-600) on white backgrounds borderline

**Example Violations:**
```css
/* ❌ FAIL - Contrast ratio ~3.1:1 (needs 4.5:1) */
text-gray-500 on white background (#6B7280 on #FFFFFF)

/* ❌ FAIL - Contrast ratio ~2.9:1 */
text-gray-400 on white background (#9CA3AF on #FFFFFF)

/* ✅ PASS - Contrast ratio 7.5:1 */
text-gray-700 on white background (#374151 on #FFFFFF)
```

**Recommended Changes:**
- Replace `text-gray-500` with `text-gray-700` for body text
- Replace `text-gray-400` with `text-gray-600` for secondary text
- Replace `text-gray-600` with `text-gray-700` for icon labels

---

### 3. ❌ Missing Form Labels and Associations
**WCAG Guideline:** 3.3.2 Labels or Instructions (Level A)  
**Severity:** Critical

**Issues Found:**
- Search inputs lack proper `<label>` elements (icon only)
- Filter dropdowns missing explicit labels
- Some form fields use visual labels without `htmlFor` association

**Example Violations:**
```tsx
// ❌ INCORRECT - Studies.tsx
<div className="relative flex-1">
  <Search className="absolute left-3..." />
  <input
    type="text"
    placeholder="Search studies..."
    className="w-full pl-10..."
  />
</div>

// ✅ CORRECT
<div className="relative flex-1">
  <label htmlFor="study-search" className="sr-only">
    Search studies by name, IRB number, or protocol
  </label>
  <Search className="absolute left-3..." aria-hidden="true" />
  <input
    id="study-search"
    type="text"
    placeholder="Search studies..."
    aria-describedby="study-search-description"
    className="w-full pl-10..."
  />
</div>
```

---

### 4. ❌ Inadequate Keyboard Navigation
**WCAG Guideline:** 2.1.1 Keyboard (Level A)  
**Severity:** Critical

**Issues Found:**
- Dropdown panels close immediately on blur, preventing keyboard navigation
- No focus trap in modals
- Tab order not logical in complex panels
- No skip navigation links
- Clickable table rows without keyboard support

**Example Violations:**
```tsx
// ❌ INCORRECT - Notifications dropdown
onBlur={() => setTimeout(() => setShowNotifications(false), 200)}

// ✅ CORRECT - Should use proper focus management
```

**Required Fixes:**
- Implement focus trapping in modals
- Add proper `onKeyDown` handlers for Enter/Space on clickable elements
- Use `role="dialog"` with `aria-modal="true"` for modals
- Add skip navigation link at top of page

---

### 5. ❌ Missing Focus Indicators
**WCAG Guideline:** 2.4.7 Focus Visible (Level AA)  
**Severity:** High

**Issues Found:**
- Custom styled elements override default focus styles
- Insufficient focus indicator visibility
- Some interactive elements have `focus:outline-none` without replacement

**Example Violations:**
```tsx
// ❌ INCORRECT
className="focus:outline-none focus:ring-2 focus:ring-blue-500"
// Ring may be too subtle

// ✅ CORRECT - Add visible border
className="focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
```

---

## High Priority Issues (Priority 2)

### 6. ❌ Notification Badge Accessibility
**WCAG Guideline:** 4.1.3 Status Messages (Level AA)

**Issue:** Unread notification count badge lacks `aria-live` announcement

```tsx
// ❌ INCORRECT
<span className="absolute top-1 right-1...">{unreadCount}</span>

// ✅ CORRECT
<span className="sr-only" aria-live="polite" aria-atomic="true">
  {unreadCount} unread notifications
</span>
<span className="absolute top-1 right-1..." aria-hidden="true">
  {unreadCount}
</span>
```

---

### 7. ❌ Table Accessibility
**WCAG Guideline:** 1.3.1 Info and Relationships (Level A)

**Issues:**
- Tables missing `<caption>` elements
- No `scope` attributes on header cells
- Sortable columns lack ARIA sort indicators
- No summary of table purpose

**Example Fix:**
```tsx
<table>
  <caption className="sr-only">List of active research studies</caption>
  <thead>
    <tr>
      <th scope="col" aria-sort="ascending">Study Name</th>
      <th scope="col">IRB Number</th>
    </tr>
  </thead>
</table>
```

---

### 8. ❌ Modal Dialog Accessibility
**WCAG Guideline:** 2.4.3 Focus Order (Level A)

**Issues:**
- Modals don't set initial focus
- No focus return to trigger element on close
- Missing `role="dialog"` and `aria-modal="true"`
- Close button not accessible

**Required Implementation:**
```tsx
<div 
  role="dialog" 
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <div id="modal-description">...</div>
  <button aria-label="Close dialog">
    <X aria-hidden="true" />
  </button>
</div>
```

---

### 9. ❌ Status Badge Color Reliance
**WCAG Guideline:** 1.4.1 Use of Color (Level A)

**Issue:** Status indicators rely solely on color

```tsx
// ❌ INCORRECT
<span className="px-2 py-1 bg-green-100 text-green-800">Active</span>

// ✅ CORRECT - Add icon or text label
<span className="px-2 py-1 bg-green-100 text-green-800">
  <CheckCircle size={14} aria-hidden="true" />
  <span>Active</span>
</span>
```

---

### 10. ❌ Heading Hierarchy
**WCAG Guideline:** 1.3.1 Info and Relationships (Level A)

**Issues:**
- Some sections use `<h3>` without parent `<h2>`
- Visual headings styled with classes instead of semantic elements
- Inconsistent heading levels

---

## Medium Priority Issues (Priority 3)

### 11. ⚠️ Link Purpose Unclear
**WCAG Guideline:** 2.4.4 Link Purpose (In Context) (Level A)

Generic "View all" and "Learn more" links should be more descriptive.

---

### 12. ⚠️ Error Message Accessibility
**WCAG Guideline:** 3.3.1 Error Identification (Level A)

Form validation errors need:
- `aria-invalid="true"` on invalid fields
- `aria-describedby` pointing to error message
- `role="alert"` on error container

---

### 13. ⚠️ Language Declaration
**WCAG Guideline:** 3.1.1 Language of Page (Level A)

**Fix Required in App.tsx or index.html:**
```html
<html lang="en">
```

---

### 14. ⚠️ Resizable Text
**WCAG Guideline:** 1.4.4 Resize text (Level AA)

Test needed: Ensure content is readable at 200% zoom without horizontal scrolling.

---

### 15. ⚠️ Autocomplete Attributes
**WCAG Guideline:** 1.3.5 Identify Input Purpose (Level AA)

Form inputs should use `autocomplete` attributes:
```tsx
<input type="email" autocomplete="email" />
<input type="tel" autocomplete="tel" />
```

---

## Low Priority Issues (Priority 4)

### 16. ℹ️ Loading States
**WCAG Guideline:** 4.1.3 Status Messages (Level AA)

Loading spinners should announce to screen readers:
```tsx
<div role="status" aria-live="polite" aria-busy="true">
  <LoadingSpinner />
  <span className="sr-only">Loading content, please wait...</span>
</div>
```

---

### 17. ℹ️ Tooltip Accessibility
**WCAG Guideline:** 1.4.13 Content on Hover or Focus (Level AA)

Tooltips using `title` attribute need proper implementation with `aria-describedby`.

---

### 18. ℹ️ Time-Based Content
**WCAG Guideline:** 2.2.1 Timing Adjustable (Level A)

Toast notifications auto-dismiss - ensure users can extend/dismiss them.

---

## Positive Findings ✅

1. ✅ **Focus ring styles** - Application includes `focus:ring-2` classes
2. ✅ **Semantic HTML** - Generally uses proper HTML elements
3. ✅ **Responsive design** - Layout adapts to different screen sizes
4. ✅ **Color scheme** - KU Blue (#0051BA) provides good contrast with white text
5. ✅ **Consistent UI patterns** - Similar components styled consistently

---

## Remediation Priority Roadmap

### Phase 1 - Critical (Week 1-2)
1. Add ARIA labels to all interactive elements
2. Fix color contrast issues (update gray text classes)
3. Add proper form labels with `htmlFor` associations
4. Implement keyboard navigation for dropdowns
5. Add focus visible styles

### Phase 2 - High Priority (Week 3-4)
6. Implement modal accessibility (focus trap, ARIA attributes)
7. Add table captions and scope attributes
8. Fix notification badge announcements
9. Update status badges to not rely on color alone
10. Fix heading hierarchy

### Phase 3 - Medium Priority (Week 5-6)
11. Add descriptive link text
12. Implement form error announcements
13. Add language declaration
14. Test text resize at 200%
15. Add autocomplete attributes

### Phase 4 - Low Priority (Ongoing)
16. Enhance loading state announcements
17. Improve tooltip implementation
18. Review toast notification timing

---

## Testing Recommendations

### Automated Testing Tools
1. **axe DevTools** - Browser extension for automated scanning
2. **WAVE** - Web accessibility evaluation tool
3. **Lighthouse** - Chrome DevTools audit
4. **pa11y** - Automated accessibility testing CLI

### Manual Testing
1. **Keyboard-only navigation** - Navigate entire app without mouse
2. **Screen reader testing** - Test with NVDA (Windows) or VoiceOver (Mac)
3. **Color contrast analyzer** - Verify all text meets 4.5:1 ratio
4. **Zoom testing** - Test at 200% browser zoom
5. **Focus indicator visibility** - Tab through and verify visible focus

### Assistive Technology Testing
- **NVDA** (Windows) - Free screen reader
- **JAWS** (Windows) - Popular commercial screen reader
- **VoiceOver** (Mac/iOS) - Built-in screen reader
- **TalkBack** (Android) - Built-in screen reader

---

## Code Examples for Common Fixes

### Screen Reader Only Text Utility
```css
/* Add to globals.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Skip Navigation Link
```tsx
// Add to App.tsx
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white"
>
  Skip to main content
</a>
<main id="main-content">
  {/* Page content */}
</main>
```

### Accessible Icon Button Template
```tsx
<button 
  onClick={handleClick}
  aria-label="Descriptive action name"
  className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
>
  <IconComponent size={20} aria-hidden="true" />
</button>
```

---

## Compliance Checklist

### Perceivable
- [ ] Text alternatives for images
- [ ] Captions for multimedia
- [ ] Adaptable content structure
- [ ] Color contrast minimum 4.5:1
- [ ] Text resize up to 200%
- [ ] Images of text avoided

### Operable
- [ ] Keyboard accessible
- [ ] No keyboard traps
- [ ] Sufficient time for reading
- [ ] Skip navigation links
- [ ] Page titles descriptive
- [ ] Focus order logical
- [ ] Link purpose clear
- [ ] Multiple ways to find pages
- [ ] Headings and labels descriptive
- [ ] Focus visible

### Understandable
- [ ] Language of page declared
- [ ] On focus behavior predictable
- [ ] On input behavior predictable
- [ ] Error identification
- [ ] Labels or instructions provided
- [ ] Error suggestions provided
- [ ] Error prevention for critical actions

### Robust
- [ ] Valid HTML/ARIA
- [ ] Name, role, value for components
- [ ] Status messages announced

---

## Resources

### WCAG 2.0 Documentation
- [WCAG 2.0 Quick Reference](https://www.w3.org/WAI/WCAG20/quickref/)
- [Understanding WCAG 2.0](https://www.w3.org/TR/UNDERSTANDING-WCAG20/)
- [WCAG 2.0 Techniques](https://www.w3.org/TR/WCAG20-TECHS/)

### ARIA Documentation
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [ARIA Roles](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)

### Tools
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Oracle](https://colororacle.org/) - Color blindness simulator

---

## Conclusion

The Participant Payment Portal requires significant accessibility improvements to achieve WCAG 2.0 Level AA compliance. The primary issues involve:

1. **Missing ARIA attributes** on interactive elements
2. **Color contrast failures** with gray text
3. **Keyboard navigation gaps** in dropdowns and modals
4. **Form accessibility** issues with missing labels

**Estimated Remediation Effort:** 40-60 hours

Following the phased approach outlined above will systematically address these issues and bring the application into compliance.

---

**Next Steps:**
1. Review this audit with development team
2. Prioritize fixes based on severity
3. Implement Phase 1 critical fixes
4. Conduct follow-up testing with automated tools
5. Perform manual keyboard and screen reader testing
6. Schedule user testing with people who use assistive technology
