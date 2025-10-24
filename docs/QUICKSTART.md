# 🚀 Quick Start Guide - BioLink

A rapid-fire guide to get your BioLink instance up and running in under 10 minutes.

---

## ⚡ 1-Minute Deploy (Docker)

```bash
# Clone the repository
git clone https://github.com/yourusername/biolink.git
cd biolink

# Set up environment
cp .env.example .env
# Edit .env and add your DATABASE_URL

# Run with Docker
docker-compose up -d

# Visit http://localhost:3000
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL (or Neon account)
- npm or pnpm

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Configure database
echo 'DATABASE_URL=postgresql://user:password@localhost:5432/biolink' > .env

# 3. Push schema to database
npm run db:push

# 4. Seed demo data (optional)
NODE_ENV=development tsx server/seed.ts

# 5. Start development server
npm run dev
```

Visit `http://localhost:3000/demo` to see the seeded profile.

---

## 🎯 First Steps After Installation

### 1. Access Edit Mode
Add `?edit=shivam` to any profile URL to access edit mode:
```
http://localhost:3000/demo?edit=shivam
```

⚠️ **Security Note:** This is a temporary auth mechanism. Replace with proper authentication before production use.

### 2. Create Your Profile
1. Toggle "Edit Profile" mode
2. Click "Edit Profile" button
3. Update your info:
   - Display name
   - Bio
   - Profile image URL
   - Username

### 3. Add Your Links
1. Click "Add New Link"
2. Choose platform (Instagram, Twitter, GitHub, etc.)
3. Fill in details:
   - Title
   - URL
   - Description (optional)
4. Save and watch it appear!

### 4. View Analytics
1. In edit mode, click "View Analytics"
2. See your:
   - Profile views
   - Total link clicks
   - Per-link performance
   - Engagement rate

---

## 🎨 Customization (Current Capabilities)

### Profile Customization
- Avatar/profile image
- Display name
- Bio (supports line breaks)

### Link Customization
- Platform selection (affects icon & color)
- Custom title & description
- Drag-to-reorder
- Show/hide individual links

### Supported Platforms
- Instagram
- Twitter/X
- LinkedIn
- TikTok
- YouTube
- GitHub
- Website
- Newsletter
- Custom links

---

## 📊 Understanding Analytics

### Metrics Tracked

**Profile Views:**
- Incremented on every page load
- Helps measure reach

**Link Clicks:**
- Tracks when users click your links
- Per-link breakdown available

**Engagement Rate:**
- Clicks ÷ Views × 100
- Shows how engaging your content is
- 20%+ is considered excellent

---

## 🔧 Environment Variables

### Required
```bash
DATABASE_URL=postgresql://user:password@host:port/database
```

### Optional
```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development        # Environment mode
```

---

## 📝 Database Setup Options

### Option 1: Neon (Recommended for Beginners)
1. Visit [neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string
5. Add to `.env`:
   ```bash
   DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Option 2: Local PostgreSQL
```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql
createdb biolink

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql
sudo systemctl start postgresql
sudo -u postgres createdb biolink

# Connection string
DATABASE_URL=postgresql://localhost:5432/biolink
```

### Option 3: Docker PostgreSQL
```bash
docker run -d \
  --name biolink-db \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=biolink \
  -p 5432:5432 \
  postgres:15

# Connection string
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/biolink
```

---

## 🚀 Deployment Options

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Railway (Full Stack)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Click "Deploy on Railway"
2. Add PostgreSQL service
3. Set `DATABASE_URL` environment variable
4. Deploy!

### Render
1. Create new Web Service
2. Connect your repository
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

### DigitalOcean App Platform
1. Create new app
2. Link GitHub repository
3. Add managed PostgreSQL database
4. Configure environment
5. Deploy

---

## 🐳 Docker Deployment

### Docker Compose (Recommended)

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://biolink:biolink@db:5432/biolink
      NODE_ENV: production
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: biolink
      POSTGRES_PASSWORD: biolink
      POSTGRES_DB: biolink
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up -d
```

### Manual Docker Build
```bash
# Build image
docker build -t biolink .

# Run container
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL=your_database_url \
  --name biolink \
  biolink
```

---

## 🔍 Troubleshooting

### Database Connection Issues

**Problem:** `Connection refused` or `Cannot connect to database`

**Solution:**
1. Verify DATABASE_URL is correct
2. Check database is running: `pg_isready`
3. Ensure firewall allows connection
4. For Neon, verify `?sslmode=require` is in URL

### Build Errors

**Problem:** `Module not found` errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use

**Problem:** `Port 3000 already in use`

**Solution:**
```bash
# Use different port
PORT=3000 npm run dev

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Drizzle Migration Issues

**Problem:** Tables don't exist

**Solution:**
```bash
# Push schema to database
npm run db:push

# Or generate and run migrations
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## 📱 Mobile Testing

### Local Network Testing
```bash
# Find your local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Access from phone
http://YOUR_IP:3000/demo
```

### ngrok for Public URL
```bash
# Install ngrok
npm install -g ngrok

# Create tunnel
ngrok http 3000

# Use provided URL
https://abc123.ngrok.io
```

---

## 🎓 Learning Resources

### Understanding the Stack

**Frontend:**
- [React Docs](https://react.dev)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)

**Backend:**
- [Express.js](https://expressjs.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Zod Validation](https://zod.dev)

**Database:**
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Neon Docs](https://neon.tech/docs)

---

## 🤝 Getting Help

### Resources
- 📖 [Full Documentation](./README.md)
- 🗺️ [Roadmap](./ROADMAP.md)
- 🔍 [Codebase Analysis](./ANALYSIS.md)
- 💬 [GitHub Discussions](./discussions)
- 🐛 [Issue Tracker](./issues)

### Community
- Discord: [Join Server](#)
- Twitter: [@biolink](#)
- Email: support@biolink.dev

---

## ⚡ Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Run production build

# Database
npm run db:push         # Push schema changes
npx drizzle-kit studio  # Open database studio

# Seed
NODE_ENV=development tsx server/seed.ts

# Type checking
npm run check           # TypeScript check

# Lint (if configured)
npm run lint            # Run linter
```

---

## 🎯 Next Steps

Now that you have BioLink running:

1. ✅ Customize your profile
2. ✅ Add your social links
3. ✅ Share your profile URL
4. ✅ Monitor analytics
5. 📖 Read the [Roadmap](./ROADMAP.md) for upcoming features
6. 🤝 Consider [Contributing](./CONTRIBUTING.md)
7. ⭐ Star the repo if you find it useful!

---

## 🔐 Security Reminder

**Before going to production:**

1. Replace URL parameter auth with proper authentication
2. Set up HTTPS/SSL
3. Configure CORS properly
4. Add rate limiting
5. Enable security headers
6. Review [Security Checklist](./ANALYSIS.md#security-checklist)

---

## 📈 Performance Tips

### Frontend Optimization
- Enable production builds
- Use CDN for static assets
- Implement lazy loading
- Optimize images

### Backend Optimization
- Add database indexes
- Implement caching (Redis)
- Use connection pooling
- Enable compression

### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_social_links_profile_id ON social_links(profile_id);
CREATE INDEX idx_social_links_order ON social_links(profile_id, "order");
```

---

## 💡 Pro Tips

1. **Custom Domain:** Use Cloudflare for free SSL and DNS
2. **Analytics:** Keep checking engagement rates to optimize link order
3. **SEO:** Update your bio regularly with relevant keywords
4. **Backups:** Set up automated database backups
5. **Monitoring:** Use UptimeRobot for free uptime monitoring

---

**Happy Linking! 🎉**

If you build something cool with BioLink, we'd love to hear about it! Share on Twitter with #BioLink or open a discussion on GitHub.

