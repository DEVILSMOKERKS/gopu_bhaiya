# Mateshwari Moorti Bhandar - Next.js Frontend

This is the Next.js frontend application for Mateshwari Moorti Bhandar.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.jsx          # Root layout
│   ├── page.jsx            # Home page
│   ├── about-us/           # About page
│   ├── admin/              # Admin routes
│   └── ...                 # Other routes
├── src/
│   ├── components/         # React components
│   ├── context/            # Context providers
│   ├── pages/              # Page components
│   ├── store/              # Redux store
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── next.config.js          # Next.js configuration
```

## Key Features

- Next.js 14 with App Router
- React 19
- Redux Toolkit for state management
- Context API for user/admin management
- Server-side rendering support
- Optimized image handling
- SEO-friendly routing

## Migration Notes

This project was migrated from React + Vite to Next.js. See `MIGRATION_GUIDE.md` for details.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (required)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint



