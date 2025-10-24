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
const APP_URL = process.env.REPLIT_DOMAINS?.split(",")[0] 
  ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
  : process.env.APP_URL || "http://localhost:3000";

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
 * Send a verification email with a tokenized link to the specified recipient.
 *
 * @param email - Recipient email address
 * @param token - One-time verification token included in the link
 * @param firstName - Optional recipient first name for template personalization
 * @returns `success: true` and `messageId` when the message is sent, or `success: false` and an `error` string on failure
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
 * Sends a password reset email containing a tokenized reset link to the specified address.
 *
 * @param firstName - Optional recipient first name used to personalize the email template
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
 * Send a welcome email containing a link to the user's profile and the application dashboard.
 *
 * @param email - Recipient email address
 * @param username - User's username used to construct the profile URL included in the message
 * @param firstName - Optional recipient first name used to personalize the template
 * @returns `{ success: true, messageId?: string }` if the message was accepted for delivery, `{ success: false, error: string }` on failure
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
 * Sends a confirmation email notifying a user that their password was changed.
 *
 * @param email - Recipient email address
 * @param firstName - Optional recipient first name used to personalize the template
 * @returns `{ success: true, messageId }` on success, `{ success: false, error }` on failure
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
 * Notify a user that their account has been locked by sending an account-locked email.
 *
 * @param email - Recipient email address
 * @param unlockUrl - URL the user can visit to unlock their account
 * @param lockReason - Reason why the account was locked (displayed in the email)
 * @param firstName - Optional recipient first name used to personalize the email
 * @returns An object indicating outcome: `success` is `true` when sending succeeded and `false` otherwise; includes `messageId` on success or `error` on failure.
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
 * Sends an email to confirm a user's change of email address.
 *
 * @param email - The recipient's current email address
 * @param newEmail - The new email address that requires confirmation
 * @param confirmationUrl - The URL the recipient must visit to confirm the change
 * @param firstName - Optional recipient first name used to personalize the template
 * @returns An object with `success: true` and `messageId` on success, or `success: false` and `error` on failure
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
 * Sends the newsletter content to a recipient using the newsletter template.
 *
 * @param email - Recipient email address
 * @param newsletterContent - The newsletter content (HTML string)
 * @param featuredLinks - Optional array of featured links to include, each with `title`, `url`, and `description`
 * @param firstName - Optional recipient first name for personalization
 * @returns An object with `success` and either `messageId` on success or `error` on failure
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
 * Send an account deletion confirmation email to the specified address.
 *
 * @param email - Recipient email address
 * @param deletionDate - Human-readable date string to display as the scheduled deletion date
 * @param firstName - Optional recipient first name to personalize the message
 * @returns An object with `success: true` and `messageId` when the message was sent, or `success: false` and an `error` string on failure
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