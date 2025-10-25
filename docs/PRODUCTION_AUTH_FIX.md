# Production Authentication Fix

## Problem
Users can successfully log in (POST /api/auth/login returns 200), but subsequent requests to GET /api/auth/user return 401 "Not authenticated". This indicates a session/cookie persistence issue in production.

## Root Causes
1. **Cookie Security Settings**: `secure: true` requires HTTPS in production
2. **Domain/CORS Issues**: Cookies may not be sent due to domain mismatches
3. **Session Store Issues**: PostgreSQL session store connection problems
4. **Proxy Configuration**: Load balancers or reverse proxies may strip cookies

## Solutions Implemented

### 1. Flexible Cookie Security
```typescript
secure: process.env.NODE_ENV === "production" && process.env.FORCE_HTTPS !== "false"
```
- Allows disabling secure cookies if HTTPS is not properly configured
- Set `FORCE_HTTPS=false` environment variable to disable secure cookies

### 2. Domain Configuration
```typescript
...(process.env.NODE_ENV === "production" && process.env.COOKIE_DOMAIN && {
  domain: process.env.COOKIE_DOMAIN
})
```
- Allows setting explicit cookie domain for production
- Set `COOKIE_DOMAIN=yourdomain.com` if needed

### 3. Debug Logging
Added comprehensive debug logging to identify the exact issue:
- Session creation and saving
- Cookie headers
- Request headers
- Session store connectivity

## Environment Variables for Production

Add these to your production environment:

```bash
# Required
SESSION_SECRET=your-very-secure-session-secret-here

# Optional - only if you have HTTPS issues
FORCE_HTTPS=false

# Optional - only if you have domain issues
COOKIE_DOMAIN=yourdomain.com
```

## Troubleshooting Steps

### 1. Check Debug Logs
Look for these log entries in production:
- `Login debug:` - Shows session creation
- `Session saved successfully:` - Confirms session persistence
- `Auth debug:` - Shows session retrieval attempts

### 2. Common Issues and Solutions

#### Issue: Cookies not being sent
**Symptoms**: `cookies: undefined` in debug logs
**Solutions**:
- Set `FORCE_HTTPS=false` if not using HTTPS
- Check if domain matches exactly
- Verify CORS configuration

#### Issue: Session not persisting
**Symptoms**: Session exists during login but not in subsequent requests
**Solutions**:
- Check PostgreSQL connection for session store
- Verify `SESSION_SECRET` is set correctly
- Check if session table exists in database

#### Issue: Domain mismatch
**Symptoms**: Cookies sent but not received
**Solutions**:
- Set `COOKIE_DOMAIN` to your exact domain
- Ensure frontend and backend are on same domain
- Check for subdomain issues

### 3. Database Session Store
Ensure the sessions table exists:
```sql
-- Check if sessions table exists
SELECT * FROM information_schema.tables WHERE table_name = 'sessions';

-- If not, create it (connect-pg-simple should do this automatically)
-- But you can manually create if needed
```

### 4. Testing the Fix
1. Deploy the updated code
2. Check production logs for debug output
3. Test login flow:
   - Login should show "Login debug" and "Session saved successfully"
   - Subsequent /api/auth/user should show "Auth debug" with session data
4. If still failing, check the specific debug output to identify the issue

## Rollback Plan
If the fix causes issues, you can:
1. Remove debug logging by setting `NODE_ENV=development` temporarily
2. Revert to original cookie settings by removing the environment variables
3. The debug logging will automatically disable in non-production environments

## Long-term Solutions
1. **Proper HTTPS**: Configure SSL/TLS certificates properly
2. **Domain Strategy**: Use consistent domain strategy (subdomain vs path-based)
3. **Session Monitoring**: Add session health checks
4. **Cookie Analytics**: Monitor cookie acceptance rates

## Files Modified
- `server/routes.ts`: Updated session configuration and added debug logging
- `server/auth.ts`: Added login debug logging
