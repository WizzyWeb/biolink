## LinkBoard — Open Source Link in Bio Platform

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**A powerful, privacy-first, self-hostable alternative to Linktree and Bio.fm**

LinkBoard is an open-source, customizable "link in bio" tool that allows you to easily organize and share all your important links in one place. Perfect for social media influencers, creators, or professionals, LinkBoard provides a simple yet powerful way to consolidate your online presence with a visually appealing and user-friendly landing page. Whether you're promoting your portfolio, social accounts, or content, LinkBoard makes sharing your links effortless and stylish.

[Features](#features) • [Quick Start](./docs/QUICKSTART.md) • [Roadmap](./docs/ROADMAP.md) • [Contributing](./docs/CONTRIBUTING.md) • [Demo](#demo)

</div>

---

### 🎯 Why LinkBoard?

- ✅ **100% Open Source** - Complete transparency and control
- ✅ **Self-Hosted** - Your data, your rules
- ✅ **No Limits** - Unlimited links, profiles, and analytics
- ✅ **Free Forever** - No premium tiers or paywalls  
- ✅ **Privacy-First** - No tracking, no data selling
- ✅ **Fully Customizable** - Deep customization without restrictions

### ✨ Features

**Current (v1.0):**
- 👤 **Profile Management**: Custom avatar, display name, and bio
- 🔗 **Link Management**: Add, edit, delete, and reorder links with drag & drop
- 📊 **Analytics Dashboard**: Profile views, link clicks, and engagement metrics
- 🎨 **Modern UI**: Responsive design with Tailwind CSS and Radix UI
- 📱 **Share Tools**: One-click copy and social media sharing

**Coming Soon (v2.0+):**
- 🔐 Authentication & multi-user support
- 🎨 Theme customization engine
- 📈 Advanced analytics with geographic & device tracking
- 💳 Payment integration (Stripe, PayPal)
- 🛍️ E-commerce features
- 📧 Email collection & marketing tools

[View all features →](./docs/FEATURES.md) | [See roadmap →](./docs/ROADMAP.md)

### 🛠️ Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI, TanStack Query, Wouter
- **Backend**: Express.js (ESM), Drizzle ORM, Zod validation
- **Database**: PostgreSQL (Neon serverless or self-hosted)
- **Deployment**: Docker, Railway, Vercel, Render, DigitalOcean

---

## Quick Start

1) Install dependencies

```bash
npm install
```

2) Configure environment

Create a `.env` file in the project root with your Postgres connection string (Neon or any Postgres):

```bash
echo 'DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB?sslmode=require' > .env
```

3) Apply schema to the database (creates tables)

```bash
npx drizzle-kit push
# or via package script
npm run db:push
```

4) Seed demo data (optional but recommended)

```bash
NODE_ENV=development tsx server/seed.ts
```

5) Run the app in development

```bash
npm run dev
```

App will serve API and client from the same process. The port defaults to `3000` (or `process.env.PORT`).

---

## Scripts

- `npm run dev` — Starts Express with Vite middleware (development)
- `npm run build` — Builds client to `dist/public` and bundles server to `dist/index.js`
- `npm run start` — Runs the production server from `dist`
- `npm run db:push` — Applies Drizzle schema changes to the database

---

## Environment

Required:

- `DATABASE_URL` — Postgres connection string (e.g., Neon). The server will exit if it is missing.
- `PORT` (optional) — Defaults to `3000`.

The Drizzle config (`drizzle.config.ts`) also requires `DATABASE_URL` to be set when running migrations.

---

## Database & Migrations

- Schema lives in `shared/schema.ts`.
- Drizzle config: `drizzle.config.ts` outputs migrations to `./migrations`.
- Apply changes:

```bash
npm run db:push
```

### Seeding

The seed script creates a demo profile (`username: demo`) and a set of sample links:

```bash
NODE_ENV=development tsx server/seed.ts
```

---

## Development Workflow

```bash
# 1) Install
npm install

# 2) Configure env
echo 'DATABASE_URL=postgres://...' > .env

# 3) Apply schema
npm run db:push

# 4) (Optional) Seed demo data
NODE_ENV=development tsx server/seed.ts

# 5) Start dev server
npm run dev
```

Vite serves the client in middleware mode during development. In production, the server serves the built client from `dist/public`.

---

## Production Build & Run

```bash
# Build client and bundle server
npm run build

# Start production server
npm run start
```

The production server serves static files from `dist/public` and the API under `/api/*`.

---

## Using the App

### Public Profiles

- Visit `/{username}` to view a public profile. The project seeds `demo`, so `http://localhost:3000/demo` should work after seeding.

### Edit Mode (URL‑gated)

- To access edit controls on a profile page, append the query parameter `?edit=true`:

```
http://localhost:3000/{username}?edit=true
```

- When present, an Edit toggle appears in the top‑right. Toggle it to switch between View and Edit. In Edit mode you can:
  - Update profile info
  - Add/edit/delete/reorder links
  - Navigate to the Analytics dashboard

### Analytics

- From Edit mode, click "View Analytics". It routes to `/analytics/{profileId}`.
- The server endpoint `GET /api/analytics/:profileId` returns:
  - Profile views
  - Total link clicks
  - Per‑link clicks

---

## API Overview

Base URL: same origin as the client, under `/api`.

- `GET /api/profile/:username` — returns `{ profile, links }` and increments profile views
- `PATCH /api/profile/:id` — update profile fields
- `POST /api/links` — create a social link
- `PATCH /api/links/:id` — update a link
- `DELETE /api/links/:id` — delete a link
- `PATCH /api/links/reorder` — reorder links, body: `{ linkIds: string[] }`
- `POST /api/links/:id/click` — increments clicks and returns `{ url }`
- `GET /api/analytics/:profileId` — aggregated analytics

---

## Project Structure (key paths)

```
client/              # React app (Vite)
  src/
    pages/
      home.tsx       # Profile page with edit gate via ?edit=true
      analytics.tsx  # Analytics dashboard
server/
  index.ts           # Express app entry
  routes.ts          # API routes
  db.ts              # Drizzle + Neon setup
  storage.ts         # Storage layer (Drizzle queries)
  seed.ts            # Demo data seeding
shared/
  schema.ts          # Drizzle schema & zod validations
vite.config.ts       # Vite config (client build to dist/public)
```

---

## Notes & Tips
- Profile views increment on `GET /api/profile/:username`.
- Link clicks increment on `POST /api/links/:id/click` (also updates profile total clicks).
- In production, ensure your `DATABASE_URL` includes SSL (e.g., Neon uses `?sslmode=require`).

---

## 📚 Documentation

- **[Quick Start Guide](./docs/QUICKSTART.md)** - Get up and running in 10 minutes
- **[Features List](./docs/FEATURES.md)** - Complete feature overview
- **[Development Roadmap](./docs/ROADMAP.md)** - Future plans and timeline
- **[Codebase Analysis](./docs/ANALYSIS.md)** - Technical deep-dive and architecture
- **[Contributing Guide](./docs/CONTRIBUTING.md)** - How to contribute to the project

---

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

**Getting Started:**
1. Read the [Contributing Guide](./docs/CONTRIBUTING.md)
2. Check [open issues](../../issues) or [feature requests](../../discussions)
3. Fork the repository
4. Create a feature branch
5. Submit a pull request

**Ways to Contribute:**
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit code changes
- 💬 Help others in discussions

---

## 🗺️ Roadmap

### Current Focus (Q1 2025)
- [x] User authentication system
- [ ] Multi-user support
- [ ] Security hardening
- [ ] Testing framework

### Upcoming (Q2-Q4 2025)
- [x] Theme customization engine
- [ ] Advanced analytics
- [ ] Payment integration
- [ ] E-commerce features
- [ ] Mobile applications

[View full roadmap →](./ROADMAP.md)

---

## 🌟 Showcase

Using LinkBoard? We'd love to feature your profile!

- Open a [discussion](../../discussions) with your profile URL
- Tag us on Twitter with #LinkBoard
- Get featured in our showcase gallery

---

## 💬 Community & Support

- **Questions?** Use [GitHub Discussions](../../discussions)
- **Bug Reports:** [Issue Tracker](../../issues)
- **Feature Requests:** [Discussions](../../discussions)
- **Discord:** Coming soon!
- **Twitter:** [@linkboard](#) (Coming soon)

---

## 🏆 Acknowledgments

Built with amazing open-source technologies:
- [React](https://react.dev) - UI framework
- [Drizzle ORM](https://orm.drizzle.team) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Radix UI](https://www.radix-ui.com) - Accessible components
- [TanStack Query](https://tanstack.com/query) - Data fetching

---

## 📊 Project Status

![GitHub stars](https://img.shields.io/github/stars/yourusername/linkboard?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/linkboard?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/linkboard)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/linkboard)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**In short:** You can use, modify, and distribute this project freely. Attribution is appreciated but not required.

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! It helps us reach more developers and grow the community.

---

<div align="center">

**Made with ❤️ by the open-source community**

[⬆ Back to Top](#biolink--open-source-link-in-bio-platform)

</div>



