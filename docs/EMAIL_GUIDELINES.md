# Email Guidelines for LinkBoard

This document outlines the email guidelines and best practices implemented in LinkBoard to ensure high deliverability and avoid spam filters.

## Email Template System

### Overview
LinkBoard uses a comprehensive email template system located in `server/emailTemplates.ts` that follows email industry best practices for maximum deliverability and user experience.

### Key Features

#### 1. **Email Client Compatibility**
- Uses table-based layout for maximum compatibility across email clients
- Inline CSS for better email client support
- Proper MIME headers and meta tags
- Mobile-responsive design with media queries

#### 2. **Anti-Spam Measures**
- Proper email headers and structure
- Balanced text-to-image ratio
- No excessive use of promotional language
- Clear sender identification
- Proper unsubscribe links

#### 3. **Accessibility**
- High contrast colors for better readability
- Proper heading structure
- Alt text for images
- Screen reader friendly markup

## Available Email Templates

### 1. **Email Verification** (`sendVerificationEmail`)
- **Purpose**: Verify new user email addresses
- **Expiration**: 24 hours
- **Features**: Clear call-to-action, security warnings, fallback text link

### 2. **Password Reset** (`sendPasswordResetEmail`)
- **Purpose**: Allow users to reset forgotten passwords
- **Expiration**: 1 hour
- **Features**: Security warnings, clear instructions, time-sensitive messaging

### 3. **Welcome Email** (`sendWelcomeEmail`)
- **Purpose**: Welcome verified users to the platform
- **Features**: Profile URL display, next steps guidance, multiple CTAs

### 4. **Password Changed Confirmation** (`sendPasswordChangedEmail`)
- **Purpose**: Notify users when their password is changed
- **Features**: Security alert, timestamp, support contact

### 5. **Account Locked** (`sendAccountLockedEmail`)
- **Purpose**: Notify users when their account is locked
- **Features**: Reason explanation, unlock instructions, support contact

### 6. **Email Change Confirmation** (`sendEmailChangeConfirmationEmail`)
- **Purpose**: Confirm email address changes
- **Expiration**: 24 hours
- **Features**: Security warnings, clear confirmation process

### 7. **Newsletter** (`sendNewsletterEmail`)
- **Purpose**: Send periodic updates to users
- **Features**: Featured content, responsive design, unsubscribe option

### 8. **Account Deletion Confirmation** (`sendAccountDeletionConfirmationEmail`)
- **Purpose**: Confirm account deletion requests
- **Features**: Deletion date, cancellation option, data warning

## Email Deliverability Best Practices

### 1. **Technical Implementation**

#### SMTP Configuration
```typescript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

#### Proper Headers
- `Content-Type: text/html; charset=UTF-8`
- `X-Mailer: LinkBoard/1.0`
- `X-Priority: 3` (Normal priority)
- `Reply-To` header for support emails

### 2. **Content Guidelines**

#### Subject Lines
- Clear and descriptive
- Avoid spam trigger words
- Keep under 50 characters when possible
- Include brand name for recognition

#### HTML Structure
- Use semantic HTML elements
- Proper DOCTYPE declaration
- Table-based layout for compatibility
- Inline CSS for styling

#### Text Content
- Provide both HTML and text versions
- Clear, concise messaging
- Professional tone
- Action-oriented language

### 3. **Anti-Spam Measures**

#### Content Filters
- Avoid excessive use of promotional language
- No ALL CAPS text
- Balanced text-to-image ratio
- No suspicious links or attachments

#### Sender Reputation
- Consistent sender name and email
- Proper SPF, DKIM, and DMARC records
- Regular sending patterns
- Low bounce and complaint rates

#### List Management
- Double opt-in for subscriptions
- Clear unsubscribe process
- Regular list cleaning
- Respect unsubscribe requests immediately

### 4. **Mobile Optimization**

#### Responsive Design
```css
@media only screen and (max-width: 600px) {
  .email-container {
    width: 100% !important;
  }
  .content {
    padding: 20px !important;
  }
  .button {
    display: block !important;
    width: 100% !important;
  }
}
```

#### Touch-Friendly Elements
- Minimum 44px touch targets
- Adequate spacing between links
- Large, readable fonts
- Thumb-friendly navigation

## Environment Variables

### Required SMTP Configuration
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@linkboard.com
```

### Optional Configuration
```bash
APP_URL=https://yourdomain.com
SUPPORT_EMAIL=support@linkboard.com
```

## Testing and Monitoring

### 1. **Email Testing**
- Test across multiple email clients (Gmail, Outlook, Apple Mail)
- Verify mobile responsiveness
- Check spam score using tools like Mail-Tester
- Validate HTML structure

### 2. **Monitoring Metrics**
- Delivery rates
- Open rates
- Click-through rates
- Bounce rates
- Complaint rates
- Unsubscribe rates

### 3. **A/B Testing**
- Subject line variations
- Content length
- Call-to-action placement
- Design elements

## Security Considerations

### 1. **Token Management**
- Use cryptographically secure random tokens
- Implement proper expiration times
- One-time use tokens where appropriate
- Secure token storage

### 2. **Rate Limiting**
- Implement rate limiting for email sending
- Prevent email bombing attacks
- Monitor for suspicious activity
- Implement CAPTCHA for sensitive actions

### 3. **Data Protection**
- Encrypt sensitive data in transit
- Follow GDPR/privacy regulations
- Implement proper data retention policies
- Secure email storage

## Troubleshooting Common Issues

### 1. **Emails Going to Spam**
- Check SPF, DKIM, and DMARC records
- Review content for spam triggers
- Improve sender reputation
- Use dedicated IP if possible

### 2. **Delivery Failures**
- Verify SMTP credentials
- Check firewall settings
- Monitor bounce rates
- Implement proper error handling

### 3. **Rendering Issues**
- Test across email clients
- Use inline CSS
- Avoid complex HTML structures
- Provide text fallbacks

## Future Enhancements

### Planned Features
- Email analytics dashboard
- Advanced personalization
- Automated email sequences
- A/B testing framework
- Advanced segmentation
- Email template editor

### Integration Opportunities
- Email service providers (SendGrid, Mailgun)
- Analytics platforms
- Customer relationship management
- Marketing automation tools

## Support and Maintenance

### Regular Tasks
- Monitor email deliverability metrics
- Update templates based on user feedback
- Test new email clients
- Review and update content
- Maintain security patches

### Contact Information
- Technical Support: support@linkboard.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues Link]

---

*Last updated: ${new Date().toLocaleDateString()}*
*Version: 1.0*
