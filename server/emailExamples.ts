/**
 * Email Template Usage Examples
 * 
 * This file demonstrates how to use the various email templates
 * in different scenarios throughout the LinkBoard application.
 */

import { 
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
  sendAccountLockedEmail,
  sendEmailChangeConfirmationEmail,
  sendNewsletterEmail,
  sendAccountDeletionConfirmationEmail
} from './email';

// Example: User registration flow
export async function handleUserRegistration(email: string, firstName: string, token: string) {
  try {
    // Send verification email with user's first name for personalization
    const result = await sendVerificationEmail(email, token, firstName);
    
    if (result.success) {
      console.log('Verification email sent successfully');
      return { success: true, messageId: result.messageId };
    } else {
      console.error('Failed to send verification email:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in user registration flow:', error);
    return { success: false, error: 'Registration failed' };
  }
}

// Example: Password reset flow
export async function handlePasswordReset(email: string, firstName: string, token: string) {
  try {
    const result = await sendPasswordResetEmail(email, token, firstName);
    
    if (result.success) {
      console.log('Password reset email sent successfully');
      return { success: true, messageId: result.messageId };
    } else {
      console.error('Failed to send password reset email:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in password reset flow:', error);
    return { success: false, error: 'Password reset failed' };
  }
}

// Example: Welcome email after successful verification
export async function handleEmailVerification(email: string, username: string, firstName: string) {
  try {
    const result = await sendWelcomeEmail(email, username, firstName);
    
    if (result.success) {
      console.log('Welcome email sent successfully');
      return { success: true, messageId: result.messageId };
    } else {
      console.error('Failed to send welcome email:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in welcome email flow:', error);
    return { success: false, error: 'Welcome email failed' };
  }
}

// Example: Password change notification
export async function handlePasswordChange(email: string, firstName: string) {
  try {
    const result = await sendPasswordChangedEmail(email, firstName);
    
    if (result.success) {
      console.log('Password change notification sent successfully');
      return { success: true, messageId: result.messageId };
    } else {
      console.error('Failed to send password change notification:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in password change notification:', error);
    return { success: false, error: 'Password change notification failed' };
  }
}

// Example: Account security - account locked
export async function handleAccountLocked(email: string, firstName: string, lockReason: string, unlockToken: string) {
  try {
    const unlockUrl = `${process.env.APP_URL || 'http://localhost:3000'}/unlock-account?token=${unlockToken}`;
    const result = await sendAccountLockedEmail(email, unlockUrl, lockReason, firstName);
    
    if (result.success) {
      console.log('Account locked notification sent successfully');
      return { success: true, messageId: result.messageId };
    } else {
      console.error('Failed to send account locked notification:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in account locked notification:', error);
    return { success: false, error: 'Account locked notification failed' };
  }
}

// Example: Email change confirmation
export async function handleEmailChange(email: string, newEmail: string, firstName: string, confirmationToken: string) {
  try {
    const confirmationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/confirm-email-change?token=${confirmationToken}`;
    const result = await sendEmailChangeConfirmationEmail(email, newEmail, confirmationUrl, firstName);
    
    if (result.success) {
      console.log('Email change confirmation sent successfully');
      return { success: true, messageId: result.messageId };
    } else {
      console.error('Failed to send email change confirmation:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in email change confirmation:', error);
    return { success: false, error: 'Email change confirmation failed' };
  }
}

// Example: Newsletter sending
export async function handleNewsletter(email: string, firstName: string, newsletterContent: string) {
  try {
    // Example featured links for the newsletter
    const featuredLinks = [
      {
        title: "New Theme: Dark Mode",
        url: `${process.env.APP_URL || 'http://localhost:3000'}/themes`,
        description: "Check out our new dark mode theme for a sleek, modern look."
      },
      {
        title: "Analytics Dashboard",
        url: `${process.env.APP_URL || 'http://localhost:3000'}/analytics`,
        description: "Track your link performance with our new analytics dashboard."
      }
    ];

    const result = await sendNewsletterEmail(email, newsletterContent, featuredLinks, firstName);
    
    if (result.success) {
      console.log('Newsletter sent successfully');
      return { success: true, messageId: result.messageId };
    } else {
      console.error('Failed to send newsletter:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in newsletter sending:', error);
    return { success: false, error: 'Newsletter sending failed' };
  }
}

// Example: Account deletion confirmation
export async function handleAccountDeletion(email: string, firstName: string, deletionDate: string) {
  try {
    const result = await sendAccountDeletionConfirmationEmail(email, deletionDate, firstName);
    
    if (result.success) {
      console.log('Account deletion confirmation sent successfully');
      return { success: true, messageId: result.messageId };
    } else {
      console.error('Failed to send account deletion confirmation:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in account deletion confirmation:', error);
    return { success: false, error: 'Account deletion confirmation failed' };
  }
}

// Example: Bulk email sending with error handling
export async function sendBulkEmails(recipients: Array<{email: string, firstName?: string}>, emailType: 'newsletter' | 'announcement', content: string) {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      let result;
      
      if (emailType === 'newsletter') {
        result = await sendNewsletterEmail(recipient.email, content, undefined, recipient.firstName);
      } else {
        // For announcements, you might want to create a separate template
        result = await sendNewsletterEmail(recipient.email, content, undefined, recipient.firstName);
      }
      
      results.push({
        email: recipient.email,
        success: result.success,
        messageId: result.messageId,
        error: result.error
      });
      
      // Add a small delay to avoid overwhelming the SMTP server
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      results.push({
        email: recipient.email,
        success: false,
        error: String(error)
      });
    }
  }
  
  return results;
}

// Example: Email template testing
export async function testEmailTemplates() {
  const testEmail = 'test@example.com';
  const testFirstName = 'Test User';
  const testToken = 'test-token-123';
  const testUsername = 'testuser';
  
  console.log('Testing email templates...');
  
  // Test verification email
  console.log('Testing verification email...');
  await sendVerificationEmail(testEmail, testToken, testFirstName);
  
  // Test password reset email
  console.log('Testing password reset email...');
  await sendPasswordResetEmail(testEmail, testToken, testFirstName);
  
  // Test welcome email
  console.log('Testing welcome email...');
  await sendWelcomeEmail(testEmail, testUsername, testFirstName);
  
  // Test password changed email
  console.log('Testing password changed email...');
  await sendPasswordChangedEmail(testEmail, testFirstName);
  
  // Test account locked email
  console.log('Testing account locked email...');
  const unlockUrl = `${process.env.APP_URL || 'http://localhost:3000'}/unlock-account?token=${testToken}`;
  await sendAccountLockedEmail(testEmail, unlockUrl, 'Multiple failed login attempts', testFirstName);
  
  // Test email change confirmation
  console.log('Testing email change confirmation...');
  const confirmationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/confirm-email-change?token=${testToken}`;
  await sendEmailChangeConfirmationEmail(testEmail, 'newemail@example.com', confirmationUrl, testFirstName);
  
  // Test newsletter
  console.log('Testing newsletter...');
  await sendNewsletterEmail(testEmail, 'This is a test newsletter content.', undefined, testFirstName);
  
  // Test account deletion confirmation
  console.log('Testing account deletion confirmation...');
  const deletionDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();
  await sendAccountDeletionConfirmationEmail(testEmail, deletionDate, testFirstName);
  
  console.log('Email template testing completed!');
}
