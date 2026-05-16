import axios, { AxiosError } from 'axios';

interface EmailPayload {
  recipient: string;
  subject: string;
  message: string;
}

class EmailService {
  private apiEndpoint = 'https://api.example.com/send-email';
  private retryAttempts = 3;
  private retryDelay = 1000;

  async sendEmail(payload: EmailPayload): Promise<boolean> {
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        await axios.post(this.apiEndpoint, {
          to: payload.recipient,
          subject: payload.subject,
          html: this.formatEmailBody(payload.message),
        });
        return true;
      } catch (error) {
        if (attempt === this.retryAttempts) {
          console.error(`Email failed after ${this.retryAttempts} attempts:`, error);
          return false;
        }
        await this.delay(this.retryDelay * attempt);
      }
    }
    return false;
  }

  async sendBatchEmails(recipients: string[], subject: string, message: string): Promise<number> {
    const results = await Promise.all(
      recipients.map((recipient) =>
        this.sendEmail({ recipient, subject, message }).catch(() => false)
      )
    );

    return results.filter((r) => r).length;
  }

  async notifyAllStudents(studentEmails: string[], subject: string, message: string): Promise<{
    total: number;
    successful: number;
    failed: number;
  }> {
    const successful = await this.sendBatchEmails(studentEmails, subject, message);

    return {
      total: studentEmails.length,
      successful,
      failed: studentEmails.length - successful,
    };
  }

  private formatEmailBody(message: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f0f0f0; padding: 10px; border-radius: 5px; }
          .content { padding: 20px 0; }
          .footer { border-top: 1px solid #ddd; padding-top: 10px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Notification</h2>
          </div>
          <div class="content">
            ${message}
          </div>
          <div class="footer">
            <p>This is an automated notification. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default new EmailService();
