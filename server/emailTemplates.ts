/**
 * Email Templates for LinkBoard
 * 
 * This module contains all email templates with proper email guidelines
 * to ensure high deliverability and avoid spam filters.
 */

export interface EmailTemplateData {
  appName: string;
  appUrl: string;
  supportEmail: string;
  unsubscribeUrl?: string;
  [key: string]: any;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Base email template with proper email guidelines
 * - Uses table-based layout for maximum compatibility
 * - Inline CSS for better email client support
 * - Proper MIME headers and meta tags
 * - Mobile-responsive design
 * - Anti-spam measures
 */
export function getBaseEmailTemplate(content: string, data: EmailTemplateData): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <meta name="format-detection" content="date=no" />
  <meta name="format-detection" content="address=no" />
  <meta name="format-detection" content="email=no" />
  <title>${data.appName}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    /* Main styles */
    body {
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #f4f4f4;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    .header {
      background-color: #6366f1;
      padding: 30px 20px;
      text-align: center;
    }
    
    .logo {
      color: #ffffff;
      font-size: 28px;
      font-weight: bold;
      text-decoration: none;
      margin: 0;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .button {
      display: inline-block;
      padding: 16px 32px;
      background-color: #6366f1;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      margin: 20px 0;
      transition: background-color 0.3s ease;
    }
    
    .button:hover {
      background-color: #4f46e5;
    }
    
    .button-secondary {
      background-color: #f3f4f6;
      color: #374151 !important;
    }
    
    .button-secondary:hover {
      background-color: #e5e7eb;
    }
    
    .code {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 16px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      word-break: break-all;
      text-align: center;
      margin: 20px 0;
      color: #495057;
    }
    
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    
    .footer p {
      margin: 5px 0;
      color: #6c757d;
      font-size: 14px;
    }
    
    .footer a {
      color: #6366f1;
      text-decoration: none;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    .divider {
      height: 1px;
      background-color: #e9ecef;
      margin: 30px 0;
    }
    
    .highlight {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin: 20px 0;
    }
    
    .warning {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 16px;
      margin: 20px 0;
    }
    
    .success {
      background-color: #f0fdf4;
      border-left: 4px solid #22c55e;
      padding: 16px;
      margin: 20px 0;
    }
    
    /* Mobile responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      .content {
        padding: 20px !important;
      }
      .header {
        padding: 20px !important;
      }
      .logo {
        font-size: 24px !important;
      }
      .button {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
          <!-- Header -->
          <tr>
            <td class="header">
              <h1 class="logo">🔗 ${data.appName}</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer">
              <p>This is an automated email from ${data.appName}. Please do not reply to this email.</p>
              <p>If you have any questions, please contact us at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a></p>
              ${data.unsubscribeUrl ? `<p><a href="${data.unsubscribeUrl}">Unsubscribe</a> | <a href="${data.appUrl}/privacy">Privacy Policy</a></p>` : ''}
              <p>&copy; ${new Date().getFullYear()} ${data.appName}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Email verification template
 */
export function getVerificationEmailTemplate(data: EmailTemplateData & { verificationUrl: string; firstName?: string }): EmailTemplate {
  const subject = `Verify your email address - ${data.appName}`;
  
  const html = getBaseEmailTemplate(`
    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Welcome to ${data.appName}!</h2>
    
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">
      ${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}
    </p>
    
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">
      Thank you for creating an account with ${data.appName}! To get started, please verify your email address by clicking the button below.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
    </div>
    
    <div class="highlight">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>Can't click the button?</strong> Copy and paste this link into your browser:
      </p>
      <div class="code">${data.verificationUrl}</div>
    </div>
    
    <div class="warning">
      <p style="margin: 0; color: #dc2626; font-size: 14px;">
        <strong>Important:</strong> This verification link will expire in 24 hours. If you didn't create an account with ${data.appName}, you can safely ignore this email.
      </p>
    </div>
  `, data);
  
  const text = `
Welcome to ${data.appName}!

${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}

Thank you for creating an account with ${data.appName}! To get started, please verify your email address by visiting the link below:

${data.verificationUrl}

This verification link will expire in 24 hours. If you didn't create an account with ${data.appName}, you can safely ignore this email.

Best regards,
The ${data.appName} Team
  `.trim();
  
  return { subject, html, text };
}

/**
 * Password reset template
 */
export function getPasswordResetEmailTemplate(data: EmailTemplateData & { resetUrl: string; firstName?: string }): EmailTemplate {
  const subject = `Reset your password - ${data.appName}`;
  
  const html = getBaseEmailTemplate(`
    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
    
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">
      ${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}
    </p>
    
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">
      We received a request to reset your password for your ${data.appName} account. If you made this request, click the button below to reset your password.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.resetUrl}" class="button">Reset Password</a>
    </div>
    
    <div class="highlight">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>Can't click the button?</strong> Copy and paste this link into your browser:
      </p>
      <div class="code">${data.resetUrl}</div>
    </div>
    
    <div class="warning">
      <p style="margin: 0; color: #dc2626; font-size: 14px;">
        <strong>Security Notice:</strong> This password reset link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email and your password will remain unchanged.
      </p>
    </div>
  `, data);
  
  const text = `
Password Reset Request - ${data.appName}

${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}

We received a request to reset your password for your ${data.appName} account. If you made this request, visit the link below to reset your password:

${data.resetUrl}

This password reset link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email and your password will remain unchanged.

Best regards,
The ${data.appName} Team
  `.trim();
  
  return { subject, html, text };
}

/**
 * Welcome email template
 */
export function getWelcomeEmailTemplate(data: EmailTemplateData & { profileUrl: string; username: string; firstName?: string }): EmailTemplate {
  const subject = `Welcome to ${data.appName}! Your profile is ready 🎉`;
  
  const html = getBaseEmailTemplate(`
    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Welcome to ${data.appName}! 🎉</h2>
    
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">
      ${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}
    </p>
    
    <div class="success">
      <p style="margin: 0; color: #166534; font-size: 16px;">
        <strong>Congratulations!</strong> Your account has been successfully created and verified!
      </p>
    </div>
    
    <p style="margin: 20px 0; color: #4b5563; font-size: 16px;">
      Your ${data.appName} profile is now live and ready to share:
    </p>
    
    <div class="code">${data.profileUrl}</div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.appUrl}/dashboard" class="button">Go to Dashboard</a>
      <a href="${data.profileUrl}" class="button button-secondary" style="margin-left: 10px;">View Profile</a>
    </div>
    
    <div class="highlight">
      <p style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">
        <strong>What's next?</strong>
      </p>
      <ul style="margin: 0; padding-left: 20px; color: #92400e;">
        <li>Customize your profile with a bio and profile picture</li>
        <li>Add your social media links and websites</li>
        <li>Choose a theme that matches your style</li>
        <li>Share your profile with the world!</li>
      </ul>
    </div>
  `, data);
  
  const text = `
Welcome to ${data.appName}! 🎉

${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}

Congratulations! Your account has been successfully created and verified!

Your ${data.appName} profile is now live and ready to share:
${data.profileUrl}

What's next?
- Customize your profile with a bio and profile picture
- Add your social media links and websites  
- Choose a theme that matches your style
- Share your profile with the world!

Get started: ${data.appUrl}/dashboard
View your profile: ${data.profileUrl}

Best regards,
The ${data.appName} Team
  `.trim();
  
  return { subject, html, text };
}

/**
 * Password changed confirmation template
 */
export function getPasswordChangedEmailTemplate(data: EmailTemplateData & { firstName?: string; changeTime: string }): EmailTemplate {
  const subject = `Password changed successfully - ${data.appName}`;
  
  const html = getBaseEmailTemplate(`
    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Password Changed Successfully</h2>
    
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">
      ${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}
    </p>
    
    <div class="success">
      <p style="margin: 0; color: #166534; font-size: 16px;">
        <strong>Your password has been successfully changed!</strong>
      </p>
    </div>
    
    <p style="margin: 20px 0; color: #4b5563; font-size: 16px;">
      Your password was changed on ${data.changeTime}. If you made this change, no further action is needed.
    </p>
    
    <div class="warning">
      <p style="margin: 0; color: #dc2626; font-size: 14px;">
        <strong>Security Alert:</strong> If you didn't make this change, please contact our support team immediately at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a>
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.appUrl}/dashboard" class="button">Go to Dashboard</a>
    </div>
  `, data);
  
  const text = `
Password Changed Successfully - ${data.appName}

${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}

Your password has been successfully changed!

Your password was changed on ${data.changeTime}. If you made this change, no further action is needed.

Security Alert: If you didn't make this change, please contact our support team immediately at ${data.supportEmail}

Go to Dashboard: ${data.appUrl}/dashboard

Best regards,
The ${data.appName} Team
  `.trim();
  
  return { subject, html, text };
}

/**
 * Account locked template
 */
export function getAccountLockedEmailTemplate(data: EmailTemplateData & { firstName?: string; unlockUrl: string; lockReason: string }): EmailTemplate {
  const subject = `Account temporarily locked - ${data.appName}`;
  
  const html = getBaseEmailTemplate(`
    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Account Temporarily Locked</h2>
    
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">
      ${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}
    </p>
    
    <div class="warning">
      <p style="margin: 0; color: #dc2626; font-size: 16px;">
        <strong>Your account has been temporarily locked for security reasons.</strong>
      </p>
    </div>
    
    <p style="margin: 20px 0; color: #4b5563; font-size: 16px;">
      Reason: ${data.lockReason}
    </p>
    
    <p style="margin: 20px 0; color: #4b5563; font-size: 16px;">
      To unlock your account, please click the button below and follow the instructions.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.unlockUrl}" class="button">Unlock Account</a>
    </div>
    
    <div class="highlight">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>Need help?</strong> If you're having trouble unlocking your account, please contact our support team at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a>
      </p>
    </div>
  `, data);
  
  const text = `
Account Temporarily Locked - ${data.appName}

${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}

Your account has been temporarily locked for security reasons.

Reason: ${data.lockReason}

To unlock your account, please visit: ${data.unlockUrl}

Need help? If you're having trouble unlocking your account, please contact our support team at ${data.supportEmail}

Best regards,
The ${data.appName} Team
  `.trim();
  
  return { subject, html, text };
}

/**
 * Email change confirmation template
 */
export function getEmailChangeConfirmationTemplate(data: EmailTemplateData & { firstName?: string; newEmail: string; confirmationUrl: string }): EmailTemplate {
  const subject = `Confirm your new email address - ${data.appName}`;
  
  const html = getBaseEmailTemplate(`
    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Confirm New Email Address</h2>
    
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">
      ${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}
    </p>
    
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">
      You recently requested to change your email address to <strong>${data.newEmail}</strong>. To complete this change, please confirm your new email address by clicking the button below.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.confirmationUrl}" class="button">Confirm New Email</a>
    </div>
    
    <div class="highlight">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>Can't click the button?</strong> Copy and paste this link into your browser:
      </p>
      <div class="code">${data.confirmationUrl}</div>
    </div>
    
    <div class="warning">
      <p style="margin: 0; color: #dc2626; font-size: 14px;">
        <strong>Security Notice:</strong> This confirmation link will expire in 24 hours. If you didn't request this email change, please contact our support team immediately at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a>
      </p>
    </div>
  `, data);
  
  const text = `
Confirm New Email Address - ${data.appName}

${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}

You recently requested to change your email address to ${data.newEmail}. To complete this change, please confirm your new email address by visiting the link below:

${data.confirmationUrl}

This confirmation link will expire in 24 hours. If you didn't request this email change, please contact our support team immediately at ${data.supportEmail}

Best regards,
The ${data.appName} Team
  `.trim();
  
  return { subject, html, text };
}

/**
 * Newsletter template
 */
export function getNewsletterTemplate(data: EmailTemplateData & { 
  firstName?: string; 
  newsletterContent: string; 
  featuredLinks?: Array<{title: string; url: string; description: string}>;
}): EmailTemplate {
  const subject = `Your ${data.appName} Newsletter - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  
  const featuredLinksHtml = data.featuredLinks ? `
    <div style="margin: 30px 0;">
      <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">Featured This Month</h3>
      ${data.featuredLinks.map(link => `
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 15px 0; background-color: #f9fafb;">
          <h4 style="margin: 0 0 10px 0; color: #1f2937; font-size: 18px;">
            <a href="${link.url}" style="color: #6366f1; text-decoration: none;">${link.title}</a>
          </h4>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">${link.description}</p>
        </div>
      `).join('')}
    </div>
  ` : '';
  
  const html = getBaseEmailTemplate(`
    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Your ${data.appName} Newsletter</h2>
    
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">
      ${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}
    </p>
    
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">
      Here's what's new and exciting at ${data.appName} this month:
    </p>
    
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
      ${data.newsletterContent}
    </div>
    
    ${featuredLinksHtml}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.appUrl}/dashboard" class="button">Update Your Profile</a>
    </div>
  `, data);
  
  const text = `
Your ${data.appName} Newsletter - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}

${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}

Here's what's new and exciting at ${data.appName} this month:

${data.newsletterContent}

${data.featuredLinks ? data.featuredLinks.map(link => `${link.title}: ${link.url}\n${link.description}\n`).join('\n') : ''}

Update Your Profile: ${data.appUrl}/dashboard

Best regards,
The ${data.appName} Team
  `.trim();
  
  return { subject, html, text };
}

/**
 * Account deletion confirmation template
 */
export function getAccountDeletionConfirmationTemplate(data: EmailTemplateData & { firstName?: string; deletionDate: string }): EmailTemplate {
  const subject = `Account deletion confirmed - ${data.appName}`;
  
  const html = getBaseEmailTemplate(`
    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Account Deletion Confirmed</h2>
    
    <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">
      ${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}
    </p>
    
    <div class="warning">
      <p style="margin: 0; color: #dc2626; font-size: 16px;">
        <strong>Your account has been scheduled for deletion.</strong>
      </p>
    </div>
    
    <p style="margin: 20px 0; color: #4b5563; font-size: 16px;">
      Your ${data.appName} account will be permanently deleted on <strong>${data.deletionDate}</strong>. All your data, including your profile and links, will be removed and cannot be recovered.
    </p>
    
    <p style="margin: 20px 0; color: #4b5563; font-size: 16px;">
      If you change your mind, you can cancel the deletion by logging into your account before the deletion date.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.appUrl}/login" class="button">Cancel Deletion</a>
    </div>
    
    <div class="highlight">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>Need help?</strong> If you have any questions about this process, please contact our support team at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a>
      </p>
    </div>
  `, data);
  
  const text = `
Account Deletion Confirmed - ${data.appName}

${data.firstName ? `Hi ${data.firstName},` : 'Hello,'}

Your account has been scheduled for deletion.

Your ${data.appName} account will be permanently deleted on ${data.deletionDate}. All your data, including your profile and links, will be removed and cannot be recovered.

If you change your mind, you can cancel the deletion by logging into your account before the deletion date.

Cancel Deletion: ${data.appUrl}/login

Need help? If you have any questions about this process, please contact our support team at ${data.supportEmail}

Best regards,
The ${data.appName} Team
  `.trim();
  
  return { subject, html, text };
}

/**
 * Get default email template data
 */
export function getDefaultEmailData(appUrl: string): EmailTemplateData {
  return {
    appName: 'LinkBoard',
    appUrl,
    supportEmail: 'support@linkboard.com',
    unsubscribeUrl: `${appUrl}/unsubscribe`
  };
}
