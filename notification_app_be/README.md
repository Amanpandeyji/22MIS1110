# Backend Setup Guide

## Prerequisites
- Node.js 18+ 
- npm 9+

## Installation

```bash
npm install
```

## Configuration

1. Create `.env.local` file:
```bash
cp .env.example .env.local
```

2. Update environment variables in `.env.local`:
   - `PORT`: Server port (default: 3000)
   - `DB_HOST`, `DB_PORT`, `DB_NAME`: Database configuration
   - `EMAIL_USER`, `EMAIL_PASSWORD`: Email service credentials
   - `NODE_ENV`: Environment (development/production)

## Development

Start the development server:

```bash
npm run dev
```

Server will run on `http://localhost:3000`

## Project Structure

- `src/index.ts` - Express.js app entry point
- `src/routes.ts` - API endpoint definitions
- `src/database.ts` - In-memory database with indexing
- `src/priority-algorithm.ts` - Notification priority calculation
- `src/notification-service.ts` - Business logic service layer
- `src/email-service.ts` - Email sending with retry logic

## API Endpoints

- `GET /` - API documentation
- `GET /api/health` - Health check
- `GET /api/notifications` - List notifications (paginated)
- `GET /api/notifications/priority` - Get top priority notifications
- `GET /api/notifications/stats` - Get notification statistics
- `POST /api/notifications` - Create notification
- `POST /api/notifications/batch` - Batch send notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
