# Contributing to BioLink

Thank you for your interest in contributing to BioLink! This document provides guidelines and instructions for contributing.

---

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behavior includes:**
- Harassment, trolling, or derogatory comments
- Personal or political attacks
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 How to Contribute

### Ways to Contribute

1. **Report Bugs** - Found a bug? Let us know!
2. **Suggest Features** - Have an idea? Share it!
3. **Write Documentation** - Help others understand
4. **Submit Code** - Fix bugs or add features
5. **Review PRs** - Help review contributions
6. **Answer Questions** - Help others in discussions

---

## 🐛 Reporting Bugs

### Before Submitting

1. Check if the bug has already been reported in [Issues](../docs/../docs/issues)
2. Make sure you're using the latest version
3. Collect information about the bug

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome 96, Safari 15]
- Node version: [e.g. 18.0.0]
- Database: [e.g. PostgreSQL 15, Neon]

**Additional context**
Any other context about the problem.
```

---

## 💡 Suggesting Features

### Before Submitting

1. Check the [Roadmap](./docs/ROADMAP.md) - it might be planned!
2. Search [existing issues](../docs/../docs/issues) for similar suggestions
3. Consider if it fits the project's scope and vision

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. Ex. I'm frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Screenshots, mockups, or examples from other platforms.

**Would you be willing to contribute this feature?**
Yes/No - We appreciate any help!
```

---

## 🔧 Development Setup

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database (local or Neon)
- Git
- Code editor (VS Code recommended)

### Setup Steps

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/biolink.git
   cd biolink
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/biolink.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

6. **Initialize database**
   ```bash
   npm run db:push
   NODE_ENV=development tsx server/seed.ts
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

---

## 📝 Development Workflow

### 1. Create a Branch

```bash
# Update your local main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

**Follow these guidelines:**
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed
- Write/update tests for your changes

### 3. Test Your Changes

```bash
# Type checking
npm run check

# Run tests (when available)
npm test

# Test the build
npm run build
npm run start
```

### 4. Commit Your Changes

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

**Examples:**
```bash
git commit -m "feat(analytics): add device type tracking"
git commit -m "fix(auth): resolve session timeout issue"
git commit -m "docs(readme): update installation steps"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Submit a Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request" button
3. Select your branch
4. Fill in the PR template
5. Submit!

---

## 📋 Pull Request Guidelines

### PR Checklist

Before submitting your PR, ensure:

- [ ] Code follows the project's style guidelines
- [ ] Self-review of your own code completed
- [ ] Comments added to complex code
- [ ] Documentation updated (if applicable)
- [ ] No new warnings generated
- [ ] Tests added/updated (if applicable)
- [ ] All tests passing
- [ ] PR title follows convention: `type(scope): description`
- [ ] PR description explains what and why

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issue
Fixes #(issue number)

## How Has This Been Tested?
Describe the tests you ran.

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
```

---

## 🎨 Code Style Guidelines

### TypeScript/JavaScript

```typescript
// ✅ Good
interface ProfileData {
  username: string;
  displayName: string;
}

async function getProfile(username: string): Promise<ProfileData> {
  const profile = await storage.getProfile(username);
  if (!profile) {
    throw new Error('Profile not found');
  }
  return profile;
}

// ❌ Bad
function getProfile(username) {
  let profile = storage.getProfile(username)
  return profile
}
```

**Guidelines:**
- Use TypeScript with proper types
- Use `async/await` over callbacks
- Use `const` and `let`, avoid `var`
- Use meaningful variable names
- Prefer functional patterns
- Keep functions small and focused

### React Components

```tsx
// ✅ Good
interface LinkCardProps {
  link: SocialLink;
  isEditMode: boolean;
  onDelete: () => void;
}

export default function LinkCard({ link, isEditMode, onDelete }: LinkCardProps) {
  const handleClick = async () => {
    // Handle click
  };

  return (
    <div className="link-card">
      {/* Content */}
    </div>
  );
}

// ❌ Bad
export default function LinkCard(props) {
  return <div>{props.link.title}</div>
}
```

**Guidelines:**
- Use functional components with hooks
- Define prop types with TypeScript interfaces
- Keep components focused (single responsibility)
- Extract reusable logic to custom hooks
- Use semantic HTML
- Follow accessibility best practices

### CSS/Tailwind

```tsx
// ✅ Good
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">

// ❌ Bad
<div className="flex items-center" style={{ gap: '1rem', padding: '1.5rem' }}>
```

**Guidelines:**
- Use Tailwind utility classes
- Avoid inline styles
- Use design tokens (colors, spacing)
- Mobile-first responsive design
- Dark mode considerations

### Database/SQL

```typescript
// ✅ Good
const profiles = await db
  .select()
  .from(profiles)
  .where(eq(profiles.username, username))
  .limit(1);

// ❌ Bad
const profiles = await db.execute(
  `SELECT * FROM profiles WHERE username = '${username}'`
);
```

**Guidelines:**
- Always use Drizzle ORM, never raw SQL
- Use parameterized queries (Drizzle does this)
- Add proper indexes
- Use transactions for multi-step operations

---

## 🧪 Testing Guidelines

### Unit Tests

```typescript
// Example test structure (when implemented)
import { describe, it, expect } from 'vitest';
import { storage } from '../docs/storage';

describe('Profile Storage', () => {
  it('should create a new profile', async () => {
    const profile = await storage.createProfile({
      username: 'test',
      displayName: 'Test User',
      bio: 'Test bio'
    });
    
    expect(profile).toBeDefined();
    expect(profile.username).toBe('test');
  });

  it('should get profile by username', async () => {
    const profile = await storage.getProfile('test');
    expect(profile).toBeDefined();
  });
});
```

### E2E Tests

```typescript
// Example E2E test (when implemented)
import { test, expect } from '@playwright/test';

test('user can add a new link', async ({ page }) => {
  await page.goto('/demo?edit=true');
  await page.click('[data-testid="button-add-link"]');
  
  await page.fill('[name="title"]', 'My Website');
  await page.fill('[name="url"]', 'https://example.com');
  await page.click('[data-testid="button-save"]');
  
  await expect(page.locator('text=My Website')).toBeVisible();
});
```

---

## 📚 Documentation Guidelines

### Code Documentation

```typescript
/**
 * Retrieves a profile by username and increments view count
 * 
 * @param username - The unique username to look up
 * @returns Promise resolving to profile data or undefined if not found
 * @throws Error if database connection fails
 * 
 * @example
 * const profile = await getProfile('johndoe');
 */
async function getProfile(username: string): Promise<Profile | undefined> {
  // Implementation
}
```

### README Documentation

- Clear, concise descriptions
- Step-by-step instructions
- Code examples
- Screenshots/GIFs for UI features
- Troubleshooting section

---

## 🔍 Review Process

### What We Look For

**Code Quality:**
- Follows style guidelines
- Properly typed
- Well-tested
- No unnecessary complexity

**Functionality:**
- Works as intended
- No regressions
- Edge cases handled
- Error handling present

**Documentation:**
- Code is documented
- User docs updated
- API changes documented

### Review Timeline

- Initial review: Within 3-5 days
- Follow-up reviews: Within 1-2 days
- Complex PRs may take longer

### Addressing Feedback

```bash
# Make requested changes
git add .
git commit -m "fix: address review feedback"
git push origin feature/your-feature-name
```

---

## 🏷️ Issue Labels

Understanding our labels:

**Type:**
- `bug` - Something isn't working
- `feature` - New feature request
- `enhancement` - Improvement to existing feature
- `documentation` - Documentation changes

**Priority:**
- `critical` - Urgent, needs immediate attention
- `high` - Important, should be done soon
- `medium` - Moderate priority
- `low` - Nice to have

**Status:**
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `in progress` - Being worked on
- `needs review` - Waiting for review

**Area:**
- `frontend` - Client-side code
- `backend` - Server-side code
- `database` - Database related
- `devops` - Deployment/infrastructure

---

## 🎓 Resources for Contributors

### Learning Resources

**Frontend:**
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

**Backend:**
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

### Project-Specific

- [Architecture Overview](./docs/ANALYSIS.md)
- [Development Roadmap](./docs/ROADMAP.md)
- [Quick Start Guide](./docs/QUICKSTART.md)

---

## 🎁 Recognition

### Contributors Hall of Fame

All contributors will be recognized in:
- README.md Contributors section
- Release notes
- Project website (when available)

### Becoming a Maintainer

Regular contributors may be invited to become maintainers. Criteria:
- Consistent, quality contributions
- Deep understanding of codebase
- Active in discussions and reviews
- Aligned with project vision

---

## 📞 Getting Help

### Where to Ask Questions

1. **GitHub Discussions** - General questions and ideas
2. **Discord** - Real-time chat (coming soon)
3. **Issue Comments** - Specific to an issue
4. **Email** - Private or sensitive matters

### Response Times

- Issues: 3-5 days
- PRs: 3-5 days for initial review
- Discussions: 1-7 days
- Email: 5-7 days

---

## 🚀 First-Time Contributors

### Good First Issues

Look for issues labeled `good first issue`:
- Well-defined scope
- Clear acceptance criteria
- Guidance provided
- Good learning opportunity

### Your First PR

1. Find a `good first issue`
2. Comment that you'd like to work on it
3. Wait for assignment
4. Ask questions if unclear
5. Submit PR when ready
6. Address feedback
7. Celebrate! 🎉

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

## 🙏 Thank You!

Every contribution, no matter how small, is valuable. Whether you:
- Fixed a typo
- Reported a bug
- Suggested a feature
- Wrote code
- Reviewed a PR
- Helped someone in discussions

**You're making BioLink better for everyone. Thank you!** ❤️

---

## 📝 Questions?

If you have questions about contributing:
1. Check this guide
2. Search existing discussions
3. Ask in GitHub Discussions
4. Reach out to maintainers

**Happy Contributing! 🚀**

