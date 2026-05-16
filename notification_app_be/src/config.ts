export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
export const REGISTRATION_API = `${API_BASE_URL}/register`;
export const AUTH_API = `${API_BASE_URL}/auth`;
export const LOG_API = `${API_BASE_URL}/logs`;
export const NOTIFICATIONS_API = `${API_BASE_URL}/notifications`;

export const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'notification_system',
  user: process.env.DB_USER || 'notification_user',
  password: process.env.DB_PASSWORD || 'password',
};

export const EMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'notifications@system.com',
    pass: process.env.EMAIL_PASSWORD || 'app_password',
  },
};

export const NOTIFICATION_TYPES = {
  EVENT: 'Event',
  RESULT: 'Result',
  PLACEMENT: 'Placement',
};

export const PRIORITY_LEVELS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};
