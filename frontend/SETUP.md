# Quick Setup Instructions

## 1. Create Environment File

Create a file named `.env.local` in the `frontend` directory with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Important:** Replace `http://localhost:5000/api` with your actual backend API URL if it's different.

## 2. Install Dependencies (if not already done)

```bash
cd frontend
npm install
```

## 3. Run Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## 4. Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

If you encounter errors:

1. **Port 3000 already in use**: Next.js will automatically try the next available port (3001, 3002, etc.)

2. **Module not found errors**: Make sure all dependencies are installed with `npm install`

3. **API connection errors**: Verify your backend server is running and the API URL in `.env.local` is correct

4. **Build errors**: Check that all components have proper `'use client'` directives where needed




