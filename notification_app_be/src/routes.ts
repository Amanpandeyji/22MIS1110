import { Router, Request, Response } from 'express';
import notificationService from './notification-service';

class Logger {
  private stack: string;
  private logPackage: string;

  constructor(stack: string, logPackage: string) {
    this.stack = stack;
    this.logPackage = logPackage;
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    console.log('[DEBUG]', JSON.stringify({ timestamp: new Date().toISOString(), level: 'debug', stack: this.stack, package: this.logPackage, message, metadata }));
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    console.log('[INFO]', JSON.stringify({ timestamp: new Date().toISOString(), level: 'info', stack: this.stack, package: this.logPackage, message, metadata }));
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    console.warn('[WARN]', JSON.stringify({ timestamp: new Date().toISOString(), level: 'warn', stack: this.stack, package: this.logPackage, message, metadata }));
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    console.error('[ERROR]', JSON.stringify({ timestamp: new Date().toISOString(), level: 'error', stack: this.stack, package: this.logPackage, message, metadata }));
  }

  fatal(message: string, metadata?: Record<string, unknown>): void {
    console.error('[FATAL]', JSON.stringify({ timestamp: new Date().toISOString(), level: 'fatal', stack: this.stack, package: this.logPackage, message, metadata }));
  }
}

const router = Router();
const logger = new Logger('backend', 'notification-routes');

router.get('/notifications', async (req: Request, res: Response) => {
  try {
    const { studentId, limit = 20, page = 1, notificationType } = req.query;

    if (!studentId) {
      res.status(400).json({ error: 'studentId is required' });
      return;
    }

    const limitNum = Math.min(parseInt(limit as string) || 20, 100);
    const pageNum = Math.max(parseInt(page as string) || 1, 1);

    if (notificationType) {
      const result = await notificationService.getStudentNotificationsByType(
        studentId as string,
        notificationType as string,
        limitNum,
        pageNum
      );
      res.json(result);
    } else {
      const result = await notificationService.getStudentNotifications(
        studentId as string,
        limitNum,
        pageNum
      );
      res.json(result);
    }
  } catch (error) {
    logger.error('Error in GET /notifications', { error: String(error) });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/notifications/priority', async (req: Request, res: Response) => {
  try {
    const { studentId, limit = 10 } = req.query;

    if (!studentId) {
      res.status(400).json({ error: 'studentId is required' });
      return;
    }

    const limitNum = Math.min(parseInt(limit as string) || 10, 50);
    const notifications = await notificationService.getTopPriorityNotifications(
      studentId as string,
      limitNum
    );

    res.json({ notifications });
  } catch (error) {
    logger.error('Error in GET /notifications/priority', { error: String(error) });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/notifications/stats', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      res.status(400).json({ error: 'studentId is required' });
      return;
    }

    const stats = await notificationService.getNotificationStats(studentId as string);
    res.json(stats);
  } catch (error) {
    logger.error('Error in GET /notifications/stats', { error: String(error) });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/notifications', async (req: Request, res: Response) => {
  try {
    const { studentId, type, title, message, metadata } = req.body;

    if (!studentId || !type || !title || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const notification = await notificationService.createNotification({
      studentId,
      type,
      title,
      message,
      metadata,
    });

    res.status(201).json(notification);
  } catch (error) {
    logger.error('Error in POST /notifications', { error: String(error) });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/notifications/batch', async (req: Request, res: Response) => {
  try {
    const { studentIds, type, title, message, emails, metadata } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || !type || !title || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const result = await notificationService.sendToMultipleStudents({
      studentIds,
      type,
      title,
      message,
      emails,
      metadata,
    });

    res.status(201).json(result);
  } catch (error) {
    logger.error('Error in POST /notifications/batch', { error: String(error) });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/notifications/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await notificationService.markNotificationAsRead(id);

    if (!notification) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    res.json(notification);
  } catch (error) {
    logger.error('Error in PUT /notifications/:id/read', { error: String(error) });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
