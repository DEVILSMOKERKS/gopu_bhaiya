# Next.js Migration Guide

This project has been migrated from React + Vite to Next.js.

## Key Changes

### 1. Environment Variables
- Changed from `import.meta.env.VITE_API_URL` to `process.env.NEXT_PUBLIC_API_URL`
- Create a `.env.local` file in the `frontend` directory with:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:5000/api
  ```

### 2. Routing
- React Router has been replaced with Next.js App Router
- Routes are now defined in the `app` directory structure
- Use `useRouter()` from `next/navigation` instead of `useNavigate()` from `react-router-dom`
- Use `Link` from `next/link` instead of `Link` from `react-router-dom`
- Use `href` prop instead of `to` prop for Links

### 3. Navigation
- Replace `navigate('/path')` with `router.push('/path')`
- Replace `useLocation()` with `usePathname()` from `next/navigation`

### 4. Components
- Components that use hooks or client-side features need `'use client'` directive at the top
- Server components (default) cannot use hooks, browser APIs, or event handlers

### 5. File Structure
- Pages are now in `app/` directory instead of `src/pages/`
- Each route has its own `page.jsx` file
- Layouts are in `app/layout.jsx` and nested `layout.jsx` files

### 6. Build & Run
- Development: `npm run dev` (runs on port 3000 by default)
- Build: `npm run build`
- Start: `npm start`

### 7. Remaining Tasks
Some components may still need updates:
- Components using `react-router-dom` features need to be updated
- Components using `import.meta.env` need environment variable updates
- Hash links may need special handling (react-router-hash-link compatibility)

### 8. Admin Routes
- Admin routes are now in `app/admin/` directory
- Admin layout is handled in `app/admin/layout.jsx`

## Next Steps

1. Install dependencies: `npm install`
2. Create `.env.local` file with your API URL
3. Test the application: `npm run dev`
4. Update any remaining components that use React Router features
5. Test all routes and functionality



