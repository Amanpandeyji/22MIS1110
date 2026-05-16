import express, { Express, Request, Response } from 'express';
import notificationRoutes from './routes';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req: Request, res: Response, next: any) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    api: 'Notification System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      notifications: '/api/notifications',
      priority: '/api/notifications/priority',
      stats: '/api/notifications/stats',
      create: 'POST /api/notifications',
      batch: 'POST /api/notifications/batch',
      markAsRead: 'PUT /api/notifications/:id/read'
    }
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend API is running' });
});

app.use('/api', notificationRoutes);

app.get('/api/notifications', (req: Request, res: Response) => {
  const mockNotifications = [
    {
      id: '1146893a-9880-4a14-8e89-3980a1578bc',
      type: 'Result',
      message: 'Mid-term results are out',
      timestamp: '2026-04-22 17:51:30',
    },
    {
      id: '12832185-caba-487b-93a9-1f2f2d86e6d0',
      type: 'Placement',
      message: 'CSA Corporation hiring',
      timestamp: '2026-04-22 17:51:18',
    },
    {
      id: '8118abd-6ad1-4f77-9554-f5a7f8b808d8',
      type: 'Event',
      message: 'Farewell',
      timestamp: '2026-04-22 17:51:05',
    },
  ];
  res.json({ notifications: mockNotifications });
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

export default app;
