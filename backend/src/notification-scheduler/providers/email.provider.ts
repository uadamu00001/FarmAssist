import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string | undefined, body: string) {
  // If SMTP env is configured, try to sends. Otherwise just log (safe mock).
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@example.com',
      to,
      subject: subject ?? '(no-subject)',
      text: body,
    });

    return { ok: true, info };
  }

  // Fallback mock
  console.log(`[Notification][Email] To=${to} Subject=${subject} Body=${body}`);
  return { ok: true, info: 'mock-sent' };
}
