import axios from 'axios';

export interface LogEntry {
  timestamp: string;
  level: string;
  stack: string;
  package: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export class Logger {
  private stack: string;
  private logPackage: string;
  private logs: LogEntry[] = [];

  constructor(stack: 'backend' | 'frontend', logPackage: string) {
    this.stack = stack;
    this.logPackage = logPackage;
  }

  private createLogEntry(level: string, message: string, metadata?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      stack: this.stack,
      package: this.logPackage,
      message,
      metadata,
    };
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry('debug', message, metadata);
    console.log('[DEBUG]', JSON.stringify(entry));
    this.logs.push(entry);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry('info', message, metadata);
    console.log('[INFO]', JSON.stringify(entry));
    this.logs.push(entry);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry('warn', message, metadata);
    console.warn('[WARN]', JSON.stringify(entry));
    this.logs.push(entry);
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry('error', message, metadata);
    console.error('[ERROR]', JSON.stringify(entry));
    this.logs.push(entry);
  }

  fatal(message: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry('fatal', message, metadata);
    console.error('[FATAL]', JSON.stringify(entry));
    this.logs.push(entry);
  }

  async sendLogs(apiEndpoint: string): Promise<void> {
    if (this.logs.length === 0) return;

    try {
      await axios.post(apiEndpoint, { logs: this.logs });
      this.logs = [];
    } catch (error) {
      console.error('Failed to send logs:', error);
    }
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }
}

export default Logger;
