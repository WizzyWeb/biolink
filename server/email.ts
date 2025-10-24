import nodemailer from "nodemailer";

// SMTP Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const SMTP_FROM = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@linkhub.com";
const APP_URL = process.env.REPLIT_DOMAINS?.split(",")[0] 
  ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
  : process.env.APP_URL || "http://localhost:3000";

// Email Templates
const getEmailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #6366f1;
      margin-bottom: 10px;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #6366f1;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #4f46e5;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      color: #666;
      font-size: 14px;
    }
    .code {
      background-color: #f3f4f6;
      padding: 12px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 18px;
      letter-spacing: 2px;
      text-align: center;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🔗 LinkHub</div>
    </div>
    ${content}
    <div class="footer">
      <p>This is an automated email from LinkHub. Please do not reply to this email.</p>
      <p>&copy; ${new Date().getFullYear()} LinkHub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not configured. Email not sent.");
      console.log("To:", to);
      console.log("Subject:", subject);
      console.log("HTML:", html);
      return { success: false, error: "SMTP not configured" };
    }

    const info = await transporter.sendMail({
      from: `"LinkHub" <${SMTP_FROM}>`,
      to,
      subject,
      html: getEmailTemplate(html),
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: String(error) };
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`;
  
  const html = `
    <h2>Welcome to LinkHub!</h2>
    <p>Thank you for creating an account. Please verify your email address to get started.</p>
    <p style="text-align: center;">
      <a href="${verificationUrl}" class="button">Verify Email Address</a>
    </p>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #666; font-size: 14px;">${verificationUrl}</p>
    <p style="margin-top: 30px; color: #666; font-size: 14px;">
      This link will expire in 24 hours. If you didn't create an account with LinkHub, you can safely ignore this email.
    </p>
  `;

  return sendEmail({
    to: email,
    subject: "Verify Your Email - LinkHub",
    html,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  
  const html = `
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password for your LinkHub account.</p>
    <p style="text-align: center;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </p>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #666; font-size: 14px;">${resetUrl}</p>
    <p style="margin-top: 30px; color: #666; font-size: 14px;">
      This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
    </p>
  `;

  return sendEmail({
    to: email,
    subject: "Reset Your Password - LinkHub",
    html,
  });
}

export async function sendWelcomeEmail(email: string, username: string) {
  const profileUrl = `${APP_URL}/${username}`;
  
  const html = `
    <h2>Welcome to LinkHub! 🎉</h2>
    <p>Your account has been successfully created and verified!</p>
    <p>Your profile is now live at:</p>
    <div class="code">${profileUrl}</div>
    <p style="text-align: center;">
      <a href="${APP_URL}/dashboard" class="button">Go to Dashboard</a>
    </p>
    <p>Start customizing your profile and adding links to share with the world!</p>
  `;

  return sendEmail({
    to: email,
    subject: "Welcome to LinkHub!",
    html,
  });
}
