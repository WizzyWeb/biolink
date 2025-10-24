import nodemailer from "nodemailer";
import { 
  getVerificationEmailTemplate, 
  getPasswordResetEmailTemplate, 
  getWelcomeEmailTemplate,
  getPasswordChangedEmailTemplate,
  getAccountLockedEmailTemplate,
  getEmailChangeConfirmationTemplate,
  getNewsletterTemplate,
  getAccountDeletionConfirmationTemplate,
  getDefaultEmailData,
  type EmailTemplateData 
} from "./emailTemplates";

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

const SMTP_FROM = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@linkboard.com";
const APP_URL = process.env.APP_URL || 
  (process.env.REPLIT_DOMAINS?.split(",")[0] 
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "http://localhost:3000");

// Get default email template data
const getEmailData = (): EmailTemplateData => getDefaultEmailData(APP_URL);

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using the configured SMTP transporter and the standard HTML template.
 *
 * If SMTP credentials are not configured, the function logs the email details and returns an error result.
 *
 * @param to - Recipient email address
 * @param subject - Email subject line
 * @param html - HTML content to embed into the email body (will be wrapped with the standard email template)
 * @returns An object with `success: true` and `messageId` on success, or `success: false` and `error` describing the failure
 */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
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
      from: `"LinkBoard" <${SMTP_FROM}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Sends a verification email containing a tokenized verification link to the given address.
 *
 * @param email - Recipient email address
 * @param token - One-time verification token included in the link
 * @returns An object with `success: true` and `messageId` when the message is sent, or `success: false` and an `error` string on failure
 */
export async function sendVerificationEmail(email: string, token: string, firstName?: string) {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`;
  const template = getVerificationEmailTemplate({
    ...getEmailData(),
    verificationUrl,
    firstName
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Sends a password reset email to the specified address containing a link that expires in one hour.
 *
 * @param email - Recipient email address
 * @param token - Single-use token appended to the reset URL
 * @returns An object with `success: true` and `messageId` when the email was sent, or `success: false` and `error` when sending failed
 */
export async function sendPasswordResetEmail(email: string, token: string, firstName?: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  const template = getPasswordResetEmailTemplate({
    ...getEmailData(),
    resetUrl,
    firstName
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Sends a welcome email to a new user containing their profile URL and a link to the dashboard.
 *
 * @returns `{ success: true, messageId?: string }` on successful send; `{ success: false, error: string }` on failure.
 */
export async function sendWelcomeEmail(email: string, username: string, firstName?: string) {
  const profileUrl = `${APP_URL}/${username}`;
  const template = getWelcomeEmailTemplate({
    ...getEmailData(),
    profileUrl,
    username,
    firstName
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Sends a password changed confirmation email
 */
export async function sendPasswordChangedEmail(email: string, firstName?: string) {
  const changeTime = new Date().toLocaleString();
  const template = getPasswordChangedEmailTemplate({
    ...getEmailData(),
    firstName,
    changeTime
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Sends an account locked notification email
 */
export async function sendAccountLockedEmail(email: string, unlockUrl: string, lockReason: string, firstName?: string) {
  const template = getAccountLockedEmailTemplate({
    ...getEmailData(),
    firstName,
    unlockUrl,
    lockReason
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Sends an email change confirmation email
 */
export async function sendEmailChangeConfirmationEmail(email: string, newEmail: string, confirmationUrl: string, firstName?: string) {
  const template = getEmailChangeConfirmationTemplate({
    ...getEmailData(),
    firstName,
    newEmail,
    confirmationUrl
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Sends a newsletter email
 */
export async function sendNewsletterEmail(email: string, newsletterContent: string, featuredLinks?: Array<{title: string; url: string; description: string}>, firstName?: string) {
  const template = getNewsletterTemplate({
    ...getEmailData(),
    firstName,
    newsletterContent,
    featuredLinks
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

/**
 * Sends an account deletion confirmation email
 */
export async function sendAccountDeletionConfirmationEmail(email: string, deletionDate: string, firstName?: string) {
  const template = getAccountDeletionConfirmationTemplate({
    ...getEmailData(),
    firstName,
    deletionDate
  });

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}