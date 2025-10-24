import { describe, it, expect } from 'vitest';
import { generateGravatarHash, getGravatarUrl, getGravatarWithFallback, getGravatarWithInitials } from '../gravatar';

describe('Gravatar utilities', () => {
  describe('generateGravatarHash', () => {
    it('should generate consistent hash for same email', () => {
      const email = 'test@example.com';
      const hash1 = generateGravatarHash(email);
      const hash2 = generateGravatarHash(email);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA256 hex length
    });

    it('should handle email case insensitivity', () => {
      const email1 = 'Test@Example.COM';
      const email2 = 'test@example.com';
      
      expect(generateGravatarHash(email1)).toBe(generateGravatarHash(email2));
    });

    it('should trim whitespace', () => {
      const email1 = '  test@example.com  ';
      const email2 = 'test@example.com';
      
      expect(generateGravatarHash(email1)).toBe(generateGravatarHash(email2));
    });
  });

  describe('getGravatarUrl', () => {
    it('should generate basic Gravatar URL', () => {
      const email = 'test@example.com';
      const url = getGravatarUrl(email);
      
      expect(url).toMatch(/^https:\/\/gravatar\.com\/avatar\/[a-f0-9]{64}$/);
    });

    it('should include size parameter', () => {
      const email = 'test@example.com';
      const url = getGravatarUrl(email, { size: 200 });
      
      expect(url).toContain('s=200');
    });

    it('should include default parameter', () => {
      const email = 'test@example.com';
      const fallbackUrl = 'https://example.com/avatar.jpg';
      const url = getGravatarUrl(email, { default: fallbackUrl });
      
      expect(url).toContain(`d=${encodeURIComponent(fallbackUrl)}`);
    });

    it('should include rating parameter', () => {
      const email = 'test@example.com';
      const url = getGravatarUrl(email, { rating: 'pg' });
      
      expect(url).toContain('r=pg');
    });

    it('should include force default parameter', () => {
      const email = 'test@example.com';
      const url = getGravatarUrl(email, { forceDefault: true });
      
      expect(url).toContain('f=y');
    });
  });

  describe('getGravatarWithFallback', () => {
    it('should generate URL with fallback', () => {
      const email = 'test@example.com';
      const fallbackUrl = 'https://example.com/avatar.jpg';
      const url = getGravatarWithFallback(email, fallbackUrl, 150);
      
      expect(url).toContain('s=150');
      expect(url).toContain(`d=${encodeURIComponent(fallbackUrl)}`);
      expect(url).toContain('r=g');
    });
  });

  describe('getGravatarWithInitials', () => {
    it('should generate URL with initials fallback', () => {
      const email = 'test@example.com';
      const name = 'John Doe';
      const url = getGravatarWithInitials(email, name, 200);
      
      expect(url).toContain('s=200');
      expect(url).toContain('d=initials');
      expect(url).toContain('r=g');
    });
  });
});
