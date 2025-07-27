# Coming Soon Page Setup Guide

## 🎯 Overview

A beautiful, animated coming soon page has been integrated into your Fizzi project. It can be easily toggled on/off and completely removed when no longer needed.

## 📁 Files Created/Modified

### New Files:
- `src/components/ComingSoon.tsx` - The main coming soon page component
- `scripts/toggle-coming-soon.js` - Utility script to toggle the page on/off
- `.env.local` - Environment configuration (git-ignored)
- `COMING_SOON_SETUP.md` - This setup guide

### Modified Files:
- `src/app/layout.tsx` - Added conditional rendering logic
- `tailwind.config.js` - Added fade-in animation
- `package.json` - Added toggle script command
- `README.md` - Added coming soon documentation

## 🚀 Quick Start

### Enable Coming Soon Page
```bash
npm run toggle-coming-soon
```

### Disable Coming Soon Page
```bash
npm run toggle-coming-soon
```

### Manual Configuration
Set in `.env.local`:
```env
# Enable coming soon page
NEXT_PUBLIC_COMING_SOON=true

# Disable coming soon page
NEXT_PUBLIC_COMING_SOON=false
```

## 🎨 Features

✅ **Beautiful Design** - Matches Fizzi brand colors and typography
✅ **Smooth Animations** - Fade-in effects, bouncing elements, spinning backgrounds
✅ **Responsive** - Works perfectly on all device sizes
✅ **Brand Integration** - Uses existing BrewyLogo component
✅ **Interactive Elements** - Hover effects on buttons and social links
✅ **Easy Toggle** - One command to enable/disable
✅ **Clean Removal** - Can be completely removed without affecting main site

## 🛠️ Technical Implementation

### Environment Variable Control
The coming soon page uses `NEXT_PUBLIC_COMING_SOON` environment variable to control display:

```typescript
const isComingSoonMode = process.env.NEXT_PUBLIC_COMING_SOON === "true";
```

### Conditional Rendering
In `layout.tsx`, the app conditionally renders either the coming soon page or the main site:

```typescript
{isComingSoonMode ? (
  <ComingSoon />
) : (
  <>
    <Header />
    <main>{children}<ViewCanvas /></main>
    <Footer />
  </>
)}
```

### Custom Animations
Added `fade-in-up` animation to Tailwind config:

```javascript
"fade-in-up": {
  "0%": { opacity: "0", transform: "translateY(30px)" },
  "100%": { opacity: "1", transform: "translateY(0)" }
}
```

## 🗑️ Complete Removal Guide

When you no longer need the coming soon page, follow these steps:

1. **Delete the component file:**
   ```bash
   rm src/components/ComingSoon.tsx
   ```

2. **Remove from layout.tsx:**
   - Remove the ComingSoon import
   - Remove the conditional rendering logic
   - Restore original layout structure

3. **Clean up package.json:**
   - Remove the `"toggle-coming-soon"` script

4. **Delete utility files:**
   ```bash
   rm scripts/toggle-coming-soon.js
   rm .env.local
   rm COMING_SOON_SETUP.md
   ```

5. **Remove from Tailwind config (optional):**
   - Remove the `fade-in-up` animation if not used elsewhere

## 🎯 Customization

### Update Content
Edit `src/components/ComingSoon.tsx` to modify:
- Heading text
- Subtitle text
- Button text
- Social media links
- Colors and styling

### Change Colors
The component uses these main colors:
- Background: `bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-200`
- Text: `text-sky-900`, `text-sky-800`
- Accent: `text-orange-600`, `bg-orange-600`

### Animation Timing
Modify `style={{ animationDelay: 'Xs' }}` to adjust animation sequences.

## 🔧 Troubleshooting

### Coming Soon Page Not Showing
1. Check `.env.local` has `NEXT_PUBLIC_COMING_SOON=true`
2. Restart development server: `npm run dev`
3. Clear browser cache

### Toggle Script Not Working
1. Ensure Node.js permissions: `chmod +x scripts/toggle-coming-soon.js`
2. Check if `.env.local` file is writable

### Animations Not Working
1. Verify Tailwind config includes the fade-in-up animation
2. Check if animations are disabled in browser settings

## 📞 Support

This coming soon page was designed with top-tier coding practices:
- Clean, modular code structure
- TypeScript support
- Responsive design principles
- Performance optimized
- Easy maintenance and removal

The implementation ensures zero impact on your existing codebase and can be removed completely without any side effects.