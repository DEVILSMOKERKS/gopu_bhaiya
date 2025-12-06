# Replacing img tags with Next.js Image Component

## Quick Reference

**Before:**
```jsx
import logo from '../../assets/img/logo.png';
<img src={logo} alt="Logo" className="logo" />
```

**After:**
```jsx
import Image from 'next/image';
import logo from '../../assets/img/logo.png';
<Image src={logo} alt="Logo" className="logo" width={200} height={50} />
```

## Key Changes Needed

1. **Add import:**
   ```jsx
   import Image from 'next/image';
   ```

2. **Replace img with Image:**
   ```jsx
   <img src={...} /> → <Image src={...} width={...} height={...} />
   ```

3. **Add width and height props** (required by Next.js Image)

## Components Fixed So Far:
✅ Header.jsx
✅ HeroSection.jsx  
✅ HandcraftedIdols.jsx
✅ Footer.jsx

## Remaining Components to Fix:
- About.jsx
- TimelineStory.jsx
- OurBlogs.jsx
- ClientDiaries.jsx
- DirectFromMakersHands.jsx
- ManufacturingProcess.jsx
- MateshwariCollection.jsx
- PoojaRoomBudget.jsx
- OurVision.jsx
- PricingPanel.jsx
- WelcomeToTilak.jsx
- DreamTempleSteps.jsx
- Contactus.jsx
- Wishlist.jsx
- FollowUs.jsx
- And more...

## Notes:
- Use `priority` prop for above-the-fold images (like logos)
- Use `fill` prop with `object-fit` for responsive images that fill containers
- Use `sizes` prop for responsive images
- Width/height can be approximate - Next.js will maintain aspect ratio



