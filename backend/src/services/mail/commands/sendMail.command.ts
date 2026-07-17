import nodemailer from 'nodemailer';
import { env } from '../../../configs/env.config.js';

export class MailService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly fromAddress: string;
  private readonly fromName: string;

  constructor() {
    this.fromAddress = env.smtp.fromEmail;
    this.fromName = env.smtp.fromName;

    if (this.canSend()) {
      this.transporter = nodemailer.createTransport({
        host: env.smtp.host,
        port: env.smtp.port,
        secure: env.smtp.secure,
        auth: {
          user: env.smtp.user,
          pass: env.smtp.pass,
        },
      });
    }
  }

  private canSend() {
    return Boolean(
      env.smtp.host &&
        env.smtp.user &&
        env.smtp.pass &&
        env.smtp.fromEmail,
    );
  }

  async sendMail({
    to,
    subject,
    text,
    html,
  }: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }) {
    if (!this.canSend() || !this.transporter) {
      console.log(`SMTP is not configured. Skipping email to ${to}. Subject: ${subject}`);
      console.log(text);
      return;
    }

    await this.transporter.sendMail({
      from: `${this.fromName} <${this.fromAddress}>`,
      to,
      subject,
      text,
      html,
    });
  }
}
