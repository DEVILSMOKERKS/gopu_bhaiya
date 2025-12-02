# How to Start the Project

## Quick Start

Run these commands in separate terminal windows:

### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
```

## Access URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Using PowerShell (Windows)

You can also start both servers at once using:

```powershell
# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

# Start Frontend  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

## Prerequisites

1. **Node.js** installed (v16+)
2. **MySQL** database running
3. **Environment variables** configured:
   - `server/.env` - Database and API credentials
   - `frontend/.env` - API endpoint URL

## Troubleshooting

- **Port already in use**: Change PORT in `.env` files
- **Database errors**: Ensure MySQL is running and credentials are correct
- **Module errors**: Run `npm install` in both `server` and `frontend` folders



